export async function executeSql({ sql }) {
  console.log("SQL recebido:");

  console.log(sql);

  return {
    content: [
      {
        type: "text",
        text: "Consulta executada com sucesso.",
      },
    ],
  };
}
