// dash-router.js
const routes = {
  main: { template: "main.hbs", script: "main.js", init: "initMain" },
  ebooks: { template: "ebooks.hbs", script: "ebooks.js", init: "initEbooks" },
  products: { template: "products.hbs", script: "products.js", init: "initProducts" },
  courses: { template: "courses.hbs", script: "courses.js", init: "initCourses" },
  users: { template: "users.hbs", script: "users.js", init: "initUsers" },
  dev: { template: "dev.hbs" }
};

async function loadPage(route) {
  const routeInfo = routes[route];

  if (!routeInfo) {
    console.error(`Rota "${route}" não encontrada.`);
    document.getElementById("content").innerHTML = "<p>Rota não encontrada.</p>";
    return;
  }

  const { template, script, init } = routeInfo;
  const dir = template.replace(".hbs", "");

  try {
    // Carrega e renderiza o template
    const res = await fetch(`/script/templates/dashboard/${dir}/${template}`);
    const templateText = await res.text();
    const compiled = Handlebars.compile(templateText);
    const html = compiled(getRouteData(route)); // Passa os dados específicos da rota
    document.getElementById("content").innerHTML = html;

    // Remove scripts dinâmicos anteriores
    document.querySelectorAll("script[data-dynamic]").forEach((s) => s.remove());

    // Adiciona o script correspondente da rota atual
    if (script) {
      const scriptEl = document.createElement("script");
      scriptEl.src = `/script/templates/dashboard/${dir}/${script}?v=${Date.now()}`;
      scriptEl.type = "module";
      scriptEl.setAttribute("data-dynamic", "true");
      scriptEl.onload = async () => {
        // Chama a função de inicialização, se definida
        if (init) {
          const module = await import(`/script/templates/dashboard/${dir}/${script}?v=${Date.now()}`);
          if (module[init]) {
            module[init]();
          } else {
            console.warn(`Função de inicialização "${init}" não encontrada em ${script}`);
          }
        }
      };
      document.body.appendChild(scriptEl);
    }
  } catch (err) {
    console.error(`Erro ao carregar a rota "${route}":`, err);
    document.getElementById("content").innerHTML = "<p>Erro ao carregar a página.</p>";
  }
}

// Fornece os dados para cada rota
function getRouteData(route) {
  switch (route) {
    case "main":
      return {
        year: 2025,
        menuItems: [
          { href: "#", icon: "../assets/svg/static/dashboard/dashboard.svg", alt: "dashboard", label: "Painel Geral" },
          { href: "#", icon: "../assets/svg/static/dashboard/e-book.svg", alt: "ebook", label: "E-books" },
          { href: "#", icon: "../assets/svg/static/dashboard/products.svg", alt: "product", label: "Produtos" },
          { href: "#", icon: "../assets/svg/static/dashboard/graduation.svg", alt: "courses", label: "Cursos" },
          { href: "#", icon: "../assets/svg/static/dashboard/user.svg", alt: "user", label: "Usuários" },
          { href: "#", icon: "../assets/svg/static/dashboard/dev.svg", alt: "dev", label: "Dev" },
        ],
        topCards: [
          { title: "Cursos", value: "14", icon: "../assets/svg/static/dashboard/courses.png", alt: "students" },
          { title: "E-books", value: "35", icon: "../assets/svg/static/dashboard/e-book.png", alt: "courses" },
          { title: "Produtos", value: "27", icon: "../assets/svg/static/dashboard/box.png", alt: "box" },
          { title: "Rendimento", value: "5.000 a.m.", icon: "../assets/svg/static/dashboard/performance.png", alt: "performance" },
        ],
        recentUsers: [
          { name: "Lorem Ipsum", profileIcon: "../assets/svg/static/dashboard/user.svg", settingsIcon: "../assets/svg/static/dashboard/settings.svg" },
          { name: "Lorem Ipsum", profileIcon: "../assets/svg/static/dashboard/user.svg", settingsIcon: "../assets/svg/static/dashboard/settings.svg" },
          { name: "Lorem Ipsum", profileIcon: "../assets/svg/static/dashboard/user.svg", settingsIcon: "../assets/svg/static/dashboard/settings.svg" },
          { name: "Lorem Ipsum", profileIcon: "../assets/svg/static/dashboard/user.svg", settingsIcon: "../assets/svg/static/dashboard/settings.svg" },
          { name: "Lorem Ipsum", profileIcon: "../assets/svg/static/dashboard/user.svg", settingsIcon: "../assets/svg/static/dashboard/settings.svg" },
        ],
      };
    case "ebooks":
      return {
        topCards: [
          { title: "E-books", value: 35, imgSrc: "../assets/svg/static/dashboard/e-book.png", alt: "e-book" },
          { title: "Média Diária", value: 12, imgSrc: "../assets/svg/static/dashboard/performance.png", alt: "performance" },
          { title: "Clientes", value: 459, imgSrc: "../assets/svg/static/dashboard/students.png", alt: "students" },
          { title: "Gerenciar", condition: true, imgSrc: "../assets/svg/static/dashboard/adm.png", alt: "adm" }
        ],
      };
    case "products":
      return {
        topCards: [
          { title: "Produtos", value: 27, imgSrc: "../assets/svg/static/dashboard/box.png", alt: "products" },
          { title: "Média Diária", value: 10, imgSrc: "../assets/svg/static/dashboard/performance.png", alt: "performance" },
          { title: "Clientes", value: 312, imgSrc: "../assets/svg/static/dashboard/students.png", alt: "students" },
          { title: "Gerenciar", condition: true, imgSrc: "../assets/svg/static/dashboard/adm.png", alt: "adm" }
        ],
      };
    case "courses":
      return {
        topCards: [
          { title: "Cursos", value: 14, imgSrc: "../assets/svg/static/dashboard/courses.png", alt: "e-book" },
          { title: "Média Diária", value: 12, imgSrc: "../assets/svg/static/dashboard/performance.png", alt: "performance" },
          { title: "Clientes", value: 215, imgSrc: "../assets/svg/static/dashboard/students.png", alt: "students" },
          { title: "Gerenciar", condition: true, imgSrc: "../assets/svg/static/dashboard/adm.png", alt: "adm" }
        ],
      };
    case "users":
      return fetch("https://marketplace-rpch.onrender.com/api/users")
        .then(res => res.json())
        .then(data => {
          console.log("Usuários:", data)
          const tbody = document.querySelector(".custom-table tbody");
          tbody.innerHTML = ""; // Limpar

          // Carrega os usuários dinamicamente
          data.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td><strong>${user._id}</strong></td>
              <td>${user.name} ${user.surname}</td>
              <td><span class="status {{statusClass}}">${user.status}</span></td>
              <td><strong>${user.role}</strong></td>
              <td><button class="action-button edit">Editar</button><button class="action-button remove">Remover</button></td>
            `;
            tbody.appendChild(tr);
          });
        })
        .catch(error => {
          console.error("Erro ao carregar usuários:", error)
        })
    case "dev":
      return {
        devCards: [
          { title: "Admins", adm: true, test: false, imgSrc: "../assets/svg/static/dashboard/adm.png", alt: "adm" },
          { title: "Notificações", test: true, imgSrc: "../assets/svg/static/dashboard/notification.png", alt: "notification" },
          { title: "Servidores", test: true, imgSrc: "../assets/svg/static/dashboard/server.png", alt: "server" },
        ]
      }
    default:
      return {};
  }
}

function setupSidebarNavigation() {
  const links = document.querySelectorAll(".sidebar-menu a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const routeName = link.dataset.routes;
      loadPage(routeName);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupSidebarNavigation();
  loadPage("main");
});
