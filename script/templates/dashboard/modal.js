function initializeModal() {
    const modal = document.getElementById("myModal");
    const buttons = document.querySelectorAll(".add-btn");
    const span = document.querySelector(".close");

    if (!modal) return;

    buttons.forEach(btn => {
        btn.onclick = () => modal.style.display = "block";
    });

    if (span) {
        span.onclick = () => modal.style.display = "none";
    }

    window.onclick = event => {
        if (event.target == modal) modal.style.display = "none";
    };
}

document.addEventListener("DOMContentLoaded", () => {
    initializeModal(); // Tenta inicializar imediatamente
    const contentDiv = document.getElementById("content");
    if (contentDiv) {
        const observer = new MutationObserver(() => initializeModal());
        observer.observe(contentDiv, { childList: true, subtree: true });
    }
});
