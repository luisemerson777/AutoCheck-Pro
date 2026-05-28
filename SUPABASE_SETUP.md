# Integração com Supabase

## 🔧 Configuração Inicial

### 1. Criar conta no Supabase
1. Acesse https://app.supabase.com
2. Crie uma nova organização e projeto
3. Selecione PostgreSQL como banco de dados

### 2. Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

Obtenha estas chaves em:
- **Project Settings > API > Project URL** (para `VITE_SUPABASE_URL`)
- **Project Settings > API > Project API keys > anon public** (para `VITE_SUPABASE_ANON_KEY`)

### 3. Criar Tabela `inspecoes`

No console SQL do Supabase, execute:

```sql
CREATE TABLE inspecoes (
  id BIGINT PRIMARY KEY,
  date TEXT,
  client JSONB,
  vehicle JSONB,
  tires JSONB,
  fluids JSONB,
  safety JSONB,
  electrical JSONB,
  checkout JSONB,
  partsUsed TEXT,
  observations TEXT,
  totalValue TEXT,
  user TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE inspecoes ENABLE ROW LEVEL SECURITY;

-- Política: leitura pública
CREATE POLICY "inspecoes_select_policy" ON inspecoes
  FOR SELECT USING (TRUE);

-- Política: insert para qualquer pessoa (ou restringir conforme necessário)
CREATE POLICY "inspecoes_insert_policy" ON inspecoes
  FOR INSERT WITH CHECK (TRUE);

-- Política: delete para qualquer pessoa (ou restringir conforme necessário)
CREATE POLICY "inspecoes_delete_policy" ON inspecoes
  FOR DELETE USING (TRUE);

-- Política: update para qualquer pessoa (ou restringir conforme necessário)
CREATE POLICY "inspecoes_update_policy" ON inspecoes
  FOR UPDATE USING (TRUE);

-- Criar índice para melhor performance
CREATE INDEX idx_inspecoes_created_at ON inspecoes(created_at DESC);
CREATE INDEX idx_inspecoes_user ON inspecoes(user);
```

### 4. Tabela de Usuários (Opcional)

Se quiser usar autenticação do Supabase (mais segura):

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
```

## 📝 Estrutura de Dados

### Inspeção
```javascript
{
  id: 1622000000000,                    // timestamp em ms
  date: "2024-05-28T19:30:00Z",
  client: {
    name: "João Silva",
    phone: "11999999999",
    email: "joao@email.com"
  },
  vehicle: {
    brandModel: "Honda Civic 2020",
    plate: "ABC1234",
    mileage: "50000",
    year: "2020"
  },
  tires: {
    frontLeft: 5,
    frontRight: 5,
    rearLeft: 5,
    rearRight: 5,
    grooves: "OK"
  },
  fluids: {
    engineOil: "OK",
    brakeFluid: "OK",
    coolant: "OK",
    wiperFluid: "OK",
    transmissionFluid: "OK"
  },
  safety: {
    headlights: "OK",
    tailLights: "OK",
    turnSignals: "OK",
    wipers: "OK",
    horn: true
  },
  electrical: {
    batteryHealth: 5,
    alternator: "OK",
    belts: "OK"
  },
  checkout: {
    testDrive: false,
    wheelTorque: false,
    cleaning: false,
    personalObjects: true
  },
  partsUsed: "Filtro de óleo, velas",
  observations: "Tudo em ordem",
  totalValue: "150,00",
  user: "luis"
}
```

## 🔌 Operações Principais

### Buscar Inspeções
```javascript
const { data, error } = await supabase
  .from('inspecoes')
  .select('*')
  .order('created_at', { ascending: false });
```

### Salvar/Atualizar Inspeção
```javascript
const { data, error } = await supabase
  .from('inspecoes')
  .upsert([inspection], { onConflict: 'id' })
  .select();
```

### Deletar Inspeção
```javascript
const { error } = await supabase
  .from('inspecoes')
  .delete()
  .eq('id', id);
```

### Buscar por Usuário (Opcional)
```javascript
const { data, error } = await supabase
  .from('inspecoes')
  .select('*')
  .eq('user', currentUser)
  .order('created_at', { ascending: false });
```

## ⚠️ Troubleshooting

### Erro: "not enough input"
- Certifique-se de que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas
- Verifique se o arquivo `.env.local` existe na raiz do projeto
- Reinicie o servidor (`npm run dev`)

### Erro: "Failed to fetch"
- Verifique a conexão de internet
- Verifique se a URL do Supabase está correta
- Verifique o console do navegador para mais detalhes

### RLS Policy Error
- Certifique-se de que as políticas de RLS foram criadas corretamente
- Para desenvolvimento, você pode desabilitar RLS temporariamente (não recomendado para produção)

## 🚀 Deployment

### Vercel
1. Adicione as variáveis de ambiente no painel do Vercel
2. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nos Project Settings > Environment Variables
3. Faça o deploy normalmente

### .env.local (nunca commitar)
O arquivo `.env.local` nunca deve ser versionado. Adicione ao `.gitignore`:
```
.env.local
```

## 📚 Referências
- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
