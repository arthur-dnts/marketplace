// users.js
import { renderUsersCharts } from './chart-users.js';

export function initUsers() {
  // Renderiza o gráfico
  renderUsersCharts();

  // Preencher a tabela de usuários dinamicamente
  fetch('https://marketplace-rpch.onrender.com/api/users')
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('.custom-table tbody');
      tbody.innerHTML = ''; // Limpa a tabela
      data.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${user._id}</strong></td>
          <td>${user.name} ${user.surname}</td>
          <td>${user.email}</td>
          <td><span class="status ${user.status.toLowerCase()}">${user.status}</span></td>
          <td><strong>${user.role}</strong></td>
          <td>
            <button class="action-button edit">Editar</button>
            <button class="action-button remove">Remover</button>
          </td>
          `;
        tbody.appendChild(tr);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar dados dos usuários:', error);
    });
}