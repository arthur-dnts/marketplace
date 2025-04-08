document.addEventListener('DOMContentLoaded', () => {
    // Determinar a URL base com base no ambiente
    const API_BASE_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
        ? 'http://localhost:3000'
        : 'https://marketplace-br.vercel.app'; // Domínio do back-end no Vercel

    // Mostrar/esconder senha
    const iconesSenha = document.querySelectorAll('.show-password');
    console.log('Ícones encontrados:', iconesSenha.length);
    iconesSenha.forEach(icone => {
        const targetId = icone.getAttribute('data-target');
        const inputSenha = document.getElementById(targetId);
        if (!targetId || !inputSenha) {
            console.error('Erro: targetId ou inputSenha não encontrado. targetId:', targetId);
            return;
        }
        icone.addEventListener('click', () => {
            console.log('Clicou no ícone para:', targetId);
            console.log('Tipo atual:', inputSenha.type);
            if (inputSenha.type === 'password') {
                inputSenha.type = 'text';
                icone.src = '/assets/svg/static/eye-open.svg';
                console.log('Mudou para text');
            } else {
                inputSenha.type = 'password';
                icone.src = '/assets/svg/static/eye-closed.svg';
                console.log('Mudou para password');
            }
            console.log('Novo tipo:', inputSenha.type);
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
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
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