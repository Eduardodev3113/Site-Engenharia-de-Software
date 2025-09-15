function registrar(tipo) {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
  
    const agora = new Date();
    const horario = agora.toLocaleString('pt-BR');
  
    if (registros.length > 0) {
      const ultimo = registros[registros.length - 1];
  
      if (ultimo.tipo === tipo) {
        alert(`Você já registrou uma ${tipo.toUpperCase()}. Registre o outro tipo antes.`);
        return;
      }
    } else {
      if (tipo === 'saida') {
        alert('Você precisa registrar uma ENTRADA antes de uma SAÍDA.');
        return;
      }
    }
  
    const registro = { tipo, horario };
    registros.push(registro);
    localStorage.setItem('registros', JSON.stringify(registros));
    mostrarRegistros();
  }
    function limparRegistros() {
    const confirmar = confirm('Tem certeza que deseja apagar todos os registros?');
  
    if (confirmar) {
      localStorage.removeItem('registros'); // remove os dados
      mostrarRegistros(); // atualiza a tela para remover os <li>
    }
  }
  
  
  function mostrarRegistros() {
    const lista = document.getElementById('lista-registros');
    lista.innerHTML = '';
  
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
  
    registros.forEach(reg => {
      const li = document.createElement('li');
      li.textContent = `${reg.tipo.toUpperCase()} - ${reg.horario}`;
      lista.appendChild(li);
    });
  }
  
  // Exibe os registros ao carregar a página
  window.onload = mostrarRegistros;
  