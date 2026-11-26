from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Teste")

@mcp.tool()
def hello(nome: str) -> str:
    return f"Olá {nome}"

app = mcp.streamable_http_app()