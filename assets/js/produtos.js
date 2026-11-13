const baseProducts = [{"id":1,"nome":"Notebook Gamer RTX 4060","preco":5499.99,"imagem_url":"https://images.unsplash.com/photo-1606625000171-fa7d471da28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzQ0NDMzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral","estoque":15,"categoria":"Notebooks"},{"id":2,"nome":"Teclado Mecânico RGB","preco":349.99,"imagem_url":"https://images.unsplash.com/photo-1649899913123-90bb33c8a66a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmQlMjByZ2J8ZW58MXx8fHwxNzc0NDc0NzAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral","estoque":100,"categoria":"Periféricos","status":"disponivel"},{"nome":"Monitor 27\" 144Hz IPS","descricao":"isso é um teste","categoria":"teste","preco":1299.99,"imagem_url":"https://images.unsplash.com/photo-1649704394792-9cd6a3995cc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vbml0b3IlMjBzY3JlZW58ZW58MXx8fHwxNzc0MzYwNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral","marca":"","desconto":0,"estoque":1001,"status":"disponivel","acessorios":[],"id":4},{"id":5,"nome":"Mouse Gamer Sem Fio","preco":229.9,"imagem_url":"https://images.unsplash.com/photo-1527814050087-3793815479db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080","estoque":80,"categoria":"Periféricos","status":"disponivel"},{"id":6,"nome":"Headset Surround 7.1","preco":459.9,"imagem_url":"https://images.unsplash.com/photo-1546435770-a3e426bf472b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080","estoque":42,"categoria":"Áudio","status":"disponivel"},{"id":7,"nome":"SSD NVMe 1TB","preco":599.99,"imagem_url":"https://media.kingston.com/kingston/articles/ktc-articles-solutions-pc-performance-different-ssd-form-factors-thumbnail-md.jpg","estoque":64,"categoria":"Armazenamento","status":"disponivel"},{"id":8,"nome":"Webcam Full HD","preco":289.5,"imagem_url":"https://backend.intelbras.com/sites/default/files/2020-10/capa-cam-1080p-web-cam-full-hd.png","estoque":55,"categoria":"Periféricos","status":"disponivel"},{"id":9,"nome":"Cadeira Gamer Ergonômica","preco":1399.0,"imagem_url":"https://images.tcdn.com.br/img/img_prod/1101616/cadeira_gamer_vizion_ergonomica_nr17_com_encosto_p_cabeca_5765_1_6942f4d8b1e0a9e32af3640ffa5126f9.jpg","estoque":18,"categoria":"Móveis","status":"disponivel"},{"id":10,"nome":"Hub USB-C 8 em 1","preco":319.0,"imagem_url":"https://hayloubrasil.com.br/wp-content/uploads/2025/06/9347_01.jpg","estoque":70,"categoria":"Acessórios","status":"disponivel"}]

export const CUSTOM_PRODUCTS_KEY = 'app_produtos_custom';

/** Lê os produtos cadastrados pelo usuário (página "Gerenciar") no localStorage. */
export function getCustomProducts() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY)) || [];
  } catch {
    return [];
  }
}

/** Catálogo final = produtos fixos + produtos cadastrados no localStorage. */
export const products = [...baseProducts, ...getCustomProducts()];

export function addCustomProduct({ nome, preco, categoria, imagem_url, descricao, estoque }) {
  const custom = getCustomProducts();
  const nextId = Math.max(99, ...custom.map((p) => p.id)) + 1;
  const product = {
    id: nextId,
    nome,
    preco: Number(preco),
    categoria,
    imagem_url,
    descricao,
    estoque: Number(estoque) || 0,
    status: 'disponivel',
    custom: true,
  };
  custom.push(product);
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(custom));
  return product;
}

export function removeCustomProduct(id) {
  const custom = getCustomProducts().filter((p) => p.id !== Number(id));
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(custom));
}

/** Renderiza os cards na home, aplicando busca por nome e filtro de categoria. */
export function listProducts({ search = '', category = '' } = {}) {
  const productsList = document.getElementById('productsList');
  if (!productsList) return;
  productsList.innerHTML = '';

  const term = search.trim().toLowerCase();
  const filtered = products.filter((product) =>
    (!category || product.categoria === category) &&
    (!term || product.nome.toLowerCase().includes(term))
  );

  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'products-empty';
    empty.textContent = 'Nenhum produto encontrado.';
    productsList.appendChild(empty);
    return;
  }

  filtered.forEach(product => {
    const productCard = document.createElement('product-card');
    productCard.setAttribute('data', JSON.stringify(product));
    productsList.appendChild(productCard);
  });
}

/** Preenche o <select> de categorias e liga os filtros da home. */
function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categoryFilter');
  if (!searchInput || !categorySelect) return;

  [...new Set(products.map((p) => p.categoria))].sort().forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  const apply = () => {
    listProducts({ search: searchInput.value, category: categorySelect.value });
    // Os cards são recriados: religa os botões "Adicionar ao Carrinho".
    window.cartStore?.connectCartActions({});
  };
  searchInput.addEventListener('input', apply);
  categorySelect.addEventListener('change', apply);
}

export function getProductById(id) {
  return products.find(product => product.id === id);
}

document.addEventListener('DOMContentLoaded', () => {
  listProducts();
  setupFilters();
});
