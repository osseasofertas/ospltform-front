# Sistema de Verificação de Conta

## **Visão Geral**

O sistema de verificação de conta requer que usuários façam upload de um documento de identificação antes de poderem usar a aplicação.

## **Mudanças no Banco de Dados**

### **1. Adicionar campo `isVerified` ao modelo User**

```prisma
model User {
  id Int @id @default(autoincrement())
  name String
  email String @unique
  passwordHash String
  balance Float @default(50.0)
  evaluationLimit Int @default(10)
  isVerified Boolean @default(false)  // ← NOVO CAMPO
  paypalAccount String?
  bankAccount String?
  registrationDate DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  transactions Transaction[]
  evaluations Evaluation[]
  dailyStats DailyStats[]
  loginBlocks LoginBlock[]
}
```

### **2. Criar modelo para documentos de verificação**

```prisma
model VerificationDocument {
  id Int @id @default(autoincrement())
  userId Int
  fileName String
  filePath String
  fileSize Int
  mimeType String
  status VerificationStatus @default(PENDING)
  uploadedAt DateTime @default(now())
  reviewedAt DateTime?
  reviewedBy Int?
  rejectionReason String?

  user User @relation(fields: [userId], references: [id])
  reviewer User? @relation("DocumentReviewer", fields: [reviewedBy], references: [id])

  @@map("verification_documents")
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

## **Endpoints do Backend**

### **1. Upload de Documento de Verificação**

```typescript
// POST /user/verification
// Content-Type: multipart/form-data

interface VerificationUploadRequest {
  document: File; // Imagem do documento
}

interface VerificationUploadResponse {
  success: boolean;
  message: string;
  documentId?: number;
}
```

**Implementação:**

```typescript
app.post("/user/verification", upload.single("document"), async (req, res) => {
  try {
    const userId = req.user.id; // Do middleware de autenticação
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No document provided",
      });
    }

    // Validar tipo de arquivo
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed",
      });
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File size must be less than 5MB",
      });
    }

    // Salvar arquivo
    const fileName = `verification_${userId}_${Date.now()}.${file.originalname
      .split(".")
      .pop()}`;
    const filePath = `uploads/verification/${fileName}`;

    // Mover arquivo para pasta de uploads
    await fs.promises.writeFile(filePath, file.buffer);

    // Criar registro no banco
    const document = await prisma.verificationDocument.create({
      data: {
        userId,
        fileName: file.originalname,
        filePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: "PENDING",
      },
    });

    res.json({
      success: true,
      message: "Document uploaded successfully",
      documentId: document.id,
    });
  } catch (error) {
    console.error("Verification upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload document",
    });
  }
});
```

### **2. Atualizar endpoint `/user/me`**

```typescript
// GET /user/me
// Deve retornar o campo isVerified

interface UserResponse {
  id: number;
  name: string;
  email: string;
  balance: string;
  evaluationLimit: number;
  isVerified: boolean; // ← NOVO CAMPO
  paypalAccount?: string;
  bankAccount?: string;
  registrationDate: string;
  // ... outros campos
}
```

**Implementação:**

```typescript
app.get("/user/me", async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        evaluationLimit: true,
        isVerified: true, // ← NOVO CAMPO
        paypalAccount: true,
        bankAccount: true,
        registrationDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
```

### **3. Endpoint para Admin Aprovar/Rejeitar Documentos**

```typescript
// PATCH /admin/verification/:documentId
// Apenas para administradores

interface VerificationReviewRequest {
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string; // Obrigatório se status = REJECTED
}

interface VerificationReviewResponse {
  success: boolean;
  message: string;
}
```

**Implementação:**

```typescript
app.patch("/admin/verification/:documentId", async (req, res) => {
  try {
    const { documentId } = req.params;
    const { status, rejectionReason } = req.body;
    const adminId = req.user.id; // Do middleware de autenticação

    // Verificar se é admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Validar dados
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (status === "REJECTED" && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    // Atualizar documento
    const document = await prisma.verificationDocument.update({
      where: { id: parseInt(documentId) },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: adminId,
        rejectionReason: status === "REJECTED" ? rejectionReason : null,
      },
      include: {
        user: true,
      },
    });

    // Se aprovado, marcar usuário como verificado
    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: document.userId },
        data: { isVerified: true },
      });
    }

    res.json({
      success: true,
      message: `Document ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Verification review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to review document",
    });
  }
});
```

### **4. Endpoint para Listar Documentos Pendentes (Admin)**

```typescript
// GET /admin/verification/pending
// Lista documentos pendentes de revisão

interface PendingDocumentsResponse {
  documents: Array<{
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    fileName: string;
    uploadedAt: string;
  }>;
}
```

## **Fluxo de Verificação**

### **1. Registro de Usuário**

- Usuário se registra
- `isVerified` é definido como `false` por padrão
- Usuário é redirecionado para `/verification`

### **2. Upload de Documento**

- Usuário faz upload de documento de identificação
- Documento é salvo e status definido como `PENDING`
- Usuário aguarda aprovação

### **3. Revisão por Admin**

- Admin acessa painel de documentos pendentes
- Admin revisa documento e aprova/rejeita
- Se aprovado: `isVerified` é definido como `true`
- Se rejeitado: usuário pode fazer novo upload

### **4. Acesso à Aplicação**

- Usuários com `isVerified: true` podem acessar todas as funcionalidades
- Usuários com `isVerified: false` são redirecionados para `/verification`

## **Configuração de Upload**

### **1. Instalar dependências**

```bash
npm install multer
```

### **2. Configurar middleware de upload**

```typescript
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});
```

### **3. Criar pasta de uploads**

```bash
mkdir -p uploads/verification
```

## **Testes**

### **1. Teste de Upload**

```bash
curl -X POST http://localhost:3000/user/verification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "document=@/path/to/document.jpg"
```

### **2. Teste de Login com Verificação**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### **3. Verificar Status do Usuário**

```bash
curl -X GET http://localhost:3000/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## **Segurança**

### **1. Validação de Arquivos**

- Apenas imagens (JPG, PNG, etc.)
- Tamanho máximo: 5MB
- Validação de tipo MIME

### **2. Armazenamento Seguro**

- Arquivos salvos fora da pasta pública
- Nomes de arquivo únicos
- Acesso restrito apenas para admins

### **3. Autenticação**

- Apenas usuários logados podem fazer upload
- Apenas admins podem revisar documentos
- Tokens JWT obrigatórios
