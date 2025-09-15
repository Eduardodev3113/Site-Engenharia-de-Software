// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Fecha o menu mobile se estiver aberto
            navMenu?.classList.remove('active');
            mobileMenuToggle?.classList.remove('active');
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Função para scroll até seção específica
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Animação de fade-in ao fazer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.destaque-card, .info-card, .reserva-form, .sobre-content');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Sistema de Modais
function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function showRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    setTimeout(() => {
        document.getElementById(targetModalId).classList.add('active');
    }, 300);
}

// Fechar modal clicando fora
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Sistema de Login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simular validação de login
    if (email && password) {
        showAlert('Login realizado com sucesso! 👑', 'success');
        closeModal('loginModal');
        
        // Atualizar interface para usuário logado
        updateUIForLoggedUser(email);
    } else {
        showAlert('Por favor, preencha todos os campos.', 'error');
    }
});

// Sistema de Cadastro
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    
    if (validateRegisterForm(name, email, phone, password)) {
        showAlert(
            `🎉 Cadastro realizado com sucesso!\n\n` +
            `Bem-vindo ao Covil Restaurante, ${name}!\n` +
            `Um email de confirmação foi enviado para ${email}`,
            'success'
        );
        closeModal('registerModal');
        
        // Limpar formulário
        document.getElementById('registerForm').reset();
    }
});

function validateRegisterForm(name, email, phone, password) {
    const errors = [];
    
    if (name.length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push('Email inválido');
    }
    
    const phoneRegex = /^[\(\)0-9\-\s\+]{10,}$/;
    if (!phoneRegex.test(phone)) {
        errors.push('Telefone inválido');
    }
    
    if (password.length < 6) {
        errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    
    if (errors.length > 0) {
        showAlert('Erro de validação:\n' + errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

function updateUIForLoggedUser(email) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <div class="user-info">
                <span>Olá, ${email.split('@')[0]}!</span>
                <button class="btn-logout" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            </div>
        `;
    }
}

function logout() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="btn-login" onclick="showLoginModal()">
                <i class="fas fa-user"></i> Login
            </button>
            <button class="btn-register" onclick="showRegisterModal()">
                <i class="fas fa-user-plus"></i> Cadastro
            </button>
        `;
    }
    showAlert('Logout realizado com sucesso!', 'success');
}

// Sistema de Reservas
const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };
        
        if (validateReservationForm(formData)) {
            submitReservation(formData);
        }
    });
}

function validateReservationForm(data) {
    let isValid = true;
    const errors = [];
    
    // Validar data
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        errors.push('A data da reserva deve ser futura');
        isValid = false;
    }
    
    // Verificar se a data não é mais que 30 dias no futuro
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    
    if (selectedDate > maxDate) {
        errors.push('Reservas podem ser feitas com até 30 dias de antecedência');
        isValid = false;
    }
    
    // Validar segunda-feira (fechado)
    if (selectedDate.getDay() === 1) {
        errors.push('Não funcionamos às segundas-feiras');
        isValid = false;
    }
    
    // Validar horário
    if (!data.time) {
        errors.push('Selecione um horário');
        isValid = false;
    }
    
    // Validar número de pessoas
    if (!data.guests || data.guests < 1 || data.guests > 12) {
        errors.push('Número de pessoas deve ser entre 1 e 12');
        isValid = false;
    }
    
    // Validar nome
    if (data.name.length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
        isValid = false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        errors.push('Email inválido');
        isValid = false;
    }
    
    // Validar telefone
    const phoneRegex = /^[\(\)0-9\-\s\+]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
        errors.push('Telefone inválido');
        isValid = false;
    }
    
    if (!isValid) {
        showAlert('Erro de validação:\n' + errors.join('\n'), 'error');
    }
    
    return isValid;
}

