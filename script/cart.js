async function renderCart() {
    try {
        const response = await fetch("/script/templates/cart/cart.hbs");
        if (!response.ok) throw new Error("Falha ao carregar cart.hbs");
        const templateText = await response.text();
        const cartTemplate = Handlebars.compile(templateText);
        const cartData = {
            products: [
                {
                    image: "../assets/mockup/ebook-mockup.png",
                    category: "E-book",
                    product: "Matemática Financeira",
                    price: "39,90",
                    quantity: 1,
                },
                {
                    image: "../assets/mockup/ebook-mockup.png",
                    category: "E-book",
                    product: "Mindset Empresarial",
                    price: "25,80",
                    quantity: 2,
                },
                {
                    image: "../assets/mockup/ebook-mockup.png",
                    category: "E-book",
                    product: "Inglês para Negócios",
                    price: "45,00",
                    quantity: 2,
                },
                // Mais produtos
            ],
            totalPrice: "119,70",
            finalPrice: "119,70",
            shippingFree: true
        };
        document.getElementById("cart").innerHTML = cartTemplate(cartData);
    } catch (error) {
        console.error("Erro ao renderizar cart:", error);
    }
}   
document.addEventListener("DOMContentLoaded", renderCart);
