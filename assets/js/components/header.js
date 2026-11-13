const LOGGED_USER_KEY = 'app_logged_user';
const CART_KEY = 'app_carrinho';

const NAV_LINKS = [
    { href: 'index.html', label: 'Início' },
    { href: 'index.html#produtos', label: 'Produtos' },
    { href: 'carrinho.html', label: 'Carrinho' },
    { href: 'gerenciar.html', label: 'Gerenciar' },
    { href: 'relatorio.html', label: 'Relatório' },
];

function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
}

export class Header extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.classList.add('app-header');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const user = readJSON(LOGGED_USER_KEY, null);

        const navItems = NAV_LINKS.map(({ href, label }) => {
            const isActive = !href.includes('#') && href === currentPage;
            return `<a href="${href}" class="nav-link${isActive ? ' active' : ''}">${label}</a>`;
        }).join('');

        const userArea = user
            ? `<span class="user-greeting" id="userGreeting">Olá, ${escapeHTML(user.nome || user.email)}</span>
               <button type="button" class="btn-logout" id="logoutBtn">Sair</button>`
            : `<a href="login.html" class="btn-login">Entrar</a>`;

        this.innerHTML = `
            <div class="container">
                <div class="header-content">
                    <a href="index.html" class="logo-link" aria-label="Zetta Core - página inicial">
                        <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                            <rect width="32" height="32" rx="8" fill="#030213"/>
                            <path d="M9 9h14l-10 14h10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="logo-text">Zetta Core</span>
                    </a>

                    <button type="button" class="menu-toggle" id="menuToggle" aria-label="Abrir menu" aria-expanded="false">
                        <span></span><span></span><span></span>
                    </button>

                    <nav class="header-nav" id="headerNav" aria-label="Navegação principal">
                        ${navItems}
                    </nav>

                    <div class="header-actions">
                        ${userArea}
                        <a href="carrinho.html" class="header-cart" aria-label="Carrinho">
                            <span class="cart-count" id="cartCount">0</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="8" cy="21" r="1"></circle>
                                <circle cx="19" cy="21" r="1"></circle>
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        `;

        const cartItems = readJSON(CART_KEY, []);
        this.updateCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
        this.bindEvents();
    }

    bindEvents() {
        const toggle = this.querySelector('#menuToggle');
        const nav = this.querySelector('#headerNav');
        toggle?.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });

        this.querySelector('#logoutBtn')?.addEventListener('click', () => {
            localStorage.removeItem(LOGGED_USER_KEY);
            window.location.href = 'index.html';
        });
    }

    updateCartCount(count) {
        const cartCount = this.querySelector('#cartCount');
        if (cartCount) {
            cartCount.textContent = count;
        }
    }
}

customElements.define('app-header', Header);