function submitReservation(data) {
    const submitBtn = reservationForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processando...';
    submitBtn.disabled = true;
    
    // Simular chamada da API
    setTimeout(() => {
        // Reset do formulário
        reservationForm.reset();
        updateTimeSlots(); // Limpar horários
        
        // Calcular desconto para grupos grandes
        const discount = data.guests >= 8 ? ' (15% de desconto aplicado para grupos acima de 8 pessoas)' : '';
        
        // Mostrar mensagem de sucesso
        showAlert(
            `🏰 Reserva confirmada no Covil Restaurante!\n\n` +
            `✨ Detalhes da Reserva:\n` +
            `📅 Data: ${formatDate(data.date)}\n` +
            `🕐 Horário: ${data.time}\n` +
            `👥 Pessoas: ${data.guests}${discount}\n` +
            `🦁 Nome: ${data.name}\n\n` +
            `📧 Um email de confirmação foi enviado para ${data.email}\n\n` +
            `Aguardamos sua visita em nosso reino gastronômico!`,
            'success'
        );
        
        // Reset do botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2500);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Sistema de Alertas
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-icon">${type === 'success' ? '👑' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
            <span class="alert-message">${message.replace(/\n/g, '<br>')}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Adicionar estilos se não existirem
    if (!document.querySelector('.alert-styles')) {
        const styles = document.createElement('style');
        styles.className = 'alert-styles';
        styles.textContent = `
            .alert {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 450px;
                z-index: 10000;
                border-radius: 15px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.3);
                animation: slideInRight 0.5s ease;
                border: 2px solid;
            }
            
            .alert-success {
                background: linear-gradient(135deg, #d4af37, #ffd700);
                color: #8b4513;
                border-color: #8b4513;
            }
            
            .alert-error {
                background: linear-gradient(135deg, #8b4513, #654321);
                color: #f5f5dc;
                border-color: #d4af37;
            }
            
            .alert-info {
                background: linear-gradient(135deg, #f5f5dc, #e6e6dc);
                color: #8b4513;
                border-color: #d4af37;
            }
            
            .alert-content {
                padding: 1.5rem;
                display: flex;
                align-items: flex-start;
                gap: 15px;
                font-family: 'Arial', sans-serif;
            }
            
            .alert-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .alert-message {
                flex-grow: 1;
                line-height: 1.5;
                font-size: 0.95rem;
            }
            
            .alert-close {
                background: none;
                border: none;
                font-size: 1.8rem;
                cursor: pointer;
                padding: 0;
                margin-left: 10px;
                opacity: 0.7;
                transition: opacity 0.3s ease;
                font-weight: bold;
            }
            
            .alert-close:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @media (max-width: 480px) {
                .alert {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    top: 80px;
                }
                
                .alert-content {
                    padding: 1rem;
                    gap: 10px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(alert);
    
    // Remover automaticamente
    const autoRemoveTime = type === 'success' ? 7000 : 5000;
    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }
    }, autoRemoveTime);
}

// Sistema de horários para reservas
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        // Definir data mínima (amanhã)
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        
        // Definir data máxima (30 dias)
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 30);
        dateInput.max = maxDate.toISOString().split('T')[0];
        
        // Evento de mudança de data
        dateInput.addEventListener('change', updateTimeSlots);
    }
});

function updateTimeSlots() {
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    
    if (!dateInput || !timeSelect || !dateInput.value) return;
    
    const selectedDate = new Date(dateInput.value);
    const dayOfWeek = selectedDate.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado

    // Limpar horários anteriores
    timeSelect.innerHTML = '';

    // Adicionar opção padrão
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Selecione o horário';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    timeSelect.appendChild(defaultOption);
    
    // Segunda-feira: fechado
    if (dayOfWeek === 1) {
        const option = document.createElement('option');
        option.value = '';
        option.text = 'Fechado (Segunda-feira)';
        option.disabled = true;
        timeSelect.appendChild(option);
        return;
    }

    // Definir horários de funcionamento
    let startHour, endHour;
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sábado e Domingo
        startHour = 17; // 17:00
        endHour = 23.5; // 23:30
    } else { // Terça a Sexta
        startHour = 18; // 18:00
        endHour = 23; // 23:00
    }

    // Gerar intervalos de 30 minutos
    for (let hour = startHour; hour <= endHour; hour += 0.5) {
        const hours = Math.floor(hour);
        const minutes = hour % 1 === 0 ? '00' : '30';
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes}`;

        const option = document.createElement('option');
        option.value = timeStr;
        option.text = timeStr;
        timeSelect.appendChild(option);
    }
}

// Máscara para telefone
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = `(${value}`;
                } else if (value.length <= 7) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                } else if (value.length <= 11) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
                } else {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                }
            }
            
            e.target.value = value;
        });
    });
});

