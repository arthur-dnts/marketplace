import { renderCourseCharts } from "./chart-courses.js";

export function initCourses() {
  renderCourseCharts();

  const form = document.getElementById("course-form");
  if (!form) return;

  // Clonar o formulário para remover ouvintes anteriores
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário

    const submitButton = newForm.querySelector(".form-button");
    submitButton.disabled = true; // Desativa o botão para evitar cliques múltiplos

    // Obtém os dados do formulário
    const title = newForm.querySelector("#title").value.trim();
    const category = newForm.querySelector("#category").value;
    const price = newForm.querySelector("#price").value.trim();
    const fileInput = newForm.querySelector("#fileInput");
    const file = fileInput.files[0];

    // Validações no cliente
    if (!title) {
      alert("O título é obrigatório!");
      submitButton.disabled = false;
      return;
    }
    if (!category) {
      alert("A categoria é obrigatória!");
      submitButton.disabled = false;
      return;
    }
    if (!price || isNaN(parseFloat(price.replace(",", ".")))) {
      alert("O preço deve ser um número válido!");
      submitButton.disabled = false;
      return;
    }

    // Preparar dados para envio
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("type", "course");
    if (file) {
      formData.append("cover", file); // Adiciona a capa, se selecionada
    }

    try {
      const response = await fetch("https://marketplace-rpch.onrender.com/insert", {
        method: "POST",
        body: formData, // Usa FormData para suportar arquivo
      });

      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("Resposta inesperada do servidor:", text);
        alert("Erro inesperado ao processar a resposta do servidor.");
        submitButton.disabled = false;
        return;
      }

      if (response.ok) {
        alert(result.msg);
        newForm.reset();
        newForm.querySelector("#fileName").textContent = "Nenhuma capa selecionada";
        document.getElementById("myModal").style.display = "none";
      } else {
        alert(`Erro ao cadastrar novo curso: ${result.msg || "Erro desconhecido."}`);
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao conectar ao servidor, tente novamente mais tarde.");
    } finally {
      submitButton.disabled = false; // Reativa o botão
    }
  });

  // Atualizar nome do arquivo selecionado
  const fileInput = newForm.querySelector("#fileInput");
  const fileNameSpan = newForm.querySelector("#fileName");
  if (fileInput && fileNameSpan) {
    fileInput.addEventListener("change", () => {
      fileNameSpan.textContent = fileInput.files[0]?.name || "Nenhuma capa selecionada";
    });
  }
}