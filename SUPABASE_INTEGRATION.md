# AutoCheck Pro - Integração Supabase

## 📋 O que foi refatorado

### ✅ Implementado
1. **Cliente Supabase** (`src/supabaseClient.js`)
   - Inicialização com variáveis de ambiente
   - Tratamento de erros de configuração

2. **Hook Customizado** (`src/hooks/useSupabase.js`)
   - `fetchInspections()` - Buscar inspeções
   - `createInspection()` - Criar nova inspeção
   - `updateInspection()` - Atualizar inspeção
   - `upsertInspection()` - Upsert (insert ou update)
   - `deleteInspection()` - Deletar inspeção
   - Gerenciamento de estado (loading, error)

3. **Componentes Refatorados**
   - `src/App.jsx` - Substituídas chamadas de API por Supabase
   - `src/components/InspectionForm.jsx` - Adicionada validação e estado de loading
   - `src/components/Login.jsx` - Melhorado feedback visual

4. **Documentação**
   - `SUPABASE_SETUP.md` - Guia completo de configuração
   - `.env.local.example` - Template de variáveis de ambiente

### 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐   │
│  │    App.jsx   │  │ InspectionForm│  │ HistoryView │   │
│  └──────┬───────┘  └──────┬────────┘  └──────┬──────┘   │
│         │                 │                  │          │
│         └─────────────────┴──────────────────┘          │
│                      │                                   │
│              handleSaveToHistory()                       │
│              handleDeleteInspection()                    │
│              loadInspections()                           │
│                      │                                   │
└──────────────────────┼───────────────────────────────────┘
                       │
               ┌───────▼────────┐
               │  supabaseClient │
               │   (@supabase/)  │
               └────────┬────────┘
                        │
            ┌───────────┴──────────────┐
            │                          │
      ┌─────▼──────┐         ┌────────▼─────┐
      │   Autenticação      │   Database    │
      │  (API /api/login)   │  (PostgreSQL) │
      └─────────────┘       └───────────────┘
```

## 🚀 Quick Start

### 1. Configurar Variáveis de Ambiente

```bash
# Copie o template
cp .env.local.example .env.local

# Edite com suas credenciais do Supabase
nano .env.local
```

### 2. Criar Tabela no Supabase

```sql
-- Executar no console SQL do Supabase
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

-- Habilitar RLS
ALTER TABLE inspecoes ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "inspecoes_select_policy" ON inspecoes
  FOR SELECT USING (TRUE);

CREATE POLICY "inspecoes_insert_policy" ON inspecoes
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "inspecoes_delete_policy" ON inspecoes
  FOR DELETE USING (TRUE);

CREATE POLICY "inspecoes_update_policy" ON inspecoes
  FOR UPDATE USING (TRUE);

-- Índices para performance
CREATE INDEX idx_inspecoes_created_at ON inspecoes(created_at DESC);
CREATE INDEX idx_inspecoes_user ON inspecoes(user);
```

### 3. Iniciar Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

**Credenciais padrão:**
- Usuário: `luis`
- Senha: `123`

## 📦 Dependências Instaladas

```bash
# Supabase JavaScript Client
npm install @supabase/supabase-js

# React e complementos (já existentes)
npm install react react-dom
```

## 🔍 Exemplos de Uso

### Buscar Inspeções

```javascript
import { supabase } from '@/supabaseClient';

const { data, error } = await supabase
  .from('inspecoes')
  .select('*')
  .order('created_at', { ascending: false });

if (error) {
  console.error('❌ Erro:', error.message);
} else {
  console.log('✅ Dados:', data);
}
```

### Salvar Inspeção

```javascript
const inspection = {
  id: Date.now(),
  date: new Date().toISOString(),
  client: { name: 'João', phone: '11999999999' },
  vehicle: { brandModel: 'Honda Civic', plate: 'ABC1234' },
  // ... outros campos
};

const { data, error } = await supabase
  .from('inspecoes')
  .upsert([inspection], { onConflict: 'id' })
  .select();
```

### Usar o Hook Customizado

```javascript
import { useSupabase } from '@/hooks/useSupabase';

function MyComponent() {
  const { isLoading, error, fetchInspections, deleteInspection } = useSupabase();

  const loadData = async () => {
    const data = await fetchInspections({ user: 'luis' });
    console.log(data);
  };

  const removeInspection = async (id) => {
    await deleteInspection(id);
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={loadData} disabled={isLoading}>
        {isLoading ? 'Carregando...' : 'Carregar'}
      </button>
    </div>
  );
}
```

## 🛡️ Tratamento de Erros

Todas as operações possuem try/catch com logs informativos:

```javascript
// Console mostra:
✅ Inspeção salva com sucesso
❌ Erro ao buscar inspeções: [mensagem de erro]
✅ Desconectado com sucesso
```

## 📊 Monitoramento

Verifique o console do navegador para:
- ✅ Logs de sucesso (verde)
- ❌ Logs de erro (vermelho)
- Detalhes completos de cada operação

## 🚢 Deploy no Vercel

1. **Adicionar variáveis de ambiente:**
   ```
   VITE_SUPABASE_URL = https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY = sua-chave-anonima-aqui
   ```

2. **Fazer push ao GitHub:**
   ```bash
   git add .
   git commit -m "Integração com Supabase PostgreSQL"
   git push origin main
   ```

3. **Vercel fará deploy automaticamente**

## 🔐 Segurança

- ✅ Variáveis de ambiente nunca são commitadas
- ✅ RLS (Row Level Security) habilitado
- ✅ Chave pública (anon) com permissões limitadas
- ⚠️ Para produção, revisar e restringir políticas de RLS

## 📚 Arquivos Principais

```
src/
├── supabaseClient.js          # Cliente Supabase inicializado
├── hooks/
│   └── useSupabase.js         # Hook customizado com operações
├── components/
│   ├── App.jsx                # Refatorado para Supabase
│   ├── InspectionForm.jsx     # Com validação e loading
│   ├── HistoryView.jsx
│   └── Login.jsx              # Melhorado UX
├── constants.js
├── index.css
└── main.jsx

.env.local                      # ⚠️ NÃO COMMITAR (gitignore)
.env.local.example              # Template para configuração
SUPABASE_SETUP.md              # Guia completo
```

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| "not enough input" | Verifique `.env.local` e reinicie |
| "Failed to fetch" | Cheque internet e URL do Supabase |
| "undefined is not a function" | Verificar import de `supabase` |
| RLS Policy Error | Criar/revisar políticas no Supabase |
| Dados não persistem | Verificar se tabela foi criada |

## 📞 Suporte

- [Supabase Docs](https://supabase.com/docs)
- [GitHub Issues](https://github.com/luisemerson777/eng-software/issues)
- Console do navegador (F12) para logs detalhados

## ✨ Próximos Passos

- [ ] Adicionar autenticação Supabase Auth (substitui API local)
- [ ] Implementar filtros por período
- [ ] Adicionar relatórios em PDF
- [ ] Sincronização offline com Service Worker
- [ ] Testes unitários com Vitest
