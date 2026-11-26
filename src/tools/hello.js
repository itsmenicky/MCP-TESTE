export async function hello({ nome }) {
  return {
    content: [
      {
        type: "text",
        text: `Olá ${nome}`,
      },
    ],
  };
}
