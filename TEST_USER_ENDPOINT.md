# Teste do Endpoint /user/me

## Verificar se o campo evaluationLimit está sendo retornado

### 1. **Teste Manual da API**

```bash
# Teste direto do endpoint (substitua YOUR_JWT_TOKEN pelo token real)
curl -X GET https://platform-production-f017.up.railway.app/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 2. **Resposta Esperada**

A resposta deve incluir o campo `evaluationLimit`:

```json
{
  "id": 1,
  "name": "User Name",
  "email": "user@example.com",
  "balance": "50.00",
  "evaluationLimit": 10,
  "registrationDate": "2024-01-01T00:00:00.000Z",
  "paypalAccount": null,
  "bankAccount": null
}
```

### 3. **Se evaluationLimit não estiver presente**

Se o campo `evaluationLimit` não estiver sendo retornado, você precisa:

1. **Verificar o schema do Prisma** - confirmar que o campo existe
2. **Verificar o endpoint /user/me** no backend - incluir o campo na resposta
3. **Executar migração** se necessário

### 4. **Backend - Endpoint /user/me**

O endpoint deve retornar algo como:

```javascript
// GET /user/me
app.get("/user/me", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        evaluationLimit: true, // ← IMPORTANTE: incluir este campo
        registrationDate: true,
        paypalAccount: true,
        bankAccount: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
```

### 5. **Teste no Frontend**

Abra o DevTools (F12) e verifique os logs:

```javascript
// Logs esperados quando acessar /limit-upgrade
"LimitUpgrade - User data: {id: 1, name: '...', evaluationLimit: 10, ...}";
"LimitUpgrade - User evaluation limit: 10";

// Se não estiver carregando:
"LimitUpgrade - Fetching user data...";
"Fetched user data: {id: 1, name: '...', evaluationLimit: 10, ...}";
"User evaluation limit: 10";
```

### 6. **Troubleshooting**

#### Campo não aparece na resposta:

- Verificar se o campo existe no schema do Prisma
- Verificar se a migração foi executada
- Verificar se o campo está incluído no `select` do endpoint

#### Campo aparece como null:

- Verificar se o valor padrão está definido no schema
- Verificar se o banco tem dados para usuários existentes

#### Erro 401:

- Verificar se o token JWT está válido
- Verificar se o middleware de autenticação está funcionando

### 7. **Comando SQL para Verificar**

```sql
-- Verificar se o campo existe na tabela
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'evaluation_limit';

-- Verificar valores dos usuários
SELECT id, name, email, evaluation_limit FROM users LIMIT 5;
```

### 8. **Próximos Passos**

1. **Teste o endpoint** `/user/me` diretamente
2. **Verifique se `evaluationLimit`** está na resposta
3. **Se não estiver**, ajuste o endpoint no backend
4. **Teste novamente** no frontend