// Navegação por teclado
document.addEventListener('keydown', function(e) {
    // Fechar modais com Escape
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
        
        // Fechar alertas
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            alert.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        });
    }
    
    // Toggle menu mobile com Enter
    if (e.key === 'Enter' && document.activeElement === mobileMenuToggle) {
        mobileMenuToggle.click();
    }
});

// Lazy loading para imagens (quando houver imagens reais)
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Scroll suave para indicador de scroll na hero
document.querySelector('.scroll-indicator')?.addEventListener('click', function() {
    const sobreSection = document.getElementById('sobre');
    if (sobreSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = sobreSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
});

// Animação de typing para o título (opcional)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Contador animado para estatísticas (se houver)
function animateCounter(element, start, end, duration) {
    let current = start;
    const increment = (end - start) / (duration / 10);
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        }
    }, 10);
}

// Sistema de avaliações (para implementação futura)
function submitRating(stars, comment = '') {
    // Esta função será implementada quando o sistema de pagamento estiver ativo
    console.log(`Avaliação: ${stars} estrelas`, comment ? `Comentário: ${comment}` : '');
    
    showAlert(
        `Obrigado pela sua avaliação! ⭐\n\n` +
        `Sua opinião é muito importante para o Covil Restaurante.`,
        'success'
    );
}

// Performance: Debounce para eventos de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce ao evento de scroll
const debouncedScrollHandler = debounce(() => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 10);

window.removeEventListener('scroll', window.addEventListener);
window.addEventListener('scroll', debouncedScrollHandler);

// Cleanup ao sair da página
window.addEventListener('beforeunload', function() {
    // Limpar timers e observers
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => alert.remove());
});

// Sistema de carrinho (para futuro sistema de pedidos online)
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
    }
    
    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...item, quantity: 1 });
        }
        
        this.updateTotal();
        this.updateUI();
    }
    
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.updateTotal();
        this.updateUI();
    }
    
    updateQuantity(itemId, quantity) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = quantity;
            if (quantity <= 0) {
                this.removeItem(itemId);
            }
        }
        this.updateTotal();
        this.updateUI();
    }
    
    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    updateUI() {
        // Atualizar interface do carrinho quando implementado
        console.log('Carrinho atualizado:', this.items, 'Total:', this.total);
    }
    
    clear() {
        this.items = [];
        this.total = 0;
        this.updateUI();
    }
}

// Instância global do carrinho
const cart = new ShoppingCart();

// Função para adicionar item ao carrinho (será usada na página do cardápio)
function addToCart(item) {
    cart.addItem(item);
    showAlert(`${item.name} adicionado ao carrinho! 🛒`, 'success');
}

// Sistema de notificações push (para futuras implementações)
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showAlert('Notificações ativadas! Você será avisado sobre promoções especiais. 🔔', 'success');
            }
        });
    }
}

// Verificar se é um dispositivo touch
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Adicionar classe CSS para dispositivos touch
if (isTouchDevice) {
    document.body.classList.add('touch-device');
}

// Sistema de tema escuro/claro (para futuras implementações)
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Verificar tema salvo
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
});

// PWA: Service Worker registration (para futuras implementações)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(registrationError => {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}

// Analytics e tracking (implementação futura)
function trackEvent(eventName, eventData = {}) {
    // Implementar tracking com Google Analytics ou similar
    console.log('Event tracked:', eventName, eventData);
}

// Trackers de eventos importantes
document.addEventListener('DOMContentLoaded', function() {
    // Track page load
    trackEvent('page_load', { page: 'home' });
    
    // Track clicks no botão do cardápio
    document.querySelectorAll('a[href="cardapio-digital.html"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('cardapio_click', { source: 'home_page' });
        });
    });
    
    // Track submissão de reservas
    if (reservationForm) {
        reservationForm.addEventListener('submit', () => {
            trackEvent('reservation_attempt');
        });
    }
});