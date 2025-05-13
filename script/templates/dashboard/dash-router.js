// dash-router.js
const routes = {
  main: { template: "main.hbs", script: "main.js", init: "initMain" },
  ebooks: { template: "ebooks.hbs", script: "ebooks.js", init: "initEbooks" },
  products: { template: "products.hbs", script: "products.js", init: "initProducts" },
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
          { href: "#", icon: "../assets/svg/static/dashboard/e-book.svg", alt: "book", label: "E-books" },
          { href: "#", icon: "../assets/svg/static/dashboard/products.svg", alt: "product", label: "Produtos" },
          { href: "#", icon: "../assets/svg/static/dashboard/user.svg", alt: "user", label: "Usuários" },
          { href: "#", icon: "../assets/svg/static/dashboard/dev.svg", alt: "dev", label: "Dev" },
        ],
        topCards: [
          { title: "Alunos", value: "1247", icon: "../assets/svg/static/dashboard/students.png", alt: "students" },
          { title: "E-books", value: "35", icon: "../assets/svg/static/dashboard/courses.png", alt: "courses" },
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
    case "users":
      return {
        users: [
          { id: "#0000", name: "Lorem Ipsum", avatar: "../assets/svg/static/dashboard/user.svg", status: "Ativo", statusClass: "active", type: "Usuário" },
          { id: "#0001", name: "Lorem Ipsum", avatar: "../assets/svg/static/dashboard/user.svg", status: "Inativo", statusClass: "deactive", type: "Usuário" },
          { id: "#0002", name: "Lorem Ipsum", avatar: "../assets/svg/static/dashboard/user.svg", status: "Ativo", statusClass: "active", type: "Admin" },
          { id: "#0003", name: "Lorem Ipsum", avatar: "../assets/svg/static/dashboard/user.svg", status: "Pendente", statusClass: "pending", type: "Usuário" },
          { id: "#0004", name: "Lorem Ipsum", avatar: "../assets/svg/static/dashboard/user.svg", status: "Ativo", statusClass: "active", type: "Usuário" },
          { id: "#0005", name: "Lorem Ipsum", avatar: "../assets/svg/static/dashboard/user.svg", status: "Inativo", statusClass: "deactive", type: "Admin" },
        ]
      };
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
