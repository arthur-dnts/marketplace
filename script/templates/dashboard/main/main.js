// dashboard.js
async function renderDash() {
    try {
        const response = await fetch("/script/templates/dashboard/main/main.hbs");
        if (!response.ok) throw new Error("Falha ao carregar dashboard.hbs");
        const templateText = await response.text();
        const dashTemplate = Handlebars.compile(templateText);
        const dashData = {
            "year": 2025,
            "menuItems": [
                { "href": "#", "icon": "../assets/svg/static/dashboard/layer.svg", "alt": "layer", "label": "Painel Geral" },
                { "href": "#", "icon": "../assets/svg/static/dashboard/book.svg", "alt": "book", "label": "E-books" },
                { "href": "#", "icon": "../assets/svg/static/dashboard/products.svg", "alt": "product", "label": "Produtos" },
                { "href": "#", "icon": "../assets/svg/static/dashboard/user.svg", "alt": "user", "label": "Usuários" },
                { "href": "#", "icon": "../assets/svg/static/dashboard/dev.svg", "alt": "dev", "label": "Dev" }
            ],
            "topCards": [
                { "title": "Alunos", "value": "1247", "icon": "../assets/svg/static/dashboard/students.png", "alt": "students" },
                { "title": "Cursos", "value": "35", "icon": "../assets/svg/static/dashboard/courses.png", "alt": "courses" },
                { "title": "Produtos", "value": "27", "icon": "../assets/svg/static/dashboard/box.png", "alt": "box" },
                { "title": "Rendimento", "value": "110k a.m.", "icon": "../assets/svg/static/dashboard/performance.png", "alt": "performance" }
            ],
            "recentUsers": [
                { "name": "Lorem Ipsum", "profileIcon": "../assets/svg/static/dashboard/user.svg", "settingsIcon": "../assets/svg/static/dashboard/settings.svg" },
                { "name": "Lorem Ipsum", "profileIcon": "../assets/svg/static/dashboard/user.svg", "settingsIcon": "../assets/svg/static/dashboard/settings.svg" },
                { "name": "Lorem Ipsum", "profileIcon": "../assets/svg/static/dashboard/user.svg", "settingsIcon": "../assets/svg/static/dashboard/settings.svg" },
                { "name": "Lorem Ipsum", "profileIcon": "../assets/svg/static/dashboard/user.svg", "settingsIcon": "../assets/svg/static/dashboard/settings.svg" },
                { "name": "Lorem Ipsum", "profileIcon": "../assets/svg/static/dashboard/user.svg", "settingsIcon": "../assets/svg/static/dashboard/settings.svg" }
            ]
        };
        document.getElementById("dashboard").innerHTML = dashTemplate(dashData);
    } catch (error) {
        console.error("Erro ao renderizar dashboard:", error);
    }
}
document.addEventListener("DOMContentLoaded", renderDash);
