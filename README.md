# 🛒 Zetta Core — Loja Virtual de Informática

Projeto de e-commerce **100% front-end** (HTML + CSS + JavaScript puro, sem frameworks e sem back-end).
Todos os dados (usuários, carrinho, compras e produtos) são salvos no **`localStorage`** do navegador.

> Projeto acadêmico de Programação Web — atende aos requisitos: múltiplas páginas, login/cadastro,
> adição/remoção de elementos no localStorage, relatório do que está armazenado, manipulação da árvore DOM,
> menu + logo + produtos na tela inicial, páginas estilizadas e responsivas.

---

## 📑 Sumário

1. [O que o projeto faz](#-o-que-o-projeto-faz)
2. [Páginas do site](#-páginas-do-site)
3. [Requisitos da atividade × onde estão no projeto](#-requisitos-da-atividade--onde-estão-no-projeto)
4. [Como rodar o projeto (passo a passo)](#-como-rodar-o-projeto-passo-a-passo)
5. [Roteiro de uso (para testar tudo)](#-roteiro-de-uso-para-testar-tudo)
6. [Estrutura de pastas](#-estrutura-de-pastas)
7. [Como os dados são guardados (localStorage)](#-como-os-dados-são-guardados-localstorage)
8. [Tecnologias](#-tecnologias)
9. [Problemas comuns](#-problemas-comuns)
10. [Documentação adicional](#-documentação-adicional)

---

## 🎯 O que o projeto faz

A **Zetta Core** é uma loja fictícia de produtos de informática (notebooks, periféricos, SSDs, etc.). Você pode:

- navegar pelos produtos, **buscar** por nome e **filtrar** por categoria;
- ver os detalhes de cada produto;
- **criar uma conta** e **fazer login**;
- adicionar/remover itens do **carrinho** e alterar quantidades;
- **finalizar a compra** (checkout, com máscaras de CEP, cartão e validade);
- **cadastrar e remover produtos** da loja (página *Gerenciar*);
- consultar um **relatório** com tudo que está salvo no localStorage.

> ⚠️ É um projeto de estudo: **não existe pagamento real** e as senhas ficam salvas em texto puro no navegador.
> Nunca use senhas reais.

---

## 🗺️ Páginas do site

| Página | Arquivo | Para que serve |
|---|---|---|
| Início | `index.html` | Logo, menu, apresentação da loja e vitrine de produtos com busca e filtro |
| Produto | `produto.html?id=N` | Página dinâmica de detalhes de um produto + botão "Adicionar ao Carrinho" |
| Carrinho | `carrinho.html` | Lista os itens, altera quantidade, remove itens e mostra o total |
| Checkout | `checkout.html` | Dados de entrega e pagamento (exige login) |
| Login | `login.html` | Entrar com e-mail e senha |
| Cadastro | `cadastro.html` | Criar uma conta |
| Gerenciar | `gerenciar.html` | **Adicionar e remover produtos** salvos no localStorage |
| Relatório | `relatorio.html` | **Relatório** de tudo que está no localStorage (com exportação em JSON) |

São **8 páginas** (o mínimo pedido era 5).

---

## ✅ Requisitos da atividade × onde estão no projeto

| Requisito | Atendido? | Onde |
|---|---|---|
| Pelo menos 5 páginas web | ✅ | 8 arquivos `.html` na raiz |
| Formulário de **login/cadastro** | ✅ | `login.html` + `assets/js/login.js`, `cadastro.html` + `assets/js/cadastro.js` |
| **Adição e remoção** de elementos na base (localStorage) | ✅ | Carrinho (`assets/js/compra.js`), produtos (`gerenciar.html` + `assets/js/gerenciar.js`), usuários/pedidos (`relatorio.js`) |
| **Relatório** do que está armazenado (localStorage) | ✅ | `relatorio.html` + `assets/js/relatorio.js` |
| Manipulação de conteúdo pela **árvore DOM** com JS | ✅ | Renderização de cards, carrinho, relatório, filtros, menu mobile (`createElement`, `append`, `replaceChildren`) |
| Tela inicial com **menu**, informação sobre o site e **logo** | ✅ | `assets/js/components/header.js` (logo SVG + menu) e `index.html` |
| E-commerce já com **produtos na tela inicial** | ✅ | `index.html` + `assets/js/produtos.js` |
| JavaScript em **outras partes** além do localStorage | ✅ | Web Components, máscaras de input, busca/filtro, menu hambúrguer, produto dinâmico por URL |
| Acesso às outras páginas a partir do menu | ✅ | Menu no cabeçalho de todas as páginas |
| Todas as páginas **estilizadas** | ✅ | `assets/css/*.css` (uma folha por página + `app.css` global) |
| **Responsividade** (diferencial) | ✅ | `@media` queries em todas as páginas, menu hambúrguer no mobile |
| **Complexidade** (diferencial) | ✅ | Web Components, módulos ES, catálogo dinâmico, histórico de compras, relatório, exportação JSON |

---

## 🚀 Como rodar o projeto (passo a passo)

Não precisa instalar nada além de um navegador moderno (Chrome, Edge, Firefox) — mas há **um detalhe importante**:

> O projeto usa **módulos JavaScript** (`<script type="module">`). Os navegadores **bloqueiam módulos** quando
> o arquivo é aberto com duplo clique (`file:///...`). Por isso é preciso abrir o site por um **servidor local**
> (`http://localhost`). É simples, veja abaixo.

### Passo 0 — Baixar o projeto

```bash
git clone https://github.com/JoaoVMVicente/zetta-core-pw.git
cd zetta-core-pw
```

(Ou baixe o ZIP pelo GitHub, extraia e abra a pasta.)

### Opção A — Extensão **Live Server** do VS Code (a mais fácil)

1. Instale o [Visual Studio Code](https://code.visualstudio.com/).
2. Abra a pasta do projeto: **Arquivo → Abrir Pasta…**
3. Instale a extensão **Live Server** (autor: Ritwick Dey) na aba de extensões (`Ctrl+Shift+X`).
4. Clique com o botão direito em `index.html` → **Open with Live Server**.
5. O navegador abre em `http://127.0.0.1:5500/index.html`. Pronto! 🎉

### Opção B — Python (já vem instalado em muitos computadores)

Na pasta do projeto, rode:

```bash
python -m http.server 8000
```

Depois abra no navegador: <http://localhost:8000>

> No Windows, se `python` não funcionar, tente `py -m http.server 8000`.

### Opção C — Node.js

```bash
npx serve .
```

Abra o endereço mostrado no terminal (normalmente <http://localhost:3000>).

### Para parar o servidor

No terminal onde ele está rodando, pressione `Ctrl + C`.

> 💡 Precisa de internet? As imagens dos produtos vêm de links externos (Unsplash etc.) e a fonte Inter vem do
> Google Fonts. Sem internet o site funciona, mas as imagens não aparecem.

---

## 🧪 Roteiro de uso (para testar tudo)

Siga na ordem para ver todas as funcionalidades:

1. **Início** — abra `index.html`. Veja logo, menu e produtos. Digite "mouse" na busca e escolha uma categoria no filtro.
2. **Cadastro** — no menu clique em **Entrar → Cadastre-se**. Preencha nome, e-mail, senha e confirmação. Você é levado ao login.
3. **Login** — entre com o e-mail e a senha criados. O cabeçalho passa a mostrar "Olá, *seu nome*" e o botão **Sair**.
4. **Produto** — clique em um card. A página é montada dinamicamente a partir do `?id=` da URL.
5. **Carrinho** — clique em **Adicionar ao Carrinho** em alguns produtos. Abra o carrinho (ícone 🛒), use **+ / −** e **Excluir**.
6. **Checkout** — clique em **Finalizar Compra**. Preencha os dados (o CEP, o cartão e a validade têm máscara automática) e clique em **Pagar**.
7. **Gerenciar** — no menu, abra **Gerenciar**, cadastre um produto novo e volte ao **Início**: ele já aparece na vitrine. Remova-o depois.
8. **Relatório** — abra **Relatório** para ver usuários, sessão, carrinho, histórico de compras, produtos e as chaves brutas do localStorage. Dá para remover registros, **exportar JSON** ou **limpar tudo**.

---

## 📁 Estrutura de pastas

```text
zetta-core-pw/
├── index.html            # Página inicial (vitrine)
├── produto.html          # Detalhe do produto (dinâmico via ?id=)
├── carrinho.html         # Carrinho
├── checkout.html         # Finalização da compra
├── login.html            # Login
├── cadastro.html         # Cadastro
├── gerenciar.html        # CRUD de produtos (localStorage)
├── relatorio.html        # Relatório do localStorage
├── README.md
├── docs/
│   ├── PRD.md            # Documento de requisitos do produto
│   └── TDD.md            # Documento técnico (design + plano de testes)
└── assets/
    ├── css/
    │   ├── app.css       # Variáveis (design tokens) + reset global
    │   ├── *.css         # Um arquivo por página
    │   └── components/   # header, footer e card de produto
    └── js/
        ├── app.js        # Ponto de entrada: registra componentes e conecta o carrinho
        ├── produtos.js   # Catálogo + produtos do localStorage + busca/filtro
        ├── compra.js     # "cartStore": carrinho e histórico de compras
        ├── login.js      # Login/sessão
        ├── cadastro.js   # Cadastro de usuário
        ├── mascaras.js   # Máscaras de input (CEP, cartão, validade)
        ├── gerenciar.js  # Adicionar/remover produtos
        ├── relatorio.js  # Monta o relatório do localStorage
        └── components/   # Web Components: <app-header>, <app-footer>, <product-card>
```

---

## 💾 Como os dados são guardados (localStorage)

O `localStorage` é um pequeno "banco de dados" do navegador, que guarda pares **chave → texto**.
Aqui os objetos são convertidos com `JSON.stringify` e lidos de volta com `JSON.parse`.

| Chave | Conteúdo | Quem grava |
|---|---|---|
| `usuariosRegistrados` | Lista de usuários `{nome, email, senha}` | `cadastro.js` |
| `app_logged_user` | Usuário logado `{email, nome}` | `login.js` |
| `app_carrinho` | Itens do carrinho `{id, name, price, quantity}` | `compra.js` |
| `app_historico_compras` | Pedidos finalizados `{id, date, items, total}` | `compra.js` |
| `app_produtos_custom` | Produtos cadastrados na página Gerenciar | `produtos.js` / `gerenciar.js` |

**Como inspecionar manualmente:** no navegador aperte `F12` → aba **Application** (Chrome/Edge) ou **Storage**
(Firefox) → **Local Storage** → seu endereço. Ou simplesmente abra a página **Relatório**.

**Como "zerar" o projeto:** na página Relatório clique em **Limpar tudo**, ou rode `localStorage.clear()` no console.

> Os dados são **por navegador e por endereço**: `localhost:8000` e `127.0.0.1:5500` têm armazenamentos separados.

---

## 🧰 Tecnologias

- **HTML5** semântico
- **CSS3** (variáveis CSS, Grid, Flexbox, media queries)
- **JavaScript ES2020+** (módulos ES, Web Components / Custom Elements)
- **localStorage** (Web Storage API)

Sem build, sem dependências, sem `npm install`.

---

## 🛠️ Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| Menu, rodapé e produtos não aparecem | Abriu o arquivo com duplo clique (`file://`) | Use um servidor local (veja [Como rodar](#-como-rodar-o-projeto-passo-a-passo)) |
| "Faça login para finalizar a compra" | Checkout exige usuário logado | Cadastre-se e faça login |
| Login diz "E-mail ou senha incorretos" | Conta criada em outro endereço/navegador | O localStorage é separado por origem; cadastre novamente |
| Imagens quebradas | Sem internet ou link externo fora do ar | Conecte-se; ao cadastrar produtos use URLs válidas |
| Dados "sumiram" | Limpou dados do navegador ou usou aba anônima | Cadastre novamente |

---

## 📚 Documentação adicional

- [`docs/PRD.md`](docs/PRD.md) — Product Requirements Document (o quê e por quê).
- [`docs/TDD.md`](docs/TDD.md) — Technical Design Document (como foi construído + plano de testes).
