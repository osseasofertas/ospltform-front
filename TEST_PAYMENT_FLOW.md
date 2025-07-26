# Teste do Sistema de Pagamento

## Como Testar o Fluxo Completo

### 1. **Teste Manual da API**

```bash
# Teste direto do endpoint (substitua YOUR_JWT_TOKEN pelo token real)
curl -X PATCH https://platform-production-f017.up.railway.app/user/evaluation-limit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"evaluationLimit": 15}'
```

### 2. **Teste do Frontend**

1. **Faça login** na aplicação
2. **Vá para a página principal** (`/main`)
3. **Complete 10 avaliações** para atingir o limite
4. **Clique em "Upgrade Daily Limit"**
5. **Selecione um pacote** (Basic ou Premium)
6. **Clique em "Pay"** - será redirecionado para o gateway de pagamento

### 3. **Simular Retorno do Pagamento**

Para testar sem um gateway real, você pode acessar diretamente:

```
https://seu-dominio.com/payment-success?type=basic&current=10&new=15&price=9.99
```

### 4. **Verificar no Console**

Abra o DevTools (F12) e verifique os logs:

```javascript
// Logs esperados:
"Updating evaluation limit to: 15";
"Backend evaluation limit update response: {success: true, ...}";
"Local user state updated with new limit: 15";
```

### 5. **Verificar no Banco de Dados**

```sql
-- Verificar se o limite foi atualizado
SELECT id, name, email, evaluation_limit FROM users WHERE email = 'seu-email@exemplo.com';
```

## Configuração do Gateway de Pagamento

### URL de Retorno

Configure seu gateway para redirecionar para:

```
https://seu-dominio.com/payment-success?type={package_type}&current={current_limit}&new={new_limit}&price={amount}
```

### Exemplos de URLs

```
// Pacote Basic (+5 avaliações por $9.99)
https://seu-dominio.com/payment-success?type=basic&current=10&new=15&price=9.99

// Pacote Premium (+10 avaliações por $19.99)
https://seu-dominio.com/payment-success?type=premium&current=10&new=20&price=19.99
```

### Links do SpeedSellX

```
// Pacote Basic
https://pay.speedsellx.com/688455C60E2C9

// Pacote Premium
https://pay.speedsellx.com/688455997C4B2
```

## Troubleshooting

### Erro 401 (Unauthorized)

- Verifique se o token JWT está sendo enviado
- Confirme se o token não expirou
- Verifique se o middleware de autenticação está funcionando

### Erro 400 (Bad Request)

- Verifique se `evaluationLimit` está sendo enviado como número
- Confirme se o valor está entre 10 e 100

### Erro 500 (Internal Server Error)

- Verifique os logs do backend
- Confirme se o campo `evaluationLimit` existe na tabela `users`
- Verifique se o Prisma está configurado corretamente

### Frontend não atualiza

- Verifique se o `localStorage` tem o `access_token`
- Confirme se a função `updateEvaluationLimit` está sendo chamada
- Verifique se não há erros no console do navegador

## Logs de Debug

### Frontend (Console do Navegador)

```javascript
// Ao acessar payment-success
"Missing package parameters"; // Se parâmetros estiverem faltando
"Updating evaluation limit to: 15"; // Ao chamar updateEvaluationLimit
"Backend evaluation limit update response: {...}"; // Resposta do backend
"Local user state updated with new limit: 15"; // Estado local atualizado
```

### Backend (Logs do Servidor)

```javascript
// Ao receber PATCH /user/evaluation-limit
"User 123 evaluation limit updated to 15";
"User 123 limit updated: 10 → 15";
```

## Fluxo Completo Esperado

1. ✅ **Usuário seleciona pacote** → Dados salvos no localStorage
2. ✅ **Redireciona para pagamento** → Gateway externo
3. ✅ **Pagamento processado** → Gateway retorna com parâmetros
4. ✅ **Frontend lê parâmetros** → Extrai type, current, new, price
5. ✅ **Chama updateEvaluationLimit** → PATCH para /user/evaluation-limit
6. ✅ **Backend atualiza banco** → Prisma update no campo evaluationLimit
7. ✅ **Frontend atualiza estado** → Usuário vê novo limite imediatamente
8. ✅ **Mostra confirmação** → Alert de sucesso

## Próximos Passos

1. **Configure seu gateway de pagamento** com as URLs de retorno
2. **Teste o fluxo completo** com um pagamento real
3. **Monitore os logs** para identificar possíveis problemas
4. **Implemente validações adicionais** se necessário
