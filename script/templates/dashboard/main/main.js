// main.js
import { renderMainChart } from "./chart.js";

export function initMain() {
  // Renderiza o gráfico
  renderMainChart();

  Promise.all([
    fetch("https://marketplace-rpch.onrender.com/api/courses/count").then(res => res.json()),
    fetch("https://marketplace-rpch.onrender.com/api/ebooks/count").then(res => res.json()),
    fetch("https://marketplace-rpch.onrender.com/api/products/count").then(res => res.json()),
    fetch("https://marketplace-rpch.onrender.com/api/revenue/monthly").then(res => res.json())
  ])
    .then(([coursesData, ebooksData, productsData, revenueData]) => {
      const topCards = document.querySelectorAll(".top-cards .card-top-small");
      topCards.forEach(card => {
        const titleElement = card.querySelector("h1");
        const valueElement = card.querySelector("h2.value");
        if (!titleElement || !valueElement) return;

        const title = titleElement.textContent;
        if (title === "Cursos") {
          valueElement.textContent = coursesData.count || 0;
        } else if (title === "E-books") {
          valueElement.textContent = ebooksData.count || 0;
        } else if (title === "Produtos") {
          valueElement.textContent = productsData.count || 0;
        } else if (title === "Rendimento") {
          valueElement.textContent = `${revenueData.revenue || 0} a.m.`;
        }
      });
    })
    .catch(error => {
      console.error("Erro ao carregar contagens dos cards:", error);
    });
}