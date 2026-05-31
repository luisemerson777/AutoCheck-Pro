import os
import json
from datetime import datetime
from typing import Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Configuração do banco de dados Neon
DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL não configurada nas variáveis de ambiente")

# Aplicação FastAPI
app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ MODELOS PYDANTIC ============

class LoginRequest(BaseModel):
    username: str
    password: str


class VehicleData(BaseModel):
    placa: Optional[str] = None
    brandModel: Optional[str] = None


class ClientData(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class InspectionData(BaseModel):
    id: Optional[int] = None
    date: Optional[str] = None
    client: Optional[dict] = None
    vehicle: Optional[dict] = None
    mechanics: Optional[dict] = None
    brakes: Optional[dict] = None
    scanner: Optional[dict] = None
    suspension: Optional[dict] = None
    tires: Optional[dict] = None
    fluids: Optional[dict] = None
    safety: Optional[dict] = None
    electrical: Optional[dict] = None
    checkout: Optional[dict] = None
    partsUsed: Optional[str] = None
    observations: Optional[str] = None
    totalValue: Optional[float] = None
    user: Optional[str] = None


# ============ CONEXÃO COM BANCO DE DADOS ============

def get_db_connection():
    """Cria uma conexão com o banco de dados Neon"""
    try:
        conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        return conn
    except psycopg2.Error as e:
        raise


def init_db():
    """Inicializa o banco de dados com a tabela de inspeções"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Criar tabela se não existir
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS inspecoes (
                id SERIAL PRIMARY KEY,
                veiculo_placa VARCHAR(50),
                status VARCHAR(50),
                pecas_utilizadas TEXT,
                observacoes TEXT,
                valor_total NUMERIC(10, 2),
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                usuario VARCHAR(255),
                dados_completos JSONB DEFAULT '{}'
            );
        """)

        # Garantir colunas existentes em esquemas antigos
        cursor.execute("""
            ALTER TABLE inspecoes
            ADD COLUMN IF NOT EXISTS veiculo_placa VARCHAR(50),
            ADD COLUMN IF NOT EXISTS status VARCHAR(50),
            ADD COLUMN IF NOT EXISTS pecas_utilizadas TEXT,
            ADD COLUMN IF NOT EXISTS observacoes TEXT,
            ADD COLUMN IF NOT EXISTS valor_total NUMERIC(10, 2),
            ADD COLUMN IF NOT EXISTS data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS usuario VARCHAR(255),
            ADD COLUMN IF NOT EXISTS dados_completos JSONB DEFAULT '{}';
        """)

        # Criar índices se não existir
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_placa ON inspecoes(veiculo_placa);
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_usuario ON inspecoes(usuario);
        """)

        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        pass


# Inicializar banco ao iniciar a aplicação
@app.on_event("startup")
async def startup_event():
    init_db()


# ============ ENDPOINTS DE AUTENTICAÇÃO ============

@app.post('/api/login')
def login(payload: LoginRequest):
    """
    Endpoint de login - válida credenciais
    Por enquanto, aceita qualquer username/password para desenvolvimento
    """
    if not payload.username or not payload.password:
        raise HTTPException(status_code=400, detail='Username e password obrigatórios')

    # Validação simples - em produção, usar autenticação mais robusta
    if len(payload.username) < 2 or len(payload.password) < 2:
        raise HTTPException(status_code=401, detail='Credenciais inválidas')

    return {
        "user": payload.username,
        "authenticated": True
    }


# ============ ENDPOINTS DE INSPEÇÕES ============

@app.get('/api/inspections')
def list_inspections(user: Optional[str] = None):
    """Lista todas as inspeções, opcionalmente filtradas por usuário"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        if user:
            cursor.execute("""
                SELECT * FROM inspecoes 
                WHERE usuario = %s 
                ORDER BY data_criacao DESC
            """, (user,))
        else:
            cursor.execute("""
                SELECT * FROM inspecoes 
                ORDER BY data_criacao DESC
            """)

        inspections = cursor.fetchall()
        cursor.close()
        conn.close()

        # Converter para lista de dicts
        result = []
        for insp in inspections:
            result.append(dict(insp))

        return {"inspections": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar inspeções: {str(e)}")


@app.get('/api/inspections/{inspection_id}')
def get_inspection(inspection_id: int):
    """Busca uma inspeção específica por ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT * FROM inspecoes WHERE id = %s
        """, (inspection_id,))

        inspection = cursor.fetchone()
        cursor.close()
        conn.close()

        if not inspection:
            raise HTTPException(status_code=404, detail='Inspeção não encontrada')

        return dict(inspection)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar inspeção: {str(e)}")


@app.post('/api/inspections')
def create_inspection(inspection: InspectionData):
    """Cria uma nova inspeção"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        placa = inspection.vehicle.get('placa') if inspection.vehicle else None
        usuario = inspection.user or 'anônimo'
        pecas = inspection.partsUsed or ''
        observacoes = inspection.observations or ''
        valor_total = inspection.totalValue or 0
        dados_completos = json.dumps(inspection.dict(), ensure_ascii=False, default=str)

        cursor.execute("""
            INSERT INTO inspecoes 
            (veiculo_placa, usuario, pecas_utilizadas, observacoes, valor_total, dados_completos)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (placa, usuario, pecas, observacoes, valor_total, dados_completos))

        new_inspection = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()

        return {"inspection": dict(new_inspection)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar inspeção: {str(e)}")


@app.put('/api/inspections/{inspection_id}')
def update_inspection(inspection_id: int, inspection: InspectionData):
    """Atualiza uma inspeção existente (upsert)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Verificar se existe
        cursor.execute("SELECT id FROM inspecoes WHERE id = %s", (inspection_id,))
        exists = cursor.fetchone()

        placa = inspection.vehicle.get('placa') if inspection.vehicle else None
        usuario = inspection.user or 'anônimo'
        pecas = inspection.partsUsed or ''
        observacoes = inspection.observations or ''
        valor_total = inspection.totalValue or 0
        dados_completos = json.dumps(inspection.dict(), ensure_ascii=False, default=str)

        if exists:
            # UPDATE
            cursor.execute("""
                UPDATE inspecoes
                SET veiculo_placa = %s, usuario = %s, pecas_utilizadas = %s, 
                    observacoes = %s, valor_total = %s, dados_completos = %s,
                    data_atualizacao = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            """, (placa, usuario, pecas, observacoes, valor_total, dados_completos, inspection_id))
        else:
            # INSERT (se não existir)
            cursor.execute("""
                INSERT INTO inspecoes 
                (id, veiculo_placa, usuario, pecas_utilizadas, observacoes, valor_total, dados_completos)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (inspection_id, placa, usuario, pecas, observacoes, valor_total, dados_completos))

        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()

        return {"inspection": dict(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar inspeção: {str(e)}")


@app.delete('/api/inspections/{inspection_id}')
def delete_inspection(inspection_id: int):
    """Deleta uma inspeção"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM inspecoes WHERE id = %s", (inspection_id,))
        deleted = cursor.rowcount

        conn.commit()
        cursor.close()
        conn.close()

        if deleted == 0:
            raise HTTPException(status_code=404, detail='Inspeção não encontrada')

        return {"status": "ok", "message": "Inspeção deletada com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao deletar inspeção: {str(e)}")


# ============ HEALTH CHECK ============

@app.get('/api/health')
def health_check():
    """Health check do servidor"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "disconnected", "error": str(e)}


@app.get('/')
def root():
    """Root endpoint"""
    return {
        "message": "API de Inspeções Veiculares",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "login": "POST /api/login",
            "inspections": "GET/POST /api/inspections",
            "inspection_detail": "GET/PUT/DELETE /api/inspections/{id}"
        }
    }
