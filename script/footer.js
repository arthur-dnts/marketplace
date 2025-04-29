async function renderFooter() {
    try {
        const response = await fetch('/script/templates/footer/footer.hbs');
        if (!response.ok) throw new Error('Falha ao carregar footer.hbs');
        const templateText = await response.text();
        const footerTemplate = Handlebars.compile(templateText);
        const footerData = {
            logoSrc: "/assets/svg/static/logo/logo-white.svg",
            titulo: "Marketplace",
            slogan: "Aprenda, Pratique e Monetize.<br>Transformando vidas pelo digital.",
            socialIcons: [
                { src: "/assets/svg/static/main/facebook.svg", alt: "Facebook" },
                { src: "/assets/svg/static/main/instagram.svg", alt: "Instagram" },
                { src: "/assets/svg/static/main/linkedin.svg", alt: "Linkedin" }
            ],
            links: [
                { href: "#home", text: "Início" },
                { href: "/produtos", text: "Produtos" },
                { href: "/cursos", text: "Cursos" },
                { href: "/trabalhe-conosco", text: "Trabalhe Conosco" },
                { href: "#ebooks", text: "E-books" },
                { href: "/suporte", text: "Suporte" }
            ],
            cnpj: "00.000.000/0000-00",
            direitos: "@ Todos os direitos reservados",
            termosUrl: "/termos",
            privacidadeUrl: "/privacidade"
        };
        document.getElementById("footer").innerHTML = footerTemplate(footerData);
    } catch (error) {
        console.error('Erro ao renderizar footer:', error);
    }
}
document.addEventListener('DOMContentLoaded', renderFooter);
