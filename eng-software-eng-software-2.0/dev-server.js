#!/usr/bin/env node

/**
 * Servidor de desenvolvimento local
 *
 * Para usar:
 * 1. npm install express cors
 * 2. node dev-server.js
 * 3. Acesso em http://localhost:3001
 *
 * ⚠️ NOTA: Use apenas para desenvolvimento local
 * Para produção, use a API em api/app.py com Neon PostgreSQL
 */

import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Dados em memória (em produção seria PostgreSQL)
let inspections = [];

// Middleware
app.use(cors());
app.use(express.json());

// Arquivo de persistência local
const DATA_FILE = "./inspections-data.json";

// Carregar dados ao iniciar
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      inspections = JSON.parse(data);
      console.log(`✅ Carregado ${inspections.length} inspeções do arquivo`);
    }
  } catch (err) {
    console.error("❌ Erro ao carregar dados:", err.message);
    inspections = [];
  }
}

// Salvar dados em arquivo
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(inspections, null, 2));
  } catch (err) {
    console.error("❌ Erro ao salvar dados:", err.message);
  }
}

// ============ ROTAS DE INSPEÇÕES ============

// GET /api/inspections - Listar todas
app.get("/api/inspections", (req, res) => {
  console.log("📖 GET /api/inspections");
  const sorted = inspections.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );
  res.json({ data: sorted, error: null });
});

// GET /api/inspections/:id - Obter uma
app.get("/api/inspections/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const inspection = inspections.find((i) => i.id === id);
  if (!inspection) {
    return res
      .status(404)
      .json({ data: null, error: "Inspeção não encontrada" });
  }
  res.json({ data: inspection, error: null });
});

// POST /api/inspections - Criar nova
app.post("/api/inspections", (req, res) => {
  const newInspection = {
    id: Date.now(),
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  inspections.push(newInspection);
  saveData();
  console.log("✅ POST /api/inspections - Criada:", newInspection.id);
  res.json({ data: newInspection, error: null });
});

// PUT /api/inspections/:id - Atualizar
app.put("/api/inspections/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = inspections.findIndex((i) => i.id === id);
  if (index === -1) {
    return res
      .status(404)
      .json({ data: null, error: "Inspeção não encontrada" });
  }
  const updated = {
    ...inspections[index],
    ...req.body,
    id, // mantém o ID
    updated_at: new Date().toISOString(),
  };
  inspections[index] = updated;
  saveData();
  console.log("✅ PUT /api/inspections/:" + id);
  res.json({ data: updated, error: null });
});

// DELETE /api/inspections/:id - Deletar
app.delete("/api/inspections/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = inspections.findIndex((i) => i.id === id);
  if (index === -1) {
    return res
      .status(404)
      .json({ data: null, error: "Inspeção não encontrada" });
  }
  const deleted = inspections[index];
  inspections.splice(index, 1);
  saveData();
  console.log("✅ DELETE /api/inspections/:" + id);
  res.json({ data: deleted, error: null });
});

// ============ ROTA DE LOGIN ============

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "luis" && password === "123") {
    console.log("✅ Login bem-sucedido:", username);
    res.json({
      data: { username, email: "luis@example.com" },
      error: null,
    });
  } else {
    console.log("❌ Login falhou:", username);
    res.status(401).json({
      data: null,
      error: "Credenciais inválidas",
    });
  }
});

// ============ ROTA DE HEALTH CHECK ============

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Servidor de desenvolvimento rodando",
    inspections: inspections.length,
  });
});

// Iniciar servidor
loadData();
app.listen(PORT, () => {
  console.log("");
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║  🚀 Servidor de Desenvolvimento Local                 ║");
  console.log(
    "║  http://localhost:" + PORT + "                                ║",
  );
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("📋 Endpoints disponíveis:");
  console.log("  GET    http://localhost:" + PORT + "/api/inspections");
  console.log("  POST   http://localhost:" + PORT + "/api/inspections");
  console.log("  GET    http://localhost:" + PORT + "/api/inspections/:id");
  console.log("  PUT    http://localhost:" + PORT + "/api/inspections/:id");
  console.log("  DELETE http://localhost:" + PORT + "/api/inspections/:id");
  console.log("  POST   http://localhost:" + PORT + "/api/login");
  console.log("  GET    http://localhost:" + PORT + "/api/health");
  console.log("");
  console.log("🔓 Credenciais de teste:");
  console.log("  Usuário: luis");
  console.log("  Senha: 123");
  console.log("");
});
