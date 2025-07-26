# Teste: Fluxo de Verificação de Conta

## **Visão Geral**

Este guia testa o sistema de verificação de conta onde usuários não verificados são redirecionados para uma página de upload de documento.

## **Pré-requisitos**

1. Backend implementado com o campo `isVerified` no modelo User
2. Endpoint `/user/verification` funcionando
3. Endpoint `/user/me` retornando o campo `isVerified`

## **Como Testar**

### **1. Teste de Registro de Usuário Novo**

1. **Faça logout** da aplicação
2. **Registre um novo usuário** em `/register`
3. **Verifique se é redirecionado** para `/verification`
4. **Confirme que não consegue acessar** `/main` diretamente

**Logs esperados:**

```javascript
"=== fetchUser START ===";
"Fetched user data from backend: {id: 1, name: '...', isVerified: false, ...}";
"=== fetchUser SUCCESS ===";
// Redirecionamento para /verification
```

### **2. Teste da Página de Verificação**

1. **Acesse a página de verificação** (`/verification`)
2. **Verifique se as informações do usuário** são exibidas
3. **Teste o upload de arquivo**:
   - Selecione uma imagem válida (JPG, PNG)
   - Verifique se o preview aparece
   - Clique em "Upload Document"

**Logs esperados:**

```javascript
"=== updateVerification START ===";
"Uploading verification document: document.jpg";
"Backend verification upload response: {success: true, documentId: 1}";
"=== updateVerification SUCCESS ===";
```

### **3. Teste de Validação de Arquivo**

1. **Tente fazer upload de arquivo inválido**:
   - Arquivo não-imagem (PDF, TXT)
   - Arquivo muito grande (>5MB)
   - Sem arquivo selecionado
2. **Verifique se as mensagens de erro** aparecem corretamente

**Mensagens de erro esperadas:**

- "Please select an image file (JPG, PNG, etc.)"
- "File size must be less than 5MB"
- "Please select a file first"

### **4. Teste de Login com Usuário Não Verificado**

1. **Faça logout** da aplicação
2. **Faça login** com um usuário que tem `isVerified: false`
3. **Verifique se é redirecionado** para `/verification`

**Logs esperados:**

```javascript
"Login response: {access_token: '...'}";
"=== fetchUser START ===";
"Fetched user data: {isVerified: false, ...}";
// Redirecionamento para /verification
```

### **5. Teste de Login com Usuário Verificado**

1. **No backend, marque um usuário como verificado**:
   ```sql
   UPDATE users SET isVerified = true WHERE email = 'user@example.com';
   ```
2. **Faça login** com esse usuário
3. **Verifique se é redirecionado** para `/main`

**Logs esperados:**

```javascript
"Fetched user data: {isVerified: true, ...}";
// Redirecionamento para /main
```

### **6. Teste de Acesso Direto às Páginas**

1. **Com usuário não verificado**:
   - Tente acessar `/main` diretamente
   - Tente acessar `/wallet` diretamente
   - Tente acessar `/profile` diretamente
2. **Verifique se é redirecionado** para `/verification`

### **7. Teste de Upload Bem-sucedido**

1. **Faça upload de um documento válido**
2. **Verifique se a mensagem de sucesso** aparece
3. **Verifique se o botão de logout** funciona

**Mensagem esperada:**

- "Document uploaded successfully! Your account is being reviewed."

## **Testes no Backend**

### **1. Teste do Endpoint de Upload**

```bash
# Teste de upload válido
curl -X POST http://localhost:3000/user/verification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "document=@/path/to/document.jpg"

# Resposta esperada:
{
  "success": true,
  "message": "Document uploaded successfully",
  "documentId": 1
}
```

### **2. Teste do Endpoint /user/me**

```bash
curl -X GET http://localhost:3000/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Resposta esperada:
{
  "id": 1,
  "name": "User Name",
  "email": "user@example.com",
  "balance": "50.00",
  "evaluationLimit": 10,
  "isVerified": false,
  "paypalAccount": null,
  "bankAccount": null,
  "registrationDate": "2024-01-01T00:00:00.000Z"
}
```

### **3. Teste de Validação de Arquivo**

```bash
# Teste com arquivo muito grande
curl -X POST http://localhost:3000/user/verification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "document=@/path/to/large-file.jpg"

# Resposta esperada:
{
  "success": false,
  "message": "File size must be less than 5MB"
}
```

## **Cenários de Erro**

### **1. Usuário Não Logado**

- Tentar acessar `/verification` sem estar logado
- **Resultado esperado**: Redirecionamento para `/login`

### **2. Arquivo Inválido**

- Upload de arquivo não-imagem
- **Resultado esperado**: Mensagem de erro "Please select an image file"

### **3. Arquivo Muito Grande**

- Upload de arquivo >5MB
- **Resultado esperado**: Mensagem de erro "File size must be less than 5MB"

### **4. Erro de Rede**

- Falha na conexão com o backend
- **Resultado esperado**: Mensagem de erro "Failed to upload document"

### **5. Backend Não Implementado**

- Endpoint `/user/verification` não existe
- **Resultado esperado**: Erro 404 ou 500

## **Verificação Visual**

### **1. Página de Verificação**

- [ ] Logo da aplicação visível
- [ ] Título "Account Verification Required"
- [ ] Informações do usuário exibidas
- [ ] Área de upload de arquivo
- [ ] Botão "Upload Document"
- [ ] Botão "Logout"
- [ ] Instruções sobre documentos aceitos

### **2. Estados da Interface**

- [ ] Estado inicial (sem arquivo selecionado)
- [ ] Preview do arquivo selecionado
- [ ] Estado de upload (loading)
- [ ] Mensagem de sucesso
- [ ] Mensagens de erro

### **3. Responsividade**

- [ ] Funciona em desktop
- [ ] Funciona em mobile
- [ ] Interface adaptável

## **Troubleshooting**

### **Problema: Usuário não é redirecionado para verificação**

- Verifique se o campo `isVerified` está sendo retornado pelo `/user/me`
- Confirme se o valor é `false` para usuários não verificados
- Verifique os logs de login

### **Problema: Upload não funciona**

- Verifique se o endpoint `/user/verification` está implementado
- Confirme se o backend aceita `multipart/form-data`
- Verifique se a pasta de uploads existe

### **Problema: Usuário verificado não consegue acessar /main**

- Verifique se o campo `isVerified` está sendo retornado como `true`
- Confirme se o redirecionamento está funcionando corretamente
- Verifique se não há cache do navegador

### **Problema: Mensagens de erro não aparecem**

- Verifique se o componente `Alert` está funcionando
- Confirme se os estados de erro estão sendo definidos
- Verifique se o CSS está carregado corretamente

## **Comandos SQL para Teste**

```sql
-- Verificar status de verificação de um usuário
SELECT id, name, email, isVerified FROM users WHERE email = 'user@example.com';

-- Marcar usuário como verificado (para teste)
UPDATE users SET isVerified = true WHERE email = 'user@example.com';

-- Marcar usuário como não verificado (para teste)
UPDATE users SET isVerified = false WHERE email = 'user@example.com';

-- Verificar documentos de verificação
SELECT * FROM verification_documents WHERE userId = 1;
```
