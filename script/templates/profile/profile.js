// profile.js
async function renderProfile() {
    try {
        const response = await fetch("/script/templates/profile/profile.hbs");
        if (!response.ok) throw new Error("Falha ao carregar profile.hbs");
        const templateText = await response.text();
        const profileTemplate = Handlebars.compile(templateText);
        const profileData = {
            avatarSrc: "/assets/svg/static/profile/profile-female.svg",
            medalSrc: "/assets/svg/static/profile/diamond-medal.svg",
            accountLevel: "Diamante",
            firstName: "Emanuelle",
            fullName: "Emanuelle Araújo",
            email: "manu@email.com",
            gender: "Feminino",
            phone: "(83) 91234-5678",
            street: "Jardim Paulistano",
            city: "Campina Grande",
            state: "Paraíba",
            number: "123",
            complement: "A",
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

document.addEventListener("DOMContentLoaded", renderProfile);
