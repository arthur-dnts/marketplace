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

    // Enviar o formulário de login para o back-end
    const form = document.getElementById('log-in-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o comportamento padrão do formulário

        // Obter os dados do formulário
        const email = form.querySelector('input[placeholder="Email"]').value;
        const password = form.querySelector('#password').value;

        // Criar o objeto com os dados
        const dados = {
            email,
            password
        };

        try {
            // Enviar os dados para o back-end
            const response = await fetch("/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const result = await response.json();

            if (response.ok) {
                // Armazenar o token e o refresh token no localStorage
                localStorage.setItem('token', result.token);
                localStorage.setItem('refreshToken', result.refreshToken);
                alert('Login bem-sucedido!');
                // Redirecionar para uma página protegida (ex.: página inicial)
                window.location.href = '../index.html';
            } else {
                alert(`Erro ao fazer login: ${result.msg}`);
            }
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            alert('Erro ao conectar ao servidor. Tente novamente mais tarde.');
        }
    });
});