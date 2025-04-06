document.addEventListener('DOMContentLoaded', () => {
    const iconesSenha = document.querySelectorAll('.show-password');

    console.log('Ícones encontrados:', iconesSenha.length); // Deve mostrar 2

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
                icone.src = '../assets/svg/static/eye-open.svg';
                console.log('Mudou para text');
            } else {
                inputSenha.type = 'password';
                icone.src = '../assets/svg/static/eye-closed.svg';
                console.log('Mudou para password');
            }

            console.log('Novo tipo:', inputSenha.type);
        });
    });
});