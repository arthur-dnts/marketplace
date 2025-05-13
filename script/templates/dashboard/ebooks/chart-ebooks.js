// chart-ebooks.js
let chartTop = null;
let chartSales = null;

export function renderEbookCharts() {
  renderTopChart();
  renderSalesChart();
}

function renderTopChart() {
  const canvas = document.getElementById("topEbooks");
  if (!canvas) {
    setTimeout(renderTopChart, 100);
    return;
  }

  const ctx = canvas.getContext("2d");

  if (chartTop) {
    chartTop.destroy();
  }

  chartTop = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Design", "Mat. Empresarial", "Finanças", "Inglês para Negócios", "Marketing Digital"],
      datasets: [{
        label: "Top 5 E-books",
        data: [120, 200, 125, 314, 150],
        backgroundColor: ["#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d"],
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function renderSalesChart() {
  const canvas = document.getElementById("salesEbooks");
  if (!canvas) {
    setTimeout(renderSalesChart, 100);
    return;
  }

  const ctx = canvas.getContext("2d");

  if (chartSales) {
    chartSales.destroy();
  }

  chartSales = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Vendas", "Pedidos"],
      datasets: [{
        label: "Vendas | Pedidos",
        data: [909, 1054],
        backgroundColor: "#016fb99F",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}