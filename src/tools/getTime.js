export async function getTime() {
  return {
    content: [
      {
        type: "text",
        text: new Date().toISOString(),
      },
    ],
  };
}
