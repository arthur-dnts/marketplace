// cards.js
async function renderCards() {
    try {
        const response = await fetch("/script/templates/cards/cards.hbs");
        if (!response.ok) throw new Error("Falha aao carregar cards.hbs");
        const templateText = await response.text();
        const cardsTemplate = Handlebars.compile(templateText);
        const cardsData = {
            moreButtonText: "Acessar todos",
            sectionTitle: "Mais vendidos",
            topProducts: [
              { name: "Produto 1", description: "Descrição 1" },
              { name: "Produto 2", description: "Descrição 2" },
              { name: "Produto 3", description: "Descrição 3" },
              { name: "Produto 4", description: "Descrição 4" },
            ],
            bottomProducts: [
              { name: "Produto 5", description: "Descrição 5" },
              { name: "Produto 6", description: "Descrição 6" },
              { name: "Produto 7", description: "Descrição 7" },
              { name: "Produto 8", description: "Descrição 8" },
            ]
        };
        document.getElementById("cards").innerHTML = cardsTemplate(cardsData);
    } catch (error) {
        console.error("Erro ao renderizar cards:", error);
    }
}
document.addEventListener("DOMContentLoaded", renderCards);
