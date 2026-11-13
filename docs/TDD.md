# TDD — Technical Design Document · Zetta Core

> **Nota:** "TDD" aqui significa **Technical Design Document** (documento de design técnico), complementar ao
> [PRD](PRD.md). Na seção 9 há também um **plano de testes** com casos de teste executáveis manualmente
> (e a proposta para automatizá-los), para quem espera o sentido de *Test-Driven Development*.

| | |
|---|---|
| **Versão** | 1.0 |
| **Data** | 13/11/2026 |
| **Relacionado** | [PRD.md](PRD.md), [README.md](../README.md) |

---

## 1. Resumo técnico

Aplicação **estática multi-página (MPA)** em HTML/CSS/JS puros. Não há back-end: o estado persiste no
`localStorage`. A UI compartilhada (cabeçalho, rodapé, card de produto) é implementada com **Web Components**
(Custom Elements) e a lógica de negócio fica em **módulos ES**.

## 2. Arquitetura

```text
┌────────────────────────── Navegador ──────────────────────────┐
│  *.html  ──carrega──▶  assets/css/<pagina>.css (+ app.css)     │
│     │                                                          │
│     └──▶ assets/js/app.js (módulo, em páginas com header)      │
│              ├─▶ components/  <app-header> <app-footer> <product-card>
│              └─▶ compra.js    window.cartStore (carrinho/pedidos)
│                       └─▶ produtos.js (catálogo)               │
│                                                                │
│  Scripts por página: produtos.js (home), login.js, cadastro.js │
│  gerenciar.js, relatorio.js, mascaras.js (checkout)            │
│                              │                                 │
│                              ▼                                 │
│                      localStorage (5 chaves)                   │
└────────────────────────────────────────────────────────────────┘
```

### Decisões de design

| Decisão | Motivo | Trade-off |
|---|---|---|
| MPA com HTML por página | Simples, cumpre "≥ 5 páginas", fácil de avaliar | Duplicação de `<head>` |
| Web Components para header/footer/card | Reuso sem framework | Renderiza só com JS ativo |
| ES Modules | Organização e escopo | Exige servidor HTTP (não funciona em `file://`) |
| `window.cartStore` como API global do carrinho | Usado por vários scripts/páginas, inclusive não-módulos | Estado global; poderia ser módulo importável |
| localStorage como "banco" | Requisito da atividade | Sem criptografia, 5 MB, por origem |
| CSS: tokens em `app.css` + um arquivo por página | Consistência e isolamento | Regras responsivas ficam em cada arquivo de página |
| Catálogo fixo + produtos custom no localStorage | Mantém os produtos de exemplo e permite CRUD | `products` é calculado no carregamento do módulo |

## 3. Módulos JavaScript

| Arquivo | Responsabilidade | API principal |
|---|---|---|
| `app.js` | Entrada: registra componentes e liga ações do carrinho | — |
| `produtos.js` | Catálogo, produtos custom, busca/filtro | `products`, `listProducts({search,category})`, `getProductById`, `addCustomProduct`, `removeCustomProduct`, `getCustomProducts` |
| `compra.js` | Carrinho e compras | `window.cartStore`: `addToCart`, `removeFromCart`, `updateCartQuantity`, `getCartTotals`, `checkoutCart`, `renderCart`, `renderSummary`, `connectCartActions` |
| `login.js` | Login, sessão, validação de e-mail | `login`, `logout`, `getLoggedUser` (internas) |
| `cadastro.js` | Cadastro de usuário (e-mail normalizado em minúsculas) | — |
| `mascaras.js` | Máscaras de input | `window.mascaras.{numeros,cep,diaMes}` |
| `gerenciar.js` | Formulário de produtos e lista com remoção | — |
| `relatorio.js` | Leitura do localStorage e renderização de tabelas, exportação JSON | — |
| `components/header.js` | `<app-header>`: logo, menu, usuário, contador do carrinho, menu mobile | `updateCartCount(n)` |
| `components/footer.js` | `<app-footer>` | — |
| `components/productCard.js` | `<product-card data='{json}'>` | — |

## 4. Modelo de dados

```jsonc
// usuariosRegistrados
[{ "nome": "Ana", "email": "ana@exemplo.com", "senha": "••••" }]

// app_logged_user
{ "email": "ana@exemplo.com", "nome": "Ana" }

// app_carrinho
[{ "id": "2", "name": "Teclado Mecânico RGB", "price": 349.99, "quantity": 2 }]

// app_historico_compras
[{ "id": "1731500000000", "date": "2026-11-13T12:00:00.000Z",
   "items": [/* itens do carrinho */], "total": 699.98 }]

// app_produtos_custom  (ids a partir de 100)
[{ "id": 100, "nome": "...", "preco": 99.9, "categoria": "...",
   "imagem_url": "...", "descricao": "...", "estoque": 5,
   "status": "disponivel", "custom": true }]
```

Regras: ids de produtos custom = `max(99, ids existentes) + 1`; ids do carrinho são `string`; preços em `number`
(formatados em pt-BR na UI).

## 5. Fluxos

### 5.1 Adicionar ao carrinho
`click .add-to-cart` → `cartStore.addToCart({id,name,price})` → soma quantidade se já existir → `saveCart` grava e atualiza
`#cartCount` → `renderCart()`.

### 5.2 Checkout
`checkout.html` verifica `app_logged_user` (senão redireciona ao login) → `submit` do `#checkoutForm` →
`checkoutCart()` cria pedido `{id,date,items,total}` em `app_historico_compras`, limpa o carrinho → redireciona para `index.html`.

### 5.3 Catálogo dinâmico
`produto.html?id=N` → `getProductById(N)` → preenche DOM (`textContent`/`src`); sem produto, mostra estado "não disponível" e mantém o botão desabilitado.

### 5.4 Relatório
`relatorio.js` lê cada chave com `read(key, fallback)` (try/catch) e constrói tabelas com `el(tag, attrs, ...children)`
(`createElement` + `append`). Ações de remover alteram o localStorage e chamam `renderAll()`.

## 6. Interface e responsividade

- **Breakpoints:** `64rem` (tablet grande), `48rem` (tablet/mobile), `30rem` (mobile pequeno).
- **Home:** grade de produtos 4 → 3 → 2 → 1 colunas; seção "sobre" 3 → 1 coluna.
- **Header:** no mobile os links viram menu recolhível (botão hambúrguer, `aria-expanded`).
- **Checkout/Produto/Gerenciar/Relatório:** grades de 2 colunas colapsam para 1; tabelas têm rolagem horizontal.
- **Footer:** 4 → 2 → 1 colunas.

## 7. Segurança e privacidade

| Tema | Situação |
|---|---|
| Senhas | Texto puro no localStorage (limitação aceita; apenas didático). No relatório aparecem mascaradas. |
| XSS | Relatório, gerenciador e cabeçalho usam `textContent`/escape. **Pendência conhecida:** `compra.js` e `productCard.js` interpolam nome/imagem em `innerHTML`; como produtos custom vêm do próprio usuário, o risco é de *self-XSS*. Melhoria futura: escapar ou montar via DOM. |
| Dados de pagamento | Campos do checkout **não são persistidos** em nenhum lugar. |
| Origem | localStorage é isolado por origem (protocolo + host + porta). |

## 8. Estrutura de arquivos

Ver árvore completa no [README](../README.md#-estrutura-de-pastas).

## 9. Plano de testes

### 9.1 Estratégia

Testes **manuais** guiados por casos (abaixo) sobre um servidor local, mais inspeção do localStorage via DevTools
ou página Relatório. Pré-condição de todos os casos: localStorage limpo (`localStorage.clear()`), salvo indicação.

### 9.2 Casos de teste

| ID | Requisito | Passos | Resultado esperado |
|---|---|---|---|
| CT-01 | RF-01/02 | Abrir cada página e usar o menu | 8 páginas acessíveis; menu leva a todas |
| CT-02 | RF-05 | Cadastro com senhas diferentes | Alerta "As senhas não conferem"; nada salvo |
| CT-03 | RF-05 | Cadastro válido | Alerta de sucesso; usuário em `usuariosRegistrados`; vai ao login |
| CT-04 | RF-05 | Cadastrar o mesmo e-mail (inclusive em maiúsculas) | Alerta "e-mail já registrado" |
| CT-05 | RF-06 | Login com senha errada | "E-mail ou senha incorretos"; sem sessão |
| CT-06 | RF-06/07 | Login válido | Redireciona à home; header "Olá, nome" + **Sair** |
| CT-07 | RF-07 | Clicar em **Sair** | `app_logged_user` removido; header mostra **Entrar** |
| CT-08 | RF-08 | Abrir `checkout.html` sem login | Alerta e redirecionamento ao login |
| CT-09 | RF-09/11 | Buscar "mouse"; filtrar "Periféricos"; buscar texto inexistente | Lista filtrada; mensagem "Nenhum produto encontrado" |
| CT-10 | RF-10 | Abrir `produto.html?id=2` e `?id=999` | Dados do produto; estado de erro com botão desabilitado |
| CT-11 | RF-13/15 | Adicionar 2× o mesmo produto | Uma linha, quantidade 2; contador do header = 2 |
| CT-12 | RF-14 | **+**, **−** (até 0) e **Excluir** no carrinho | Quantidade/total atualizados; item some ao zerar/excluir |
| CT-13 | RF-16 | Digitar letras em CEP/cartão/validade | Apenas números; `00000-000`; `MM/AA` |
| CT-14 | RF-17 | Pagar com carrinho cheio (logado) | Pedido em `app_historico_compras`; carrinho vazio |
| CT-15 | RF-12 | Em Gerenciar, adicionar produto válido | Aparece na lista e na home; chave `app_produtos_custom` criada |
| CT-16 | RF-12 | Enviar preço 0 ou nome vazio | Mensagem de erro; nada salvo |
| CT-17 | RF-12 | Remover produto custom | Some da lista, da home e do carrinho |
| CT-18 | RF-18/19 | Abrir Relatório após o fluxo de compra | Tabelas e indicadores coerentes com o localStorage |
| CT-19 | RF-20 | Remover usuário/pedido/chave; **Exportar JSON**; **Limpar tudo** | Registro removido; arquivo baixado; localStorage vazio |
| CT-20 | RNF-01 | Redimensionar para 375 px | Sem rolagem horizontal da página; menu hambúrguer funcional; grades em 1 coluna |
| CT-21 | RNF-05 | Corromper `app_carrinho` no console (`localStorage.app_carrinho='x'`) e abrir Relatório | Relatório não quebra (fallback) |

### 9.3 Cobertura requisito × teste

| Requisito | Casos |
|---|---|
| RF-01/02 | CT-01 |
| RF-05 | CT-02, CT-03, CT-04 |
| RF-06/07 | CT-05, CT-06, CT-07 |
| RF-08 | CT-08 |
| RF-09/10/11 | CT-09, CT-10 |
| RF-12 | CT-15, CT-16, CT-17 |
| RF-13/14/15 | CT-11, CT-12 |
| RF-16/17 | CT-13, CT-14 |
| RF-18/19/20 | CT-18, CT-19 |
| RNF-01/05 | CT-20, CT-21 |

### 9.4 Automação proposta (futuro)

- **Unitários (Vitest/Jest + jsdom):** `compra.js` (`addToCart`, `updateCartQuantity`, `checkoutCart`, totais), `produtos.js`
  (`addCustomProduct` ids, filtro), máscaras.
- **E2E (Playwright):** CT-03 → CT-06 → CT-11 → CT-14 → CT-18 como um único fluxo.
- Pré-requisito: extrair a lógica de `compra.js` para funções puras sem dependência de `document`.

## 10. Dívidas técnicas conhecidas

1. `compra.js` mistura regra de negócio e renderização.
2. `innerHTML` com dados em `compra.js` e `productCard.js` (ver seção 7).
3. Regras `@media` duplicadas por página em vez de uma folha responsiva comum.
4. Estoque exibido/cadastrado, mas **não** abatido na compra.
5. `alert()` como feedback principal em carrinho/login/cadastro.
6. Itens do rodapé (Contato, FAQ…) são apenas texto, sem páginas.
