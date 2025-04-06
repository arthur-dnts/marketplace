// Ocultar ou exibir a senha
document.addEventListener('DOMContentLoaded', () => {
    const iconesSenha = document.querySelectorAll('.show-password');
    iconesSenha.forEach(icone => {
        const targetId = icone.getAttribute('data-target');
        const inputSenha = document.getElementById(targetId);
        icone.addEventListener('click', () => {
            if (inputSenha.type === 'password') {
                inputSenha.type = 'text';
                icone.src = '../assets/svg/static/eye-open.svg';
                console.log('Mudou para text');
            } else {
                inputSenha.type = 'password';
                icone.src = '../assets/svg/static/eye-closed.svg';
            }
        });
    });
});

// Formatar o número de telefone corretamente
const telefoneInput = document.getElementById('telefone-input');
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (value.length > 11) value = value.slice(0, 12);
        // Formata o número: (99) 91234-5678
        let formattedValue = '';
        if (value.length > 0) {
            formattedValue = '(' + value.substring(0, 2);
        }
        if (value.length >= 3) {
            formattedValue += ') ' + value.substring(2, 7);
        }
        if (value.length >= 8) {
            formattedValue += '-' + value.substring(7, 11);
        }
        e.target.value = formattedValue;
    }
);
