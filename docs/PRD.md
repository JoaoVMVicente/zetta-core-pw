# PRD — Zetta Core (Loja Virtual de Informática)

| | |
|---|---|
| **Versão** | 1.0 |
| **Data** | 13/11/2026 |
| **Tipo** | Projeto acadêmico — Programação Web |
| **Status** | Em desenvolvimento / entregável |

---

## 1. Visão geral

**Zetta Core** é uma loja virtual fictícia de produtos de informática e hardware. O produto roda inteiramente no
navegador (front-end estático) e usa o `localStorage` como base de dados, demonstrando fundamentos de
desenvolvimento web: HTML semântico, CSS responsivo, JavaScript e manipulação da árvore DOM.

## 2. Problema e objetivo

**Problema:** a disciplina exige a construção de um site com múltiplas páginas, autenticação, persistência de dados
no cliente e relatório do que foi armazenado.

**Objetivo:** entregar um e-commerce funcional de ponta a ponta (descoberta → carrinho → compra) que cubra todos os
requisitos da atividade e demonstre boas práticas (componentização, responsividade, separação de responsabilidades).

### Metas de sucesso

- 100% dos requisitos da atividade atendidos (ver seção 7).
- Fluxo principal (cadastro → login → carrinho → checkout) executável sem erros de console.
- Todas as páginas legíveis e utilizáveis de 360 px a 1920 px de largura.

### Fora de escopo (não-metas)

- Back-end, banco de dados real, pagamento real, envio de e-mail.
- Segurança de nível produção (senhas com hash, tokens, HTTPS).
- Controle de estoque transacional e multiusuário simultâneo.

## 3. Público-alvo e personas

| Persona | Descrição | Necessidade |
|---|---|---|
| **Cliente** | Pessoa interessada em comprar periféricos e hardware | Encontrar produtos, comprar de forma simples |
| **Administrador da loja** | Quem cuida do catálogo (mesma pessoa, sem perfil separado) | Incluir/remover produtos rapidamente |
| **Avaliador (professor)** | Verifica os requisitos da disciplina | Ver dados salvos, páginas, JS e responsividade |

## 4. Escopo funcional (requisitos)

Prioridade: **P0** = obrigatório · **P1** = importante · **P2** = diferencial.

### 4.1 Navegação e identidade

| ID | Requisito | Prio. |
|---|---|---|
| RF-01 | O site deve ter ao menos 5 páginas (entregues: 8). | P0 |
| RF-02 | Todas as páginas da loja exibem cabeçalho com **logo simples** e **menu** (Início, Produtos, Carrinho, Gerenciar, Relatório). | P0 |
| RF-03 | A página inicial apresenta a loja (texto institucional) e lista produtos. | P0 |
| RF-04 | Rodapé com informações institucionais em todas as páginas da loja. | P1 |

### 4.2 Autenticação

| ID | Requisito | Prio. |
|---|---|---|
| RF-05 | Formulário de **cadastro** (nome, e-mail, senha, confirmação) com validação de campos vazios, senhas divergentes e e-mail duplicado. | P0 |
| RF-06 | Formulário de **login** com validação de formato de e-mail e credenciais. | P0 |
| RF-07 | O cabeçalho mostra o nome do usuário logado e o botão **Sair**; sem login mostra **Entrar**. | P1 |
| RF-08 | O checkout é protegido: exige usuário logado. | P0 |

### 4.3 Catálogo

| ID | Requisito | Prio. |
|---|---|---|
| RF-09 | Exibir os produtos em cards (imagem, categoria, nome, preço, botão de carrinho). | P0 |
| RF-10 | Página de produto **dinâmica**, montada via parâmetro `?id=` da URL. | P0 |
| RF-11 | **Busca** por nome e **filtro** por categoria na página inicial. | P2 |
| RF-12 | Página **Gerenciar**: **adicionar** e **remover** produtos persistidos no localStorage, refletidos na vitrine. | P0 |

### 4.4 Carrinho e compra

| ID | Requisito | Prio. |
|---|---|---|
| RF-13 | Adicionar produto ao carrinho (persistido no localStorage). | P0 |
| RF-14 | Aumentar/diminuir quantidade e **remover** itens do carrinho. | P0 |
| RF-15 | Contador de itens no ícone do carrinho, atualizado em todas as páginas. | P1 |
| RF-16 | Checkout com dados de entrega e pagamento; máscaras de CEP, número do cartão e validade. | P1 |
| RF-17 | Ao pagar, gravar o pedido no **histórico de compras** e esvaziar o carrinho. | P0 |

