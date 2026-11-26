import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();

app.use(express.json());

function createServer() {
  const server = new McpServer({
    name: "Nickolas MCP",
    version: "1.0.0",
  });

  //
  // HELLO
  //

  server.registerTool(
    "hello",
    {
      description: "Retorna uma saudação",
      inputSchema: {
        nome: z.string(),
      },
    },
    async ({ nome }) => ({
      content: [
        {
          type: "text",
          text: `Olá ${nome}`,
        },
      ],
    }),
  );

  //
  // TIME
  //

  server.registerTool(
    "get_time",
    {
      description: "Retorna data e hora atual",
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: "text",
          text: new Date().toISOString(),
        },
      ],
    }),
  );

  //
  // SQL
  //

  server.registerTool(
    "execute_sql",
    {
      description: "Executa uma consulta SQL",
      inputSchema: {
        sql: z.string(),
      },
    },
    async ({ sql }) => {
      console.log("SQL recebido:");
      console.log(sql);

      return {
        content: [
          {
            type: "text",
            text: "SQL recebido com sucesso.",
          },
        ],
      };
    },
  );

  return server;
}

//
// HEALTH
//

app.get("/", (_, res) => {
  res.json({
    service: "nickolas-mcp",
    status: "online",
  });
});

app.get("/health", (_, res) => {
  res.json({
    healthy: true,
  });
});

//
// MCP
//

app.all("/mcp", async (req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} /mcp`);

  try {
    const transport = new StreamableHTTPServerTransport();

    const server = createServer();

    await server.connect(transport);

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
