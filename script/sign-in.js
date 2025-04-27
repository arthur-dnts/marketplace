document.addEventListener('DOMContentLoaded', () => {
    // Mostrar/esconder senha
    const iconesSenha = document.querySelectorAll('.show-password');
    iconesSenha.forEach(icone => {
        const targetId = icone.getAttribute('data-target');
        const inputSenha = document.getElementById(targetId);
        if (!targetId || !inputSenha) {
            return;
        }
        icone.addEventListener('click', () => {
            if (inputSenha.type === 'password') {
                inputSenha.type = 'text';
                icone.src = '../../assets/svg/static/form/eye-open.svg';
            } else {
                inputSenha.type = 'password';
                icone.src = '../../assets/svg/static/form/eye-closed.svg';
            }
        });
    });

    // Formatar o telefone: (99) 91234-5678
    const telefoneInput = document.getElementById('telefone-input');
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

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
    });

    // Enviar o formulário para o back-end
    const form = document.getElementById('sign-in-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o comportamento padrão do formulário

        // Obter os dados do formulário
        const name = form.querySelector('input[placeholder="Nome"]').value;
        const surname = form.querySelector('input[placeholder="Sobrenome"]').value;
        const email = form.querySelector('input[placeholder="Email"]').value;
        const telefone = form.querySelector('#telefone-input').value;
        const password = form.querySelector('#password').value;
        const confirmpassword = form.querySelector('#confirm-password').value;

        // Criar o objeto com os dados
        const dados = {
            name,
            surname,
            email,
            telefone,
            password,
            confirmpassword
        };

        try {
            // Enviar os dados para o back-end
            const response = await fetch("/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
                // Redirecionar para a página de login
                window.location.href = '/pages/log-in.html';
            } else {
                alert(`Erro ao cadastrar: ${result.msg}`);
            }
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            alert('Erro ao conectar ao servidor. Tente novamente mais tarde.');
        }
    });
});