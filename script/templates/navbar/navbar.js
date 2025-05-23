async function renderNavbar() {
    try {
        const response = await fetch("/script/templates/navbar/navbar.hbs");
        if (!response.ok) throw new Error("Falha ao carregar navbar.hbs");
        const templateText = await response.text();
        const navbarTemplate = Handlebars.compile(templateText);

        // Verifica se há um usuário conectado
        const token = localStorage.getItem("authToken");
        const isAuthenticated = token !== null;
        let userData = null;

        // Se autenticado, busca os dados do usuário
        if (isAuthenticated) {
            try {
                const userResponse = await fetch("/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (userResponse.ok) {
                    userData = await userResponse.json();
                } else {
                    console.error("Erro ao buscar dados do usuário:", await userResponse.json());
                    localStorage.removeItem("authToken");
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
                localStorage.removeItem("authToken");
            }
        }

        // Define os dados do navbar
        const navbarData = {
            logoSrc: "/assets/svg/static/logo/logo-black.png",
            closeMenuSrc: "/assets/svg/static/navbar/close-menu.svg",
            openMenuSrc: "/assets/svg/static/navbar/open-menu.svg",
            links: [
                { class: "nav-button", href: "#home", text: "Início" },
                { class: "nav-button", href: "/cursos", text: "Cursos" },
                { class: "nav-button", href: "/ebooks", text: "E-books" },
                { class: "nav-button", href: "/produtos", text: "Produtos" },
                { class: "nav-button", href: "/trabalhe-conosco", text: "Trabalhe Conosco" },
                { class: "nav-image-button", href: "/carrinho", src: "/assets/svg/static/navbar/bag.svg", alt: "cart-button" }
            ],
            user: {
                isAuthenticated: isAuthenticated,
                username: userData ? userData.username : "Usuário",
                userProfile: userData ? userData.userProfile : "/assets/svg/static/profile/profile-female.svg"
            }
        };

        document.getElementById("navbar").innerHTML = navbarTemplate(navbarData);
    } catch (error) {
        console.error("Erro ao renderizar navbar:", error);
    }
}

document.addEventListener("DOMContentLoaded", renderNavbar);
