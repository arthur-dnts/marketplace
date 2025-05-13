// chart-products.js
let chartProducts = null;
let productSales = null;

export function renderProductCharts() {
  renderTopChart();
  renderSalesChart();
}

function renderTopChart() {
  const canvas = document.getElementById("topProducts");
  if (!canvas) {
    setTimeout(renderTopChart, 100);
    return;
  }

  const ctx = canvas.getContext("2d");

  if (chartProducts) {
    chartProducts.destroy();
  }

  chartProducts = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Design", "Mat. Empresarial", "Finanças", "Inglês para Negócios", "Marketing Digital"],
      datasets: [{
        label: "Top 5 Produtos",
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
  const canvas = document.getElementById("salesProducts");
  if (!canvas) {
    setTimeout(renderSalesChart, 100);
    return;
  }

  const ctx = canvas.getContext("2d");

  if (productSales) {
    productSales.destroy();
  }

  productSales = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Vendas", "Pedidos"],
      datasets: [{
        label: "Vendas | Pedidos",
        data: [512, 724],
        backgroundColor: "#016fb99F",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}