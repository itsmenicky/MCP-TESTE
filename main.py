from fastapi import FastAPI
from mcp.server.fastmcp import FastMCP

# --------------------------------------------------
# MCP Server
# --------------------------------------------------

mcp = FastMCP(
    name="Teste MCP",
    instructions="Servidor MCP de testes para integração com Copilot Studio."
)

# --------------------------------------------------
# Tools
# --------------------------------------------------

@mcp.tool(
    name="hello",
    description="Retorna uma saudação."
)
def hello(nome: str) -> str:
    return f"Olá {nome}"

# --------------------------------------------------
# FastAPI Host
# --------------------------------------------------

app = FastAPI(
    title="Teste MCP",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {
        "status": "ok",
        "service": "teste-mcp"
    }

@app.get("/health")
async def health():
    return {
        "healthy": True
    }

# --------------------------------------------------
# MCP Endpoint
# --------------------------------------------------

app.mount(
    "/mcp",
    mcp.streamable_http_app()
)