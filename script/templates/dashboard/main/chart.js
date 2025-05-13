// chart.js
let chartMain = null;

export function renderMainChart() {
  const canvas = document.getElementById("salesChart");
  if (!canvas) {
    setTimeout(renderMainChart, 100);
    return;
  }

  const ctx = canvas.getContext("2d");

  if (chartMain) {
    chartMain.destroy();
  }

  chartMain = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [{
        label: "Vendas",
        data: [1200, 1400, 1000, 1200, 950, 1600],
        backgroundColor: "#016fb99F",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}