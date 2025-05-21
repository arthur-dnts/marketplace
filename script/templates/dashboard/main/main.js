// main.js
import { renderMainChart } from "./chart.js";

export function initMain() {
  // Renderiza o gráfico
  renderMainChart();

  Promise.all([
    fetch("https://marketplace-rpch.onrender.com/api/courses/count"),
    fetch("https://marketplace-rpch.onrender.com/api/ebooks/count"),
    fetch("https://marketplace-rpch.onrender.com/api/products/count"),
    fetch("https://marketplace-rpch.onrender.com/api/revenue/monthly")
  ])
    .then(([coursesData, ebooksData, productsData, revenueData]) => {
      const topCards = document.querySelectorAll(".top-cards .card-big");
      topCards.entries.forEach(card => {
        const title = card.querySelector("h1")?.textContent;
        const value = card.querySelector(".value")
        if (title === "Cursos" && value) value.textContent = coursesData.count;
        else if (title === "E-books" && value) value.textContent = ebooksData.count;
        else if (title === "Produtos" && value) value.textContent = productsData.count;
        else if (title === "Rendimento" && value) value.textContent = `${revenueData.revenue} a.m.`;
      });
    })
    .catch(error => {
      console.error("Erro ao carregar contagens dos cards:", error);
    });
}
