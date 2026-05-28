# 🚀 Guia Prático - Como Usar o AutoCheck

Este projeto está **100% pronto para uso**. Aqui está como começar:

## ⚡ Iniciar Rapidinho (Desenvolvimento Local)

### 1️⃣ Terminal 1 - Servidor de Dados (simula Supabase)
```bash
npm run server
```

Você verá:
```
╔════════════════════════════════════════════════════════╗
║  🚀 Servidor de Desenvolvimento Supabase Local        ║
║  http://localhost:3001                                ║
╚════════════════════════════════════════════════════════╝
```

### 2️⃣ Terminal 2 - App React (em outro terminal)
```bash
npm run dev
```

Você verá algo como:
```
VITE v6.4.2  ready in 123 ms

➜  Local:   http://localhost:5173/
```

### 3️⃣ Acessar a App
- Abra: **http://localhost:5173**
- Usuário: `luis`
- Senha: `123`

## 🎯 O que Você Pode Fazer Agora

✅ **Login/Logout** - Autenticação funcionando
✅ **Criar Inspeção** - Preencher formulário e salvar
✅ **Listar Inspeções** - Ver histórico de tudo que salvou
✅ **Editar Inspeção** - Clicar em uma do histórico e editar
✅ **Deletar Inspeção** - Remover inspeções
✅ **Tema Escuro** - Ativar/desativar dark mode

## 📦 O Sistema Automático de APIs

A app foi configurada para usar **DOIS BACKENDS**:

### Modo 1: Desenvolvimento (Agora)
- Usa servidor local em `http://localhost:3001`
- Dados salvos em `inspections-data.json`
- Perfeito para testar offline

### Modo 2: Produção (Supabase)
- Quando credenciais Supabase forem adicionadas a `.env.local`
- App automaticamente muda para usar PostgreSQL do Supabase
- Dados persistem na nuvem

## 🔄 Como Trocar para Supabase (Quando Quiser)

1. **Criar conta no Supabase:**
   - Acesse: https://app.supabase.com
   - Criar novo projeto PostgreSQL

2. **Pegar credenciais:**
   - Project Settings > API
   - Copiar: `Project URL` e `Anon Public Key`

3. **Atualizar `.env.local`:**
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-aqui
   ```

4. **Criar tabela (SQL no Supabase):**
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

   ALTER TABLE inspecoes ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "inspecoes_select" ON inspecoes
     FOR SELECT USING (TRUE);
   CREATE POLICY "inspecoes_insert" ON inspecoes
     FOR INSERT WITH CHECK (TRUE);
   CREATE POLICY "inspecoes_update" ON inspecoes
     FOR UPDATE USING (TRUE);
   CREATE POLICY "inspecoes_delete" ON inspecoes
     FOR DELETE USING (TRUE);
   ```

5. **Reiniciar app:**
   - Interromper `npm run dev` (Ctrl+C)
   - Rodar novamente `npm run dev`
   - App detecta credenciais automaticamente e muda para Supabase

## 💻 Arquitetura do Projeto

```
src/
├── api.js                          ← NOVO: Sistema de API com fallback
├── supabaseClient.js               ← Cliente Supabase
├── App.jsx                         ← Refatorado para usar api.js
├── components/
│   ├── Login.jsx
│   ├── InspectionForm.jsx
│   ├── HistoryView.jsx
│   └── Header.jsx
└── hooks/
    └── useSupabase.js              ← Hook para Supabase

dev-server.js                        ← NOVO: Servidor local de teste
.env.local                           ← NOVO: Variáveis do Supabase
```

## 🔍 Monitorear o que está Acontecendo

Abra **F12** (Developer Tools) e veja a aba **Console**. Você verá:

```
✅ Login bem-sucedido
✅ Inspeção salva com sucesso: { id: 1234, ... }
✅ Inspeção deletada com sucesso
❌ Erro ao buscar inspeções: Network error
```

Cada operação mostra se funcionou (✅) ou falhou (❌).

## 📋 Fluxo de Dados Real

```
[Usuário Login]
        ↓
   → authAPI.login()
        ↓
   → /api/login
        ↓
[Carrega inspeções]
        ↓
   → inspectionsAPI.getAll()
        ↓
   → localhost:3001/api/inspections OU Supabase
        ↓
[Mostra histórico]
```

## 🛠️ Teclas Úteis

| Comando | O Que Faz |
|---------|-----------|
| `npm run dev` | Inicia app React em http://localhost:5173 |
| `npm run server` | Inicia servidor simulado em http://localhost:3001 |
| `npm run dev:full` | Inicia AMBOS ao mesmo tempo (em paralelo) |
| `npm run build` | Compila para produção (pasta `dist/`) |
| `npm run preview` | Testa build em http://localhost:4173 |

## 🎮 Testar Offline (Sem Internet)

Tudo funciona localmente:
1. `npm run server` ← salva em arquivo
2. `npm run dev` ← React funcionando
3. Desligar internet... tudo segue funcionando! 🔥

## 📱 Fazer Deploy (Quando Quiser)

### Para Vercel:
```bash
git add .
git commit -m "Pronto para produção com Supabase"
git push origin main
# Vercel faz deploy automaticamente
```

Configure no Vercel:
- Environment variables:
  - `VITE_SUPABASE_URL` = sua URL
  - `VITE_SUPABASE_ANON_KEY` = sua chave

### Para qualquer hosting:
```bash
npm run build
# Enviar pasta `dist/` para qualquer servidor
```

## 🆘 Se Algo Não Funcionar

### Erro: "Cannot GET /api/login"
- Confirme que `npm run server` está rodando
- Verifica porta 3001 não está bloqueada

### Erro: "not enough input"
- `.env.local` tem variáveis inválidas
- Reinicie `npm run dev`

### Inspeções não salvam
- Confirme `npm run server` está rodando (se usar dev local)
- OU `.env.local` tem credenciais Supabase válidas

### Build falha
```bash
rm -rf node_modules
npm install
npm run build
```

## ✨ Próximas Melhorias (Futuro)

- [ ] Autenticação por email/senha via Supabase Auth
- [ ] Exportar inspeções como PDF
- [ ] Sync offline com Service Worker
- [ ] Testes automatizados
- [ ] Analytics e relatórios
- [ ] App mobile (React Native)

## 📞 Precisa de Ajuda?

Qualquer erro que apareça no console (F12) traz informações úteis.

Boa sorte! 🚗✅
