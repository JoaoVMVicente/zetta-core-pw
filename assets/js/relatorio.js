// relatorio.js
// Lê TUDO que o site guarda no localStorage e monta um relatório na tela
// manipulando a árvore DOM (sem innerHTML com dados do usuário).

const KEYS = {
  users: 'usuariosRegistrados',
  session: 'app_logged_user',
  cart: 'app_carrinho',
  purchases: 'app_historico_compras',
  products: 'app_produtos_custom',
};

const brl = (value) =>
  Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** Cria um elemento: el('td', { class: 'x', onclick: fn }, 'texto', outroEl) */
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([name, value]) => {
    if (name.startsWith('on') && typeof value === 'function') {
      node.addEventListener(name.slice(2), value);
    } else if (value !== undefined && value !== null) {
      node.setAttribute(name, value);
    }
  });
  children.flat().forEach((child) => {
    node.append(child instanceof Node ? child : document.createTextNode(String(child ?? '')));
  });
  return node;
}

function table(headers, rows) {
  const thead = el('thead', {}, el('tr', {}, headers.map((h) => el('th', {}, h))));
  const tbody = el('tbody', {}, rows.map((cells) => el('tr', {}, cells.map((c) => el('td', {}, c)))));
  return el('div', { class: 'table-wrap' }, el('table', {}, thead, tbody));
}

function empty(message) {
  return el('p', { class: 'empty' }, message);
}

function removeButton(label, handler) {
  return el('button', { type: 'button', class: 'btn-remove', onclick: handler }, label);
}

function renderStats() {
  const users = read(KEYS.users, []);
  const cart = read(KEYS.cart, []);
  const purchases = read(KEYS.purchases, []);
  const products = read(KEYS.products, []);
  const spent = purchases.reduce((sum, p) => sum + Number(p.total || 0), 0);
  const cartItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const cards = [
    ['Usuários', users.length],
    ['Itens no carrinho', cartItems],
    ['Compras realizadas', purchases.length],
    ['Total gasto', brl(spent)],
    ['Produtos cadastrados', products.length],
    ['Chaves no localStorage', localStorage.length],
  ];

  document.querySelector('#stats').replaceChildren(
    ...cards.map(([label, value]) =>
      el('div', { class: 'stat' }, el('span', { class: 'stat-value' }, value), el('span', { class: 'stat-label' }, label))
    )
  );
}

function renderUsers() {
  const users = read(KEYS.users, []);
  const box = document.querySelector('#usersTable');
  if (!users.length) return box.replaceChildren(empty('Nenhum usuário cadastrado ainda.'));

  box.replaceChildren(
    table(
      ['Nome', 'E-mail', 'Senha', 'Ações'],
      users.map((u, index) => [
        u.nome,
        u.email,
        '•'.repeat(Math.min(String(u.senha || '').length, 10)),
        removeButton('Remover', () => {
          if (!confirm(`Remover o usuário ${u.email}?`)) return;
          users.splice(index, 1);
          localStorage.setItem(KEYS.users, JSON.stringify(users));
          renderAll();
        }),
      ])
    )
  );
}

function renderSession() {
  const user = read(KEYS.session, null);
  const box = document.querySelector('#sessionBox');
  if (!user) return box.replaceChildren(empty('Ninguém está logado no momento.'));

  box.replaceChildren(
    el('p', {}, `Logado como `, el('strong', {}, user.nome || '—'), ` (${user.email})`),
    removeButton('Encerrar sessão', () => {
      localStorage.removeItem(KEYS.session);
      window.location.reload();
    })
  );
}

function renderCart() {
  const cart = read(KEYS.cart, []);
  const box = document.querySelector('#cartTable');
  if (!cart.length) return box.replaceChildren(empty('O carrinho está vazio.'));

  box.replaceChildren(
    table(
      ['Produto', 'Preço', 'Qtd.', 'Subtotal', 'Ações'],
      cart.map((item) => [
        item.name,
        brl(item.price),
        item.quantity,
        brl(item.price * item.quantity),
        removeButton('Remover', () => {
          window.cartStore.removeFromCart(item.id);
          renderAll();
        }),
      ])
    )
  );
}

function renderPurchases() {
  const purchases = read(KEYS.purchases, []);
  const box = document.querySelector('#purchasesTable');
  if (!purchases.length) return box.replaceChildren(empty('Nenhuma compra finalizada ainda.'));

  box.replaceChildren(
    table(
      ['Pedido', 'Data', 'Itens', 'Total', 'Ações'],
      purchases.map((p, index) => [
        `#${p.id}`,
        new Date(p.date).toLocaleString('pt-BR'),
        p.items.map((i) => `${i.name} × ${i.quantity}`).join(', '),
        brl(p.total),
        removeButton('Excluir', () => {
          if (!confirm('Excluir este pedido do histórico?')) return;
          purchases.splice(index, 1);
          localStorage.setItem(KEYS.purchases, JSON.stringify(purchases));
          renderAll();
        }),
      ])
    )
  );
}

function renderProducts() {
  const products = read(KEYS.products, []);
  const box = document.querySelector('#productsTable');
  if (!products.length) {
    return box.replaceChildren(
      el('p', { class: 'empty' }, 'Nenhum produto cadastrado. Use a página ', el('a', { href: 'gerenciar.html' }, 'Gerenciar'), ' para criar.')
    );
  }

  box.replaceChildren(
    table(
      ['ID', 'Nome', 'Categoria', 'Preço', 'Estoque'],
      products.map((p) => [p.id, p.nome, p.categoria, brl(p.preco), p.estoque])
    )
  );
}

function renderRaw() {
  const rows = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key) || '';
    rows.push([
      el('code', {}, key),
      `${new Blob([value]).size} bytes`,
      el('code', { class: 'preview' }, value.length > 80 ? `${value.slice(0, 80)}…` : value),
      removeButton('Apagar chave', () => {
        if (!confirm(`Apagar a chave "${key}"?`)) return;
        localStorage.removeItem(key);
        renderAll();
      }),
    ]);
  }

  const box = document.querySelector('#rawTable');
  if (!rows.length) return box.replaceChildren(empty('O localStorage está vazio.'));
  box.replaceChildren(table(['Chave', 'Tamanho', 'Prévia do valor', 'Ações'], rows));
}

function exportJSON() {
  const dump = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    dump[key] = read(key, localStorage.getItem(key));
  }
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
  const link = el('a', { href: URL.createObjectURL(blob), download: 'zetta-core-localstorage.json' });
  link.click();
  URL.revokeObjectURL(link.href);
}

function renderAll() {
  renderStats();
  renderUsers();
  renderSession();
  renderCart();
  renderPurchases();
  renderProducts();
  renderRaw();
  // Mantém o contador do carrinho no cabeçalho em dia.
  const count = read(KEYS.cart, []).reduce((sum, i) => sum + i.quantity, 0);
  document.querySelector('app-header')?.updateCartCount(count);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#btnExport').addEventListener('click', exportJSON);
  document.querySelector('#btnClearAll').addEventListener('click', () => {
    if (!confirm('Isso apaga TODOS os dados (usuários, carrinho, compras, produtos). Continuar?')) return;
    localStorage.clear();
    window.location.href = 'index.html';
  });
  renderAll();
});
