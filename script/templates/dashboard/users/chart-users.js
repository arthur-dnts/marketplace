let usersData = null;

export function renderUsersCharts() {
  renderUsersChart();
}

function renderUsersChart() {
  const canvas = document.getElementById("usersData");
  if (!canvas) {
    setTimeout(renderUsersChart, 100);
    return;
  }

  const ctx = canvas.getContext("2d");

  if (usersData) {
    usersData.destroy();
  }

  try {
    usersData = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        datasets: [
          {
            label: "Ano Atual",
            data: [20, 35, 54, 37, 12, 25, 34, 29, 42, 87, 95, 10],
            borderColor: "#016fb9",
            backgroundColor: "#016fb99F",
            fill: false,
          },
          {
            label: "Ano Anterior",
            data: [15, 30, 45, 32, 10, 20, 30, 25, 38, 80, 90, 8],
            borderColor: "#ff0000",
            backgroundColor: "#ff00009F",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animations: {
          y: {
            easing: "easeInOutElastic",
            from: (ctx) => {
              if (ctx.type === "data" ) {
                if (ctx.mode === "default" && !ctx.dropped) {
                  ctx.dropped = true;
                  return 0;
                }
              }
            }
          }
        }
      },
    });
  } catch (error) {
  }
}
