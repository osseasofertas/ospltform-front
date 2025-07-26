# Teste: Sistema de Auto-Verificação (34 horas)

## **Visão Geral**

Este guia testa o sistema de auto-verificação que aprova automaticamente usuários após 34 horas do upload do documento.

## **Fluxo do Sistema**

### **1. Upload do Documento**

- Usuário faz upload do documento
- `verifiedDate` é registrado automaticamente
- `isVerified` permanece `false`

### **2. Verificação Automática**

- Sistema verifica se passaram 34 horas desde `verifiedDate`
- Se sim: `isVerified` é definido como `true`
- Se não: mantém `isVerified: false`

### **3. Interface Visual**

- Página de verificação mostra tempo restante
- Contador regressivo em horas e minutos
- Auto-verificação acontece ao acessar a página

## **Como Testar**

### **1. Teste de Upload e Registro de Data**

1. **Faça login** com usuário não verificado
2. **Acesse** `/verification`
3. **Faça upload** de um documento
4. **Verifique os logs**:

```javascript
"=== updateVerification START ===";
"Uploading verification document: document.jpg";
"Backend verification upload response: {...}";
"Document upload date registered: 2025-07-26T10:30:00.000Z";
"=== updateVerification SUCCESS ===";
```

5. **Verifique se `verifiedDate`** foi registrado no backend

### **2. Teste da Interface de Tempo Restante**

1. **Após upload**, verifique se aparece:

   ```
   Document uploaded: 7/26/2025, 10:30:00 AM
   ⏰ Auto-verification in: 33h 59m
   ```

2. **Confirme que o contador** diminui conforme o tempo passa

### **3. Teste de Auto-Verificação (Simulado)**

1. **No backend, modifique** `verifiedDate` para 34+ horas atrás:

   ```sql
   UPDATE users SET verifiedDate = '2025-07-25T00:30:00.000Z'
   WHERE email = 'user@example.com';
   ```

2. **Acesse** `/verification`
3. **Verifique os logs**:

   ```javascript
   "=== checkAutoVerification START ===";
   "Hours since document upload: 34.5";
   "34+ hours passed, auto-verifying user";
   "=== updateUserVerification START ===";
   "Backend verification status update response: {...}";
   "=== updateUserVerification SUCCESS ===";
   "=== checkAutoVerification END ===";
   ```

4. **Confirme redirecionamento** para `/main`

### **4. Teste de Verificação Antes das 34 Horas**

1. **Modifique** `verifiedDate` para menos de 34 horas:

   ```sql
   UPDATE users SET verifiedDate = '2025-07-26T08:30:00.000Z'
   WHERE email = 'user@example.com';
   ```

2. **Acesse** `/verification`
3. **Verifique os logs**:

   ```javascript
   "=== checkAutoVerification START ===";
   "Hours since document upload: 2.5";
   "Less than 34 hours, keeping pending status";
   "=== checkAutoVerification END ===";
   ```

4. **Confirme que permanece** na página de verificação

## **Testes no Backend**

### **1. Teste do Endpoint de Registro de Data**

```bash
# Teste de registro de data de upload
curl -X PATCH http://localhost:3000/user/verified-date \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"verifiedDate": "2025-07-26T10:30:00.000Z"}'

# Resposta esperada:
{
  "success": true,
  "message": "Document upload date registered successfully"
}
```

### **2. Verificar Status do Usuário**

```bash
curl -X GET http://localhost:3000/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Resposta esperada:
{
  "id": 1,
  "name": "User Name",
  "email": "user@example.com",
  "isVerified": false,
  "verifiedDate": "2025-07-26T10:30:00.000Z",
  ...
}
```

### **3. Teste de Auto-Verificação**

```bash
# Simular 34+ horas passadas
curl -X PATCH http://localhost:3000/user/verified-date \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"verifiedDate": "2025-07-25T00:30:00.000Z"}'

# Depois acessar /verification deve auto-verificar
```

## **Cenários de Teste**

### **1. Upload Inicial**

- [ ] `verifiedDate` é registrado corretamente
- [ ] `isVerified` permanece `false`
- [ ] Tempo restante é exibido corretamente

