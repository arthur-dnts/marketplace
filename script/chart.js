// chart.js
document.addEventListener("DOMContentLoaded", () => {
    const initializeChart = () => {
        const canvas = document.getElementById("salesChart");
        if (!canvas) {
            // Se o elemento não existe, tenta novamente após um pequeno atraso
            setTimeout(initializeChart, 100);
            return;
        }
        const ctx = canvas.getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
                datasets: [{
                    label: "Vendas",
                    data: [1200, 1400, 1000, 1200, 950, 1600],
                    backgroundColor: "#016fb9",
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };
    initializeChart();
});