### 4.5 Relatório e dados

| ID | Requisito | Prio. |
|---|---|---|
| RF-18 | Página **Relatório** que mostra tudo que está no localStorage: usuários (senha mascarada), sessão, carrinho, compras, produtos e chaves brutas. | P0 |
| RF-19 | Indicadores de resumo (nº de usuários, itens no carrinho, compras, total gasto, produtos, chaves). | P2 |
| RF-20 | No relatório, permitir **remover** registros, **exportar JSON** e **limpar tudo** (com confirmação). | P2 |

## 5. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF-01 | **Responsividade:** layout adaptado a mobile (≥ 360 px), tablet e desktop; menu hambúrguer no mobile; grades de produtos de 4 → 3 → 2 → 1 colunas. |
| RNF-02 | **Estilo:** todas as páginas estilizadas com CSS próprio e tokens globais (`app.css`). |
| RNF-03 | **Sem dependências:** HTML/CSS/JS puros, sem build. |
| RNF-04 | **Segurança básica de DOM:** dados do usuário inseridos via `textContent`/`createElement` no relatório e no gerenciador (evita injeção de HTML). |
| RNF-05 | **Resiliência:** leitura do localStorage tolerante a JSON inválido (fallback). |
| RNF-06 | **Compatibilidade:** navegadores modernos com suporte a ES Modules e Custom Elements. |
| RNF-07 | **Portabilidade:** links relativos, funcionando em raiz de domínio ou subpasta (ex.: GitHub Pages). |

## 6. Jornadas principais

1. **Compra:** Início → (busca/filtro) → Produto → Adicionar ao carrinho → Carrinho → Finalizar → Login/Cadastro (se necessário) → Checkout → Pedido salvo.
2. **Administração:** Menu → Gerenciar → Novo produto → ver na vitrine → Remover.
3. **Auditoria:** Menu → Relatório → inspecionar/exportar/limpar dados.

## 7. Rastreabilidade com a atividade

| Exigência da atividade | Requisitos |
|---|---|
| ≥ 5 páginas | RF-01 |
| Login/Cadastro | RF-05, RF-06, RF-07, RF-08 |
| Adição e remoção na base (localStorage) | RF-12, RF-13, RF-14, RF-20 |
| Relatório do que está armazenado | RF-18, RF-19, RF-20 |
| Manipulação da árvore DOM com JS | RF-09, RF-10, RF-11, RF-14, RF-18 |
| Tela inicial com menu, informação, logo e produtos | RF-02, RF-03, RF-09 |
| JavaScript além do localStorage | RF-10, RF-11, RF-16, RNF-01 (menu mobile) |
| Acesso às páginas a partir do menu | RF-02 |
| Todas as páginas estilizadas | RNF-02 |
| Responsividade (diferencial) | RNF-01 |
| Complexidade (diferencial) | Web Components, módulos ES, RF-11, RF-17, RF-18–20 |

## 8. Modelo de dados (resumo)

| Chave localStorage | Estrutura |
|---|---|
| `usuariosRegistrados` | `[{ nome, email, senha }]` |
| `app_logged_user` | `{ email, nome }` |
| `app_carrinho` | `[{ id, name, price, quantity }]` |
| `app_historico_compras` | `[{ id, date, items[], total }]` |
| `app_produtos_custom` | `[{ id, nome, preco, categoria, imagem_url, descricao, estoque, status, custom }]` |

## 9. Riscos e limitações

| Risco / limitação | Impacto | Mitigação |
|---|---|---|
| Senhas em texto puro no localStorage | Insegurança | Aviso no README; escopo acadêmico |
| Dados presos a um navegador/origem | Perda ao limpar dados | Exportação JSON no relatório |
| Imagens dependem de URLs externas | Imagens quebradas offline | Imagem de fallback em produtos criados |
| Módulos ES não rodam via `file://` | Site "vazio" ao abrir direto | Instruções de servidor local no README |
| Limite do localStorage (~5 MB) | Falha ao gravar | Dados pequenos; tratamento de leitura segura |

## 10. Melhorias futuras

- Back-end/API real com autenticação segura (hash de senha, JWT).
- Controle de estoque ao comprar; cupons; frete calculado por CEP (ViaCEP).
- Edição de produtos; perfis (admin × cliente); testes automatizados (Jest/Playwright).
- Acessibilidade (WCAG AA): foco visível em todos os componentes, `aria-live` nos alertas.
