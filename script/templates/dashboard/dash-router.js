// dash-router.js
const routes = {
  main: { template: "main.hbs", script: "main.js", init: "initMain" },
  ebooks: { template: "ebooks.hbs", script: "ebooks.js", init: "initEbooks" },
  products: { template: "products.hbs", script: "products.js", init: "initProducts" },
  courses: { template: "courses.hbs", script: "courses.js", init: "initCourses" },
  users: { template: "users.hbs", script: "users.js", init: "initUsers" },
  dev: { template: "dev.hbs" }
};

let isNavigating = false; // Flag para evitar navegações simultâneas

async function loadPage(route) {
  if (isNavigating) {
    console.log(`Navegação bloqueada: já em andamento para ${route}`);
    return;
  }
  isNavigating = true;

  const routeInfo = routes[route];
  if (!routeInfo) {
    console.error(`Rota "${route}" não encontrada.`);
    document.getElementById("content").innerHTML = "<p>Rota não encontrada.</p>";
    isNavigating = false;
    return;
  }

  const { template, script, init } = routeInfo;
  const dir = template.replace(".hbs", "");

  try {
    console.log(`Carregando template: /script/templates/dashboard/${dir}/${template}`);
    const res = await fetch(`/script/templates/dashboard/${dir}/${template}`);
    if (!res.ok) {
      throw new Error(`Erro ao carregar template: ${res.status} ${res.statusText}`);
    }
    const templateText = await res.text();
    const compiled = Handlebars.compile(templateText);
    const html = compiled(getRouteData(route));
    document.getElementById("content").innerHTML = html;

    // Remove scripts dinâmicos anteriores
    document.querySelectorAll("script[data-dynamic]").forEach((s) => s.remove());

    // Adiciona o script correspondente
    if (script) {
      console.log(`Carregando script: /script/templates/dashboard/${dir}/${script}`);
      const scriptEl = document.createElement("script");
      scriptEl.src = `/script/templates/dashboard/${dir}/${script}?v=${Date.now()}`;
      scriptEl.type = "module";
      scriptEl.setAttribute("data-dynamic", "true");
      scriptEl.onload = async () => {
        try {
          if (init) {
            const module = await import(`/script/templates/dashboard/${dir}/${script}?v=${Date.now()}`);
            if (module[init]) {
              console.log(`Executando ${init} para ${route}`);
              module[init]();
            } else {
              console.warn(`Função "${init}" não encontrada em ${script}`);
            }
          }
        } catch (error) {
          console.error(`Erro ao executar ${init}:`, error);
        }
      };
      scriptEl.onerror = () => {
        console.error(`Erro ao carregar script ${script}`);
      };
      document.body.appendChild(scriptEl);
    }
  } catch (err) {
    console.error(`Erro ao carregar a rota "${route}":`, err);
    document.getElementById("content").innerHTML = "<p>Erro ao carregar a página. Tente novamente.</p>";
  } finally {
    isNavigating = false;
  }
}

function getRouteData(route) {
  switch (route) {
    case "main":
      return {
        year: 2025,
        menuItems: [
          { href: "#", icon: "../assets/svg/static/dashboard/dashboard.svg", alt: "dashboard", label: "Painel Geral", route: "main" },
          { href: "#", icon: "../assets/svg/static/dashboard/e-book.svg", alt: "ebook", label: "E-books", route: "ebooks" },
          { href: "#", icon: "../assets/svg/static/dashboard/products.svg", alt: "product", label: "Produtos", route: "products" },
          { href: "#", icon: "../assets/svg/static/dashboard/graduation.svg", alt: "courses", label: "Cursos", route: "courses" },
          { href: "#", icon: "../assets/svg/static/dashboard/user.svg", alt: "user", label: "Usuários", route: "users" },
          { href: "#", icon: "../assets/svg/static/dashboard/dev.svg", alt: "dev", label: "Dev", route: "dev" },
        ],
        topCards: [
          { title: "Cursos", value: "", icon: "../assets/svg/static/dashboard/courses.png", alt: "students" },
          { title: "E-books", value: "", icon: "../assets/svg/static/dashboard/e-book.png", alt: "courses" },
          { title: "Produtos", value: "", icon: "../assets/svg/static/dashboard/box.png", alt: "box" },
          { title: "Rendimento", value: "0 a.m.", icon: "../assets/svg/static/dashboard/performance.png", alt: "performance" },
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
      return {};
    case "dev":
      return {
        devCards: [
          { title: "Admins", adm: true, test: false, imgSrc: "../assets/svg/static/dashboard/adm.png", alt: "adm" },
          { title: "Notificações", test: true, imgSrc: "../assets/svg/static/dashboard/notification.png", alt: "notification" },
          { title: "Servidores", test: true, imgSrc: "../assets/svg/static/dashboard/server.png", alt: "server" },
        ]
      };
    default:
      return {};
  }
}

function setupSidebarNavigation() {
  const links = document.querySelectorAll(".sidebar-menu a");
  links.forEach((link) => {
    // Clonar o link para remover ouvintes anteriores
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);
    newLink.addEventListener("click", (e) => {
      e.preventDefault();
      const routeName = newLink.dataset.routes;
      console.log(`Clicado no sidebar: ${routeName}`);
      if (routeName && routes[routeName]) {
        loadPage(routeName);
      } else {
        console.error(`Rota inválida: ${routeName}`);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando sidebar e carregando rota main");
  setupSidebarNavigation();
  loadPage("main");
});