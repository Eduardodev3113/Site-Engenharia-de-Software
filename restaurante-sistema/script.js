// script.js

// Função para mostrar alertas
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = message;
    
    const container = document.querySelector('.main-content');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Função para confirmar ações
function confirmAction(message) {
    return confirm(message);
}

// Simulação de operações CRUD
function simulateCreate(itemName) {
    showAlert(`${itemName} cadastrado com sucesso!`, 'success');
}

function simulateUpdate(itemName) {
    if (confirmAction(`Confirma a alteração do ${itemName}?`)) {
        showAlert(`${itemName} atualizado com sucesso!`, 'success');
        return true;
    }
    return false;
}

function simulateDelete(itemName) {
    if (confirmAction(`Confirma a exclusão do ${itemName}?`)) {
        showAlert(`${itemName} excluído com sucesso!`, 'success');
        return true;
    }
    return false;
}

// Função para limpar formulários
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// Função para validar campos obrigatórios
function validateForm(formId) {
    const form = document.getElementById(formId);
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc3545';
            valid = false;
        } else {
            field.style.borderColor = '#e0e0e0';
        }
    });
    
    if (!valid) {
        showAlert('Por favor, preencha todos os campos obrigatórios.', 'danger');
    }
    
    return valid;
}

// Função para formatar CPF
function formatCPF(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
}

// Função para formatar telefone
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = value;
}

// Função para formatar moeda
function formatCurrency(input) {
    let value = input.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2) + '';
    value = value.replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    input.value = 'R$ ' + value;
}

// Função para toggle de sidebar (se necessário)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Função para filtrar tabelas
function filterTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    
    if (!input || !table) return;
    
    input.addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let found = false;
            
            for (let j = 0; j < cells.length; j++) {
                if (cells[j].textContent.toLowerCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
            
            rows[i].style.display = found ? '' : 'none';
        }
    });
}

// Função para modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Event listeners globais
document.addEventListener('DOMContentLoaded', function() {
    // Fechar modais ao clicar fora
    window.onclick = function(event) {
        const modals = document.getElementsByClassName('modal');
        for (let i = 0; i < modals.length; i++) {
            if (event.target === modals[i]) {
                modals[i].style.display = 'none';
            }
        }
    };
    
    // Adicionar eventos de formatação automática
    const cpfInputs = document.querySelectorAll('input[data-format="cpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', () => formatCPF(input));
    });
    
    const phoneInputs = document.querySelectorAll('input[data-format="phone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', () => formatPhone(input));
    });
    
    const currencyInputs = document.querySelectorAll('input[data-format="currency"]');
    currencyInputs.forEach(input => {
        input.addEventListener('input', () => formatCurrency(input));
    });
});

// Funções específicas para cada módulo
const ProdutoModule = {
    create: function() {
        if (validateForm('produtoForm')) {
            simulateCreate('Produto');
            clearForm('produtoForm');
        }
    },
    
    edit: function(id) {
        // Simular preenchimento do formulário com dados existentes
        showAlert('Carregando dados do produto para edição...', 'info');
    },
    
    delete: function(id, nome) {
        if (simulateDelete(`produto "${nome}"`)) {
            // Remover linha da tabela
            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                row.remove();
            }
        }
    }
};

const FuncionarioModule = {
    create: function() {
        if (validateForm('funcionarioForm')) {
            simulateCreate('Funcionário');
            clearForm('funcionarioForm');
        }
    },
    
    edit: function(id) {
        showAlert('Carregando dados do funcionário para edição...', 'info');
    },
    
    delete: function(id, nome) {
        if (simulateDelete(`funcionário "${nome}"`)) {
            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                row.remove();
            }
        }
    }
};

const InsumoModule = {
    create: function() {
        if (validateForm('insumoForm')) {
            simulateCreate('Insumo');
            clearForm('insumoForm');
        }
    },
    
    edit: function(id) {
        showAlert('Carregando dados do insumo para edição...', 'info');
    },
    
    delete: function(id, nome) {
        if (simulateDelete(`insumo "${nome}"`)) {
            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                row.remove();
            }
        }
    }
};

const ClienteModule = {
    create: function() {
        if (validateForm('clienteForm')) {
            simulateCreate('Cliente');
            clearForm('clienteForm');
        }
    },
    
    edit: function(id) {
        showAlert('Carregando dados do cliente para edição...', 'info');
    },
    
    delete: function(id, nome) {
        if (simulateDelete(`cliente "${nome}"`)) {
            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                row.remove();
            }
        }
    }
};

const MesaModule = {
    create: function() {
        if (validateForm('mesaForm')) {
            simulateCreate('Mesa');
            clearForm('mesaForm');
        }
    },
    
    edit: function(id) {
        showAlert('Carregando dados da mesa para edição...', 'info');
    },
    
    delete: function(id, numero) {
        if (simulateDelete(`mesa nº ${numero}`)) {
            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                row.remove();
            }
        }
    }
};

// Função para gerar relatórios
function generateReport(reportType) {
    showAlert(`Gerando relatório de ${reportType}...`, 'info');
    
    setTimeout(() => {
        showAlert(`Relatório de ${reportType} gerado com sucesso!`, 'success');
    }, 2000);
}