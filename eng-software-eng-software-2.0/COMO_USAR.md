# 🚀 Guia Prático - Como Usar o AutoCheck

Este projeto está **100% pronto para uso** com Neon PostgreSQL. Aqui está como começar:

## ⚡ Iniciar Rapidinho (Desenvolvimento Local)

### 1️⃣ Terminal 1 - Backend FastAPI (API REST)

```bash
cd api
pip install -r requirements.txt
export DATABASE_URL="postgresql://..."
uvicorn app:app --reload
```

Você verá:

```
INFO:     Application startup complete [uvicorn running on http://0.0.0.0:8000]
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
- Teste login com qualquer usuário

## 🎯 O que Você Pode Fazer Agora

✅ **Login/Logout** - Autenticação funcionando
✅ **Criar Inspeção** - Preencher formulário e salvar
✅ **Listar Inspeções** - Ver histórico de tudo que salvou
✅ **Editar Inspeção** - Clicar em uma do histórico e editar
✅ **Deletar Inspeção** - Remover inspeções
✅ **Tema Escuro** - Ativar/desativar dark mode

## 📦 Arquitetura Atual

A app usa **FastAPI Backend** com **Neon PostgreSQL**:

### Desenvolvimento Local

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- Dados: Neon PostgreSQL
- Autenticação: API REST simples

### Produção (Vercel)

- Frontend: https://eng-software-one.vercel.app
- Backend: https://eng-software-one.vercel.app/api
- Dados: Neon PostgreSQL
- SSL/TLS: Habilitado

## 💻 Arquitetura do Projeto

```
src/
├── api.js                          ← REST API Client
├── neonClient.js                   ← Configuração Neon
├── App.jsx                         ← Aplicação Principal
├── components/
│   ├── Login.jsx
│   ├── InspectionForm.jsx
│   ├── HistoryView.jsx
│   └── Header.jsx
└── hooks/
    └── useSupabase.js              ← Hook para operações de banco (mantido por compatibilidade)

api/
├── app.py                          ← FastAPI Application
├── requirements.txt                ← Dependências Python
└── .env                            ← Configuração Neon

.env.local                          ← Variáveis do Frontend
```

## 🔍 Monitorear o que está Acontecendo

Abra **F12** (Developer Tools) e veja a aba **Console**. Você verá:

```
✅ Login bem-sucedido
✅ Inspeção salva com sucesso: { id: 123, ... }
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
   → /api/login (FastAPI)
        ↓
[Carrega inspeções]
        ↓
   → inspectionsAPI.getAll()
        ↓
   → /api/inspections (FastAPI)
        ↓
   → Neon PostgreSQL
        ↓
[Mostra histórico]
```

## 🛠️ Teclas Úteis

| Comando                        | O Que Faz                                 |
| ------------------------------ | ----------------------------------------- |
| `npm run dev`                  | Inicia app React em http://localhost:5173 |
| `uvicorn api/app:app --reload` | Inicia FastAPI em http://localhost:8000   |
| `npm run dev:full`             | Inicia AMBOS ao mesmo tempo (em paralelo) |
| `npm run build`                | Compila para produção (pasta `dist/`)     |
| `npm run preview`              | Testa build em http://localhost:4173      |

## 🎮 Testar Offline (Sem Internet)

⚠️ **NOTA**: A app precisa de conexão para acessar Neon PostgreSQL.

## 📱 Fazer Deploy (Quando Quiser)

### Para Vercel:

```bash
git add .
git commit -m "Deploy com Neon PostgreSQL"
git push origin main
# Vercel faz deploy automaticamente
```

Configure no Vercel:

- Environment variables:
  - `DATABASE_URL` = sua URL Neon
  - `VITE_API_URL` = https://seu-dominio/api

## 🆘 Se Algo Não Funcionar

### Erro: "Cannot GET /api/login"

- Confirme que `npm run server` está rodando
- Verifica porta 3001 não está bloqueada

### Erro: "not enough input"

- `.env.local` tem variáveis inválidas
- Reinicie `npm run dev`

### Inspeções não salvam

- Confirme que `uvicorn api/app:app --reload` está rodando
- Verifique se `VITE_API_URL` está correto
- Verifique se `DATABASE_URL` está configurado

### Build falha

```bash
rm -rf node_modules
npm install
npm run build
```

## ✨ Próximas Melhorias (Futuro)

- [ ] Autenticação JWT segura
- [ ] Exportar inspeções como PDF
- [ ] Sync offline com Service Worker
- [ ] Testes automatizados
- [ ] Analytics e relatórios
- [ ] App mobile (React Native)

## 📞 Precisa de Ajuda?

Qualquer erro que apareça no console (F12) traz informações úteis.

Boa sorte! 🚗✅
