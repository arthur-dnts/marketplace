// chart-ebooks.js
let chartTop = null;
let chartSales = null;

export function renderCourseCharts() {
  renderTopChart();
  renderSalesChart();
}

function renderTopChart() {
  const canvas = document.getElementById("topCourses");
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
        backgroundColor: ["#016FB9", "#00695C", "#8E24AA", "#00BFA5", "#0599FF"],
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function renderSalesChart() {
  const canvas = document.getElementById("salesCourses");
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
