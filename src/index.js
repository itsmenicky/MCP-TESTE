import express from "express";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { z } from "zod";

import { hello } from "./tools/hello.js";
import { getTime } from "./tools/getTime.js";
import { executeSql } from "./tools/executeSql.js";

const app = express();

app.use(express.json());

const server = new Server(
  {
    name: "Nickolas MCP",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

//
// HELLO
//

server.tool(
  "hello",
  {
    nome: z.string(),
  },
  hello,
);

//
// TIME
//

server.tool("get_time", {}, getTime);

//
// SQL
//

server.tool(
  "execute_sql",
  {
    sql: z.string(),
  },
  executeSql,
);

//
// HEALTH CHECK
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
  console.log(`[${new Date().toISOString()}] MCP Request`);

  const transport = new StreamableHTTPServerTransport();

  await server.connect(transport);

  await transport.handleRequest(req, res, req.body);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor iniciado porta ${port}`);
});
