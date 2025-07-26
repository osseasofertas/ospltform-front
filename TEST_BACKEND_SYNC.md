# Teste: Sistema Sincronizado com Backend

## **Visão Geral**

Este guia testa o sistema de KYC que sincroniza com o backend, mantendo o upload simulado mas atualizando dados no banco.

## **Funcionalidades**

### **1. Upload Simulado + Backend Sync**

- ✅ Upload simulado (não envia arquivo)
- ✅ `verifiedDate` salvo no backend
- ✅ Estado local sincronizado

### **2. Auto-Verificação (34 horas)**

- ✅ Verifica backend e local
- ✅ Atualiza `isVerified: true` no banco
- ✅ Sincroniza estado local

### **3. Verificação Manual (KYC Success)**

- ✅ Atualiza `isVerified: true` no banco
- ✅ Sincroniza estado local
- ✅ Redireciona para `/main`

## **Endpoints Necessários**

### **1. PATCH /api/user/verified-date**

```typescript
// Registra data de upload do documento
app.patch("/api/user/verified-date", async (req, res) => {
  const { verifiedDate } = req.body;
  await prisma.user.update({
    where: { id: req.user.id },
    data: { verifiedDate: new Date(verifiedDate) },
  });
  res.json({ success: true });
});
```

### **2. PATCH /api/user/verify**

```typescript
// Atualiza status de verificação
app.patch("/api/user/verify", async (req, res) => {
  const { isVerified } = req.body;
  await prisma.user.update({
    where: { id: req.user.id },
    data: { isVerified: Boolean(isVerified) },
  });
  res.json({ success: true });
});
```

## **Como Testar**

### **1. Teste de Upload + Backend Sync**

1. **Faça login** com usuário não verificado
2. **Acesse** `/verification`
3. **Faça upload** de um documento
4. **Verifique logs**:
   ```javascript
   "=== updateVerification START ===";
   "Document upload simulated successfully";
   "Document upload date registered in backend: 2025-07-26T10:30:00.000Z";
   "=== updateVerification SUCCESS ===";
   ```
5. **Verifique backend**:
   ```sql
   SELECT verifiedDate, isVerified FROM users WHERE email = 'user@example.com';
   ```

### **2. Teste de Auto-Verificação (34 horas)**

1. **Modifique** `verifiedDate` para 34+ horas atrás:

   ```sql
   UPDATE users
   SET verifiedDate = DATE_SUB(NOW(), INTERVAL 35 HOUR)
   WHERE email = 'user@example.com';
   ```

2. **Acesse** `/verification`
3. **Verifique logs**:

   ```javascript
   "=== checkAutoVerification START ===";
   "Hours since document upload: 35.5";
   "34+ hours passed, auto-verifying user";
   "=== updateUserVerification START ===";
   "Backend verification status update response: {...}";
   "=== updateUserVerification SUCCESS ===";
   "User auto-verified in backend and locally";
   ```

4. **Verifique backend**:
   ```sql
   SELECT isVerified FROM users WHERE email = 'user@example.com';
   -- Deve retornar: true
   ```

### **3. Teste de Verificação Manual (KYC Success)**

1. **Clique** "Approve KYC ($9.99)"
2. **Redirecionamento** para SpeedSellX
3. **Após pagamento** → Retorna para `/kyc-success`
4. **Verifique logs**:

   ```javascript
   "=== KYC Success Processing ===";
   "KYC package data: {...}";
   "=== updateUserVerification START ===";
   "Backend verification status update response: {...}";
   "=== updateUserVerification SUCCESS ===";
   "=== KYC Success Processing Complete ===";
   ```

5. **Verifique backend**:
   ```sql
   SELECT isVerified FROM users WHERE email = 'user@example.com';
   -- Deve retornar: true
   ```

## **Cenários de Teste**

### **1. Upload Inicial**

- [ ] Upload simulado funciona
- [ ] `verifiedDate` salvo no backend
- [ ] Estado local sincronizado
- [ ] Contador de 34 horas aparece

### **2. Auto-Verificação (34+ horas)**

- [ ] Sistema detecta 34+ horas
- [ ] `isVerified` atualizado no backend
- [ ] Estado local sincronizado
- [ ] Redirecionamento para `/main`

### **3. Verificação Manual (KYC Success)**

- [ ] Dados salvos no localStorage
- [ ] Redirecionamento para SpeedSellX
- [ ] Retorno processado em `/kyc-success`
- [ ] `isVerified` atualizado no backend
- [ ] Redirecionamento para `/main`

### **4. Sincronização de Estado**

- [ ] Frontend e backend sempre sincronizados
- [ ] Dados persistentes no banco
- [ ] Estado local atualizado corretamente

## **Verificação no Backend**

### **1. Verificar Dados do Usuário**

```sql
SELECT id, name, email, isVerified, verifiedDate
FROM users WHERE email = 'user@example.com';
```

### **2. Simular Upload Antigo**

```sql
-- Para testar auto-verificação
UPDATE users
SET verifiedDate = DATE_SUB(NOW(), INTERVAL 35 HOUR)
WHERE email = 'user@example.com';
```

### **3. Reset para Teste**

```sql
-- Para testar upload inicial
UPDATE users
SET verifiedDate = NULL, isVerified = false
WHERE email = 'user@example.com';
```

## **Logs de Debug Esperados**

### **Upload + Backend Sync:**

```javascript
"=== updateVerification START ===";
"Document upload simulated successfully";
"Document upload date registered in backend: 2025-07-26T10:30:00.000Z";
"=== updateVerification SUCCESS ===";
```

### **Auto-Verificação:**

```javascript
"=== checkAutoVerification START ===";
"Hours since document upload: 35.5";
"34+ hours passed, auto-verifying user";
"=== updateUserVerification START ===";
"Backend verification status update response: {...}";
"=== updateUserVerification SUCCESS ===";
"User auto-verified in backend and locally";
```

### **KYC Success:**

```javascript
"=== KYC Success Processing ===";
"KYC package data: {...}";
"=== updateUserVerification START ===";
"Backend verification status update response: {...}";
"=== updateUserVerification SUCCESS ===";
"=== KYC Success Processing Complete ===";
```

## **Troubleshooting**

### **Problema: Backend não atualiza**

- Verifique se os endpoints existem
- Confirme se o token JWT está válido
- Verifique logs de erro no backend

### **Problema: Estado local não sincroniza**

- Verifique se `set()` está sendo chamado
- Confirme se `fetchUser()` está sendo executado
- Verifique se não há erros no console

### **Problema: Auto-verificação não funciona**

- Verifique se `verifiedDate` está no backend
- Confirme se o cálculo de horas está correto
- Verifique se `updateUserVerification()` está funcionando

### **Problema: KYC Success não processa**

- Verifique se há dados no localStorage
- Confirme se o endpoint `/user/verify` existe
- Verifique logs de erro no console

## **Vantagens do Sistema Sincronizado**

### **1. Dados Persistentes**

- ✅ `verifiedDate` salvo no banco
- ✅ `isVerified` sincronizado
- ✅ Dados não se perdem

### **2. Upload Simulado**

- ✅ Sem armazenamento de arquivos
- ✅ Sempre funciona
- ✅ UX excelente

### **3. Sincronização Completa**

- ✅ Frontend e backend sincronizados
- ✅ Estado consistente
- ✅ Dados confiáveis

O sistema agora mantém o upload simulado mas sincroniza todos os dados importantes com o backend! 🎉
