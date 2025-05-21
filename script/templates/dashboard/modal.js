// modal.js
function initializeModal() {
  const modal = document.getElementById("myModal");
  const buttons = document.querySelectorAll(".add-btn");
  const span = document.querySelector(".close");

  if (!modal) return;

  // Limpar ouvintes anteriores dos botões -> Evita duplicatas
  buttons.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.onclick = () => modal.style.display = "block";
  });

  if (span) {
    const newSpan = span.cloneNode(true);
    span.parentNode.replaceChild(newSpan, span);
    newSpan.onclick = () => modal.style.display = "none";
  }

  // Remover ouvinte anterior do window
  window.removeEventListener("click", closeModalOnClickOutside);
  window.addEventListener("click", closeModalOnClickOutside);

  function closeModalOnClickOutside(event) {
    if (event.target === modal) modal.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeModal();
  const contentDiv = document.getElementById("content");
  if (contentDiv) {
    const observer = new MutationObserver(() => initializeModal());
    observer.observe(contentDiv, { childList: true, subtree: true });
  }
});