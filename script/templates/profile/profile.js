// profile.js
async function renderProfile() {
    try {
        const response = await fetch("/script/templates/profile/profile.hbs");
        if (!response.ok) throw new Error("Falha ao carregar profile.hbs");
        const templateText = await response.text();
        const profileTemplate = Handlebars.compile(templateText);

        // Verifica se há um usuário conectado
        const token = localStorage.getItem("authtoken");
        const isAuthenticated = token !== null;
        let userData = null;

        // Se autenticado, busca os dados do usuário
        if (isAuthenticated) {
            try {
                const userResponse = await fetch("/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (userResponse.ok) {
                    userData = await userResponse.json();
                } else {
                    userResponse.json();
                    localStorage.removeItem("authToken");
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
                localStorage.removeItem("authToken");
            }
        }

        const profileData = {
            isAuthenticated: isAuthenticated,
            avatarSrc: "/assets/svg/static/profile/profile-male.svg",
            firstName: userData ? userData.userFirstName : "Usuário",
            fullName: userData ? userData.userFullName : "Usuário",
            email: userData ? userData.userEmail : "usuário@email.com",
            gender: userData ? userData.userGender : "Indefinido",
            phone: userData ? userData.userTelefone : "(99) 90000-0000",
            aadress: userData ? userData.userAdress : "Indefinido",
            courses: [
                { name: "Marketing", progress: 70 },
                { name: "Finanças", progress: 50 },
                { name: "Design", progress: 60 }
            ],
            ebooks: [
                { name: "Inglês Empresarial", progress: 50 },
                { name: "Mindset", progress: 60 }
            ]
        };
        document.getElementById("profile").innerHTML = profileTemplate(profileData);
    } catch (error) {
        console.error("Erro ao renderizar profile:", error);
    }
}

function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    renderNavbar();
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", renderProfile);
