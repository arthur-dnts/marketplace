// navbar.js
async function renderNavbar() {
    try {
        const response = await fetch('/script/templates/navbar/navbar.hbs');
        if (!response.ok) throw new Error('Falha ao carregar navbar.hbs');
        const templateText = await response.text();
        const navbarTemplate = Handlebars.compile(templateText);
        const navbarData = {
            logoSrc: "/assets/svg/static/logo/logo-black.svg",
            titulo: "Marketplace",
            closeMenuSrc: "/assets/svg/close-menu.svg",
            openMenuSrc: "/assets/svg/open-menu.svg",
            links: [
                { class: "nav-button", href: "#home", text: "Início" },
                { class: "nav-button", href: "/cursos", text: "Cursos" },
                { class: "nav-button", href: "/ebooks", text: "E-books" },
                { class: "nav-button", href: "/produtos", text: "Produtos" },
                { class: "nav-button", href: "/trabalhe-conosco", text: "Trabalhe Conosco" },
                { class: "nav-image-button", href: "/carrinho", src: "/assets/svg/static/main/cart.svg", alt: "cart-button" },
                { class: "nav-button", href: "/log-in", style: "color: #0353A4;", target: "_blank", text: "Login" },
                { class: "nav-account", href: "/sign-in", target: "_blank", text: "Cadastre-se" }
            ]
        };
        document.getElementById("navbar").innerHTML = navbarTemplate(navbarData);
    } catch (error) {
        console.error('Erro ao renderizar navbar:', error);
    }
}
document.addEventListener('DOMContentLoaded', renderNavbar);
