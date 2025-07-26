# Teste: Fluxo de Pagamento de KYC

## **Visão Geral**

Este guia testa o sistema de aprovação de KYC via pagamento, similar ao sistema de aumento de limite de avaliações.

## **Fluxo do Sistema**

### **1. Usuário Não Verificado**

- Usuário faz login
- É redirecionado para `/verification`
- Vê botão "Approve KYC ($9.99)"

### **2. Processo de Pagamento**

- Usuário clica em "Approve KYC"
- Dados são salvos no localStorage
- Redirecionamento para SpeedSellX
- Após pagamento, retorna para `/kyc-success`

### **3. Aprovação Automática**

- Página `/kyc-success` processa o retorno
- Chama `updateUserVerification()`
- Atualiza `isVerified: true` no backend
- Redireciona para `/main`

## **Como Testar**

### **1. Teste da Página de Verificação**

1. **Faça login** com usuário não verificado
2. **Acesse** `/verification`
3. **Verifique se o botão aparece**:
   ```
   🔓 Approve KYC ($9.99)
   ```
4. **Clique no botão** e verifique:
   - Redirecionamento para SpeedSellX
   - Dados salvos no localStorage

**Logs esperados:**

```javascript
"KYC package data: {userId: 1, userEmail: '...', userName: '...', type: 'kyc_approval', price: 9.99}";
```

### **2. Teste do Redirecionamento**

1. **Clique em "Approve KYC"**
2. **Verifique a URL** de redirecionamento:
   ```
   https://pay.speedsellx.com/KYC_APPROVAL_LINK?return_url=http%3A//localhost%3A5173/kyc-success
   ```
3. **Confirme que os dados** estão no localStorage:
   ```javascript
   localStorage.getItem("kyc_package");
   // Deve retornar JSON com dados do usuário
   ```

### **3. Teste da Página de Sucesso**

1. **Acesse diretamente** `/kyc-success`
2. **Verifique se processa** os dados do localStorage
3. **Confirme que chama** `updateUserVerification()`

**Logs esperados:**

```javascript
"=== KYC Success Processing ===";
"KYC package data: {...}";
"=== updateUserVerification START ===";
"Backend verification status update response: {...}";
"=== updateUserVerification SUCCESS ===";
"=== KYC Success Processing Complete ===";
```

### **4. Teste de Acesso Após Aprovação**

1. **Complete o fluxo** de pagamento
2. **Verifique se pode acessar** `/main`
3. **Confirme que não é redirecionado** para `/verification`

## **Testes no Backend**

### **1. Teste do Endpoint de Verificação**

```bash
# Teste de atualização de status
curl -X PATCH http://localhost:3000/user/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isVerified": true}'

# Resposta esperada:
{
  "success": true,
  "message": "User verification status updated to true"
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
  "isVerified": true,
  ...
}
```

## **Configuração do SpeedSellX**

### **1. Link de Pagamento**

Substitua `KYC_APPROVAL_LINK` pelo link real do SpeedSellX:

```
https://pay.speedsellx.com/SEU_LINK_KYC_AQUI
```

### **2. Parâmetros de Retorno**

O sistema automaticamente adiciona:

- `return_url`: URL de retorno para `/kyc-success`

### **3. Dados Passados**

Os dados do usuário são salvos no localStorage:

```javascript
{
  userId: 1,
  userEmail: "user@example.com",
  userName: "User Name",
  type: "kyc_approval",
  price: 9.99
}
```

## **Cenários de Erro**

### **1. Usuário Não Logado**

- Tentar acessar `/kyc-success` sem estar logado
- **Resultado esperado**: Redirecionamento para `/login`

### **2. Sem Dados de KYC**

- Acessar `/kyc-success` sem dados no localStorage
- **Resultado esperado**: Mensagem de erro "No KYC package data found"

### **3. Erro no Backend**

- Endpoint `/user/verification-status` não funciona
- **Resultado esperado**: Mensagem de erro e botão "Try Again"

### **4. Pagamento Cancelado**

- Usuário cancela pagamento no SpeedSellX
- **Resultado esperado**: Não retorna para `/kyc-success`

## **Verificação Visual**

### **1. Página de Verificação**

- [ ] Botão "Approve KYC ($9.99)" visível
- [ ] Estilo verde/emerald
- [ ] Ícone de cadeado 🔓

### **2. Página de Sucesso**

- [ ] Ícone de check verde
- [ ] Título "KYC Approval Successful!"
- [ ] Detalhes do pagamento
- [ ] Botão "Continue to App"

### **3. Estados de Loading**

- [ ] Spinner durante processamento
- [ ] Texto "Processing KYC approval..."

## **Troubleshooting**

### **Problema: Botão não aparece**

- Verifique se o usuário tem `isVerified: false`
- Confirme se está na página `/verification`
- Verifique se não há erros no console

### **Problema: Redirecionamento não funciona**

- Verifique se o link do SpeedSellX está correto
- Confirme se o `return_url` está sendo codificado
- Verifique se os dados estão sendo salvos no localStorage

### **Problema: Página de sucesso não processa**

- Verifique se há dados no localStorage
- Confirme se o endpoint `/user/verify` existe
- Verifique os logs de erro no console

### **Problema: Usuário não é marcado como verificado**

- Verifique se `updateUserVerification()` está sendo chamada
- Confirme se o backend está retornando sucesso
- Verifique se o estado local está sendo atualizado

## **Comandos SQL para Teste**

```sql
-- Verificar status de verificação
SELECT id, name, email, isVerified FROM users WHERE email = 'user@example.com';

-- Marcar como não verificado (para teste)
UPDATE users SET isVerified = false WHERE email = 'user@example.com';

-- Marcar como verificado (para teste)
UPDATE users SET isVerified = true WHERE email = 'user@example.com';
```

## **Logs de Debug Esperados**

### **Clique no Botão KYC:**

```javascript
"KYC package data: {userId: 1, userEmail: '...', userName: '...', type: 'kyc_approval', price: 9.99}";
```

### **Processamento de Sucesso:**

```javascript
"=== KYC Success Processing ===";
"KYC package data: {...}";
"=== updateUserVerification START ===";
"Backend verification status update response: {...}";
"=== updateUserVerification SUCCESS ===";
"=== KYC Success Processing Complete ===";
```

### **Login Após Aprovação:**

```javascript
"Fetched user data: {isVerified: true, ...}";
// Redirecionamento para /main
```
