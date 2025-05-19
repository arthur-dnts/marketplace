import { renderEbookCharts } from "./chart-ebooks.js";

export function initEbooks() {
  renderEbookCharts();
}

const form = document.getElementById("ebook-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o comportamento padrão do formulário

  // Obtém os dados do formulário
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;

  const dados = {
    title,
    category,
    price,
    type: "ebook"
  };

  try {
    // Faz o envio dos dados para o Render
    const response = await fetch("https://marketplace-rpch.onrender.com/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();

      if (response.ok) {
        alert("Ebook criado com sucesso!");
        form.reset();
        document.getElementById("fileName").textContent = "Nenhuma capa selecionada";
        document.getElementById("myModal").style.display = "none";

      } else {
        alert(`Erro ao cadastrar novo ebook: ${result.msg || "Erro desconhecido."}`);
      }
    } else {
      const text = await response.text();
      console.error("Resposta inesperada do servidor:", text);
      alert("Erro inesperado ao processar a resposta do servidor.");
    }

  } catch (error) {
    console.error("Erro ao enviar formulário:", error);
    alert("Erro ao conectar ao servidor, tente novamente mais tarde.");
  }
});
