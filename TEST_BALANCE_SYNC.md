# Teste de Sincronização de Saldo

## Verificar se o saldo está igual entre página principal e wallet

### 1. **Logs de Debug**

Abra o DevTools (F12) e verifique os logs:

#### **Página Principal**:

```javascript
// Logs esperados:
"Main page - User balance: 50.00";
"Main page - User info: {id: 1, name: '...', balance: '50.00', ...}";
```

#### **Página Wallet**:

```javascript
// Logs esperados:
"Wallet page - User balance: 50.00";
"Wallet page - Calculated balance: 50";
```

### 2. **Teste Manual**

1. **Acesse a página principal** (`/main`)
2. **Anote o saldo** exibido em "Available balance"
3. **Vá para a wallet** (`/wallet`)
4. **Compare o saldo** em "Total Balance"
5. **Os valores devem ser iguais**

### 3. **Teste de Atualização**

1. **Complete uma avaliação** na página principal
2. **Verifique o saldo** na página principal
3. **Vá para a wallet** e verifique se o saldo foi atualizado
4. **Volte para a principal** e confirme que está igual

### 4. **Logs Durante Avaliação**

```javascript
// Ao completar uma avaliação:
"=== updateUserBalance START ===";
"Current user balance: 50.00";
"Earning to add: 8.50";
"New total balance: 58.5";
"Updating user balance in backend: {balance: 58.5}";
"Backend balance update response: {...}";
"Local user balance updated to: 58.50";
"=== updateUserBalance SUCCESS ===";
```

### 5. **Verificação no Backend**

```bash
# Teste o endpoint de saldo
curl -X GET https://platform-production-f017.up.railway.app/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Resposta esperada:
{
  "id": 1,
  "name": "User Name",
  "email": "user@example.com",
  "balance": "58.50",
  "evaluationLimit": 10,
  ...
}
```

### 6. **Troubleshooting**

#### **Saldo diferente entre páginas**:

- Verifique se `user.balance` está sendo usado em ambas as páginas
- Confirme se não há cache do navegador
- Verifique se o `fetchUser()` está sendo chamado

#### **Saldo não atualiza após avaliação**:

- Verifique os logs de `updateUserBalance`
- Confirme se o backend está retornando sucesso
- Verifique se o estado local está sendo atualizado

#### **Saldo mostra valores incorretos**:

- Verifique se as transações estão sendo criadas corretamente
- Confirme se o cálculo do saldo está correto
- Verifique se não há duplicação de transações

### 7. **Valores Esperados**

#### **Usuário novo**:

- Saldo inicial: $50.00 (welcome bonus)
- Após 1 avaliação: $50.00 + earning (ex: $58.50)
- Após 2 avaliações: $58.50 + earning (ex: $66.75)

#### **Verificação**:

- Página principal: `user?.balance`
- Wallet: `parseFloat(user?.balance || "0")`
- Ambos devem mostrar o mesmo valor

### 8. **Comando SQL para Verificar**

```sql
-- Verificar saldo no banco
SELECT id, name, email, balance FROM users WHERE email = 'seu-email@exemplo.com';

-- Verificar transações
SELECT id, type, amount, description, created_at
FROM transactions
WHERE user_id = 1
ORDER BY created_at DESC;
```

### 9. **Próximos Passos**

1. **Teste o fluxo completo** de avaliação
2. **Verifique os logs** em ambas as páginas
3. **Confirme que os valores** estão iguais
4. **Reporte qualquer diferença** encontrada
