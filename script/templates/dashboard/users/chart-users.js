// chart-users.js
let usersData = null;

export function renderUsersCharts() {
  fetch('https://marketplace-rpch.onrender.com/api/users')
    .then(res => res.json())
    .then(data => {
      renderUsersChart(data);
    })
    .catch(error => {
      console.error('Erro ao buscar dados para o gráfico:', error);
    });
}

function renderUsersChart(users) {
  const canvas = document.getElementById("usersData");
  if (!canvas) {
    setTimeout(() => renderUsersChart(users), 100);
    return;
  }

  const ctx = canvas.getContext("2d");

  if (usersData) {
    usersData.destroy();
  }

  // Contar usuários por mês
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const currentYearData = new Array(12).fill(0);
  const lastYearData = new Array(12).fill(0);

  users.forEach(user => {
    const createdAt = new Date(user.createdAt);
    const year = createdAt.getFullYear();
    const month = createdAt.getMonth();
    if (year === currentYear) {
      currentYearData[month]++;
    } else if (year === lastYear) {
      lastYearData[month]++;
    }
  });

  try {
    usersData = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: `Ano Atual (${currentYear})`,
            data: currentYearData,
            borderColor: "#016fb9",
            backgroundColor: "#016fb99F",
            fill: false,
          },
          {
            label: `Ano Anterior (${lastYear})`,
            data: lastYearData,
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
              if (ctx.type === "data") {
                if (ctx.mode === "default" && !ctx.dropped) {
                  ctx.dropped = true;
                  return 0;
                }
              }
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Erro ao renderizar o gráfico:', error);
  }
}