### **2. Menos de 34 Horas**

- [ ] Sistema não auto-verifica
- [ ] Contador mostra tempo restante
- [ ] Usuário permanece na página de verificação

### **3. Exatamente 34 Horas**

- [ ] Sistema auto-verifica
- [ ] `isVerified` é definido como `true`
- [ ] Usuário é redirecionado para `/main`

### **4. Mais de 34 Horas**

- [ ] Sistema auto-verifica imediatamente
- [ ] `isVerified` é definido como `true`
- [ ] Usuário é redirecionado para `/main`

### **5. Sem `verifiedDate`**

- [ ] Sistema não tenta auto-verificar
- [ ] Logs mostram "No auto-verification needed"

## **Verificação Visual**

### **1. Página de Verificação**

- [ ] Data de upload exibida
- [ ] Contador regressivo visível
- [ ] Formato: "⏰ Auto-verification in: Xh Ym"

### **2. Estados do Contador**

- [ ] 34+ horas: "Auto-verification in: 0h 0m"
- [ ] 33 horas: "Auto-verification in: 1h 0m"
- [ ] 33.5 horas: "Auto-verification in: 0h 30m"

### **3. Após Auto-Verificação**

- [ ] Redirecionamento automático para `/main`
- [ ] Não mostra mais página de verificação

## **Troubleshooting**

### **Problema: Auto-verificação não funciona**

- Verifique se `verifiedDate` está sendo registrado
- Confirme se o cálculo de horas está correto
- Verifique se `checkAutoVerification()` está sendo chamada

### **Problema: Contador não aparece**

- Verifique se `user.verifiedDate` existe
- Confirme se `getTimeRemaining()` está funcionando
- Verifique se não há erros no console

### **Problema: Auto-verificação acontece antes das 34h**

- Verifique se `verifiedDate` está correto no banco
- Confirme se o cálculo de diferença de tempo está correto
- Verifique se não há cache do navegador

### **Problema: Auto-verificação não acontece após 34h**

- Verifique se `checkAutoVerification()` está sendo chamada
- Confirme se `updateUserVerification()` está funcionando
- Verifique se o endpoint `/user/verify` existe

## **Comandos SQL para Teste**

```sql
-- Verificar status atual
SELECT id, name, email, isVerified, verifiedDate
FROM users WHERE email = 'user@example.com';

-- Simular upload há 35 horas (auto-verificação deve acontecer)
UPDATE users
SET verifiedDate = DATE_SUB(NOW(), INTERVAL 35 HOUR)
WHERE email = 'user@example.com';

-- Simular upload há 30 horas (não deve auto-verificar)
UPDATE users
SET verifiedDate = DATE_SUB(NOW(), INTERVAL 30 HOUR)
WHERE email = 'user@example.com';

-- Limpar data de verificação (para teste inicial)
UPDATE users
SET verifiedDate = NULL, isVerified = false
WHERE email = 'user@example.com';
```

## **Logs de Debug Esperados**

### **Upload de Documento:**

```javascript
"=== updateVerification START ===";
"Document upload date registered: 2025-07-26T10:30:00.000Z";
"=== updateVerification SUCCESS ===";
```

### **Verificação Automática (34+ horas):**

```javascript
"=== checkAutoVerification START ===";
"Hours since document upload: 34.5";
"34+ hours passed, auto-verifying user";
"=== updateUserVerification START ===";
"=== updateUserVerification SUCCESS ===";
"=== checkAutoVerification END ===";
```

### **Verificação Automática (<34 horas):**

```javascript
"=== checkAutoVerification START ===";
"Hours since document upload: 2.5";
"Less than 34 hours, keeping pending status";
"=== checkAutoVerification END ===";
```

## **Configuração de Teste Rápido**

Para testar rapidamente, você pode:

1. **Fazer upload** de um documento
2. **No banco**, alterar `verifiedDate` para 35 horas atrás
3. **Recarregar** a página `/verification`
4. **Verificar** se foi redirecionado para `/main`

O sistema deve funcionar automaticamente! 🎉
