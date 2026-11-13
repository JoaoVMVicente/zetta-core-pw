// gerenciar.js
// CRUD simples de produtos usando localStorage (adicionar, listar, remover).
import { products, addCustomProduct, removeCustomProduct, getCustomProducts } from './produtos.js';

const PLACEHOLDER_IMG = 'https://placehold.co/600x600?text=Produto';

const form = document.querySelector('#productForm');
const message = document.querySelector('#formMessage');
const listBox = document.querySelector('#customList');

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
}

function fillCategorySuggestions() {
  const datalist = document.querySelector('#categoriasSugeridas');
  const categories = [...new Set(products.map((p) => p.categoria))].sort();
  datalist.replaceChildren(
    ...categories.map((cat) => {
      const option = document.createElement('option');
      option.value = cat;
      return option;
    })
  );
}

function renderList() {
  const custom = getCustomProducts();

  if (!custom.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'Você ainda não cadastrou nenhum produto.';
    listBox.replaceChildren(p);
    return;
  }

  const items = custom.map((product) => {
    const li = document.createElement('li');
    li.className = 'custom-item';

    const img = document.createElement('img');
    img.src = product.imagem_url;
    img.alt = product.nome;

    const info = document.createElement('div');
    info.className = 'custom-info';
    const name = document.createElement('strong');
    name.textContent = product.nome;
    const meta = document.createElement('span');
    meta.textContent = `${product.categoria} · R$ ${product.preco.toFixed(2).replace('.', ',')} · estoque ${product.estoque}`;
    info.append(name, meta);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn-remove';
    remove.textContent = 'Remover';
    remove.addEventListener('click', () => {
      if (!confirm(`Remover "${product.nome}"?`)) return;
      removeCustomProduct(product.id);
      // Remove do carrinho caso o item tenha sido adicionado.
      window.cartStore?.removeFromCart(product.id);
      renderList();
      showMessage('Produto removido.');
    });

    li.append(img, info, remove);
    return li;
  });

  const ul = document.createElement('ul');
  ul.className = 'custom-list';
  ul.append(...items);
  listBox.replaceChildren(ul);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const nome = form.querySelector('#pNome').value.trim();
  const preco = parseFloat(form.querySelector('#pPreco').value);
  const estoque = parseInt(form.querySelector('#pEstoque').value, 10);
  const categoria = form.querySelector('#pCategoria').value.trim();
  const imagem = form.querySelector('#pImagem').value.trim();
  const descricao = form.querySelector('#pDescricao').value.trim();

  if (!nome || !categoria) return showMessage('Informe nome e categoria.', true);
  if (!(preco > 0)) return showMessage('O preço deve ser maior que zero.', true);
  if (!(estoque >= 0)) return showMessage('Estoque inválido.', true);

  addCustomProduct({
    nome,
    preco,
    categoria,
    estoque,
    imagem_url: imagem || PLACEHOLDER_IMG,
    descricao: descricao || undefined,
  });

  form.reset();
  form.querySelector('#pEstoque').value = 1;
  renderList();
  showMessage('Produto adicionado! Ele já aparece na página inicial.');
});

fillCategorySuggestions();
renderList();
