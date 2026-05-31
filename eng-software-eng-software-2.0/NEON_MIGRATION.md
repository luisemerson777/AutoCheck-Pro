# Migração concluída: Neon PostgreSQL

## Resumo da Migração

O projeto foi completamente migrado de **Supabase** para **Neon PostgreSQL** (hospedado no Vercel). Todas as operações agora são feitas via API REST através do FastAPI.

## Arquitetura Atual

### Backend (FastAPI/Python)

- **Arquivo**: `api/app.py`
- **Banco de Dados**: Neon PostgreSQL
- **Conexão**: Via `psycopg2` com SSL/TLS
- **Endpoints**: REST API em `/api/*`

### Frontend (React/Vite)

- **API Client**: `src/api.js` - chamadas REST ao backend
- **Cliente Neon**: `src/neonClient.js` - configuração de conexão
- **Hook**: `src/hooks/useSupabase.js` - interface React para operações de banco

## Arquivos Alterados

### Backend

- ✅ `api/app.py` - Reescrito para usar PostgreSQL Neon com psycopg2
- ✅ `api/requirements.txt` - Adicionado psycopg2-binary, python-dotenv, sqlalchemy
- ✅ `api/.env` - Adiciona DATABASE_URL do Neon
- ✅ `api/.env.example` - Template para configuração

### Frontend

- ✅ `src/api.js` - Migrado de Supabase para REST API
- ✅ `src/neonClient.js` - Novo arquivo de configuração
- ✅ `src/hooks/useSupabase.js` - Atualizado para usar API via fetch
- ✅ `src/App.jsx` - Comentários atualizados
- ✅ `.env.local` - Removido VITE*SUPABASE*\*, adicionado VITE_API_URL
- ✅ `.env.local.example` - Template atualizado
- ✅ `package.json` - Removido @supabase/supabase-js

### Configuração

- ✅ `vercel.json` - Atualizado com rotas e variáveis de ambiente

## Variáveis de Ambiente

### Backend (`api/.env`)

```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require&channel_binding=require"
```

### Frontend (`.env.local`)

```
VITE_API_URL="https://eng-software-one.vercel.app/api"
DATABASE_URL="postgresql://..." (compartilhada com backend)
```

## Endpoints da API

| Método | Endpoint                | Descrição                   |
| ------ | ----------------------- | --------------------------- |
| POST   | `/api/login`            | Autenticação                |
| GET    | `/api/inspections`      | Listar inspeções            |
| GET    | `/api/inspections/{id}` | Obter inspeção              |
| POST   | `/api/inspections`      | Criar inspeção              |
| PUT    | `/api/inspections/{id}` | Atualizar inspeção (upsert) |
| DELETE | `/api/inspections/{id}` | Deletar inspeção            |
| GET    | `/api/health`           | Health check                |

## Estrutura do Banco de Dados

```sql
CREATE TABLE IF NOT EXISTS inspecoes (
    id SERIAL PRIMARY KEY,
    veiculo_placa VARCHAR(10),
    status VARCHAR(50),
    pecas_utilizadas TEXT,
    observacoes TEXT,
    valor_total NUMERIC(10, 2),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(255),
    dados_completos JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_placa ON inspecoes(veiculo_placa);
```

## Fluxo de Dados

```
Frontend (React)
      ↓
   api.js (fetch HTTP)
      ↓
Backend (FastAPI)
      ↓
Database (Neon PostgreSQL)
```

## Como Usar

### 1. Desenvolvimento Local

**Backend:**

```bash
cd api
pip install -r requirements.txt
export DATABASE_URL="postgresql://..."
uvicorn app:app --reload
```

**Frontend:**

```bash
npm install
npm run dev:full
```

### 2. Deploy no Vercel

1. Adicione `DATABASE_URL` em Environment Variables no Vercel
2. Adicione `VITE_API_URL` apontando para seu domínio
3. Deploy automático via Git

## Diferenças Principais

| Aspecto        | Supabase      | Neon             |
| -------------- | ------------- | ---------------- |
| Autenticação   | Supabase Auth | API REST simples |
| Banco de Dados | PostgreSQL    | PostgreSQL       |
| Acesso         | Via SDK JS    | Via REST API     |
| Autoscaling    | Automático    | Automático       |
| SSL/TLS        | Automático    | Requerido        |
| Custo          | Free/Pago     | Free/Pago        |

## Troubleshooting

### Erro: "DATABASE_URL não configurada"

- Verifique se `.env` está no diretório `api/`
- Copie a URL do Neon corretamente (com ssl/channel_binding)

### Erro: "API não configurada"

- Verifique se `VITE_API_URL` está definido no `.env.local`
- Certifique-se de que é a URL correta (com `/api` no final)

### Erro de conexão ao banco

- Verifique se o Neon está online
- Teste com: `curl https://seu-dominio/api/health`
- Verifique firewall/security groups

## Próximos Passos (Opcional)

1. Adicionar autenticação JWT segura
2. Adicionar validação de dados mais robusta
3. Implementar rate limiting
4. Adicionar cache com Redis
5. Monitorar performance com observabilidade

## Suporte

Para dúvidas sobre a migração, consulte:

- [Documentação Neon](https://neon.tech/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
