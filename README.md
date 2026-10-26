# Automação de testes web — Demoblaze (Playwright)

Automação de testes end-to-end da loja [demoblaze.com](https://www.demoblaze.com/),
escrita em TypeScript com [Playwright](https://playwright.dev/).

A estrutura do projeto segue o modelo de referência fornecido na disciplina
(`aulas_testes_software`): separação entre **locators**, **actions**, **fixtures**,
**tests** e **utils**.

---

## Estrutura

```
demoblaze-playwright/
├── actions/                           Ações e validações de negócio
│   ├── DemoblazeNavegacaoActions.ts
│   ├── DemoblazeAutenticacaoActions.ts
│   ├── DemoblazePesquisaActions.ts
│   ├── DemoblazeProdutoActions.ts
│   └── DemoblazeCarrinhoActions.ts
├── fixtures/
│   └── DemoblazeFixtures.ts           Injeção das actions via base.extend
├── locators/                          Mapeamento dos elementos da tela
│   ├── DemoblazeHomeLocators.ts
│   ├── DemoblazeAutenticacaoLocators.ts
│   ├── DemoblazeProdutoLocators.ts
│   └── DemoblazeCarrinhoLocators.ts
├── tests/                             Cenários de teste
│   ├── compraCaminhoFeliz.spec.ts
│   ├── pesquisaProdutos.spec.ts
│   └── cenariosNegativos.spec.ts
├── utils/
│   ├── urls.ts                        URLs da aplicação
│   ├── dados.ts                       Massa de dados e mensagens esperadas
│   └── dialogs.ts                     Captura das mensagens de alert() nativo
├── playwright.config.ts
└── package.json
```

**Camadas:** o teste chama a *action*, a *action* usa o *locator* e aplica as
validações com `expect`. Nenhum seletor aparece dentro dos arquivos de teste.

---

## Como executar

Pré-requisito: Node.js instalado.

```bash
npm install
npx playwright install chromium
npm test
```

Outros comandos úteis:

| Comando | O que faz |
| --- | --- |
| `npm test` | Executa todos os cenários |
| `npm run test:headed` | Executa com o navegador visível |
| `npm run test:feliz` | Executa apenas o caminho feliz |
| `npm run test:pesquisa` | Executa apenas o fluxo de pesquisa |
| `npm run test:negativos` | Executa apenas os cenários negativos |
| `npm run report` | Abre o relatório HTML da última execução |

---

## Atendimento aos requisitos

| Requisito | Onde é atendido |
| --- | --- |
| 1 cenário de caminho feliz | `tests/compraCaminhoFeliz.spec.ts` |
| 1 fluxo de pesquisa com validação | `tests/pesquisaProdutos.spec.ts` |
| 2 cenários negativos | `tests/cenariosNegativos.spec.ts` (4 cenários) |
| Validação de mensagens e comportamentos | Em todos os cenários |
| Mínimo de 20 interações reais | **59 interações** no total (**25** só no caminho feliz) |

Os números de interações e validações não são estimativas: foram medidos na
execução, contabilizando os passos de UI (`Click`, `Fill`, `Navigate`) e as
asserções registradas pelo Playwright.

| Cenário | Interações | Validações |
| --- | ---: | ---: |
| Caminho feliz | 25 | 89 |
| Pesquisa por categoria | 8 | 32 |
| Pedido sem nome e cartão | 12 | 39 |
| Login com senha incorreta | 6 | 17 |
| Cadastro sem usuário e senha | 4 | 13 |
| Login de usuário inexistente | 4 | 13 |
| **Total** | **59** | **203** |

---

## Cenários

### 1. Caminho feliz — `compraCaminhoFeliz.spec.ts`

Jornada completa de compra: cadastro de usuário novo, login, pesquisa dos
produtos por categoria, inclusão de três itens no carrinho, remoção de um deles,
conferência do total e fechamento do pedido.

Interações reais (25): acesso à loja, abertura do modal de cadastro,
preenchimento de usuário e senha, confirmação, abertura do modal de login,
preenchimento das credenciais, confirmação, filtro por `Laptops`, abertura do
produto, inclusão no carrinho, retorno à home, filtro por `Monitors`, abertura
do segundo produto, inclusão no carrinho, retorno à home, filtro por `Phones`,
abertura do terceiro produto, inclusão no carrinho, acesso ao carrinho, remoção
de um item, abertura do formulário de pedido, preenchimento de seis campos,
confirmação da compra, fechamento do popup e do formulário, reconferência do
carrinho e logout.

Validações: mensagem `Sign up successful.`, `Welcome <usuário>` no menu,
nome/preço/descrição na página de cada produto, mensagem `Product added`, itens
e total do carrinho, **recálculo do total após remover um item**, popup
`Thank you for your purchase!` com id, valor, cartão e nome do comprador,
esvaziamento do carrinho após a compra e encerramento da sessão.

### 2. Fluxo de pesquisa — `pesquisaProdutos.spec.ts`

A loja não possui campo de busca textual: a pesquisa é feita pelo filtro de
categorias da barra lateral, que consulta a API `/bycat` e reconstrói a vitrine.

Validações: quantidade de resultados por categoria (7 celulares, 6 notebooks,
2 monitores), presença do produto esperado, **ausência** de produtos de outras
categorias, conteúdo exato do resultado de `Monitors`, detalhes do produto
aberto a partir da pesquisa e comportamento da paginação (9 → 6 → 9 itens).

A action aguarda a resposta HTTP da API antes de validar, evitando leitura da
vitrine anterior.

### 3. Cenários negativos — `cenariosNegativos.spec.ts`

| Cenário | Mensagem esperada |
| --- | --- |
| Cadastro sem usuário e senha | `Please fill out Username and Password.` |
| Login de usuário inexistente | `User does not exist.` |
| Login com senha incorreta | `Wrong password.` |
| Pedido sem nome e sem cartão | `Please fill out Name and Creditcard.` |

Além da mensagem, cada cenário valida o comportamento esperado: o modal
permanece aberto, nenhuma sessão é criada, a compra não é concluída e o
carrinho é preservado.

---

## Notas técnicas

**Mensagens via `alert()` nativo.** O demoblaze comunica cadastro, login,
inclusão no carrinho e validação do pedido por `alert()` do navegador. O
Playwright descarta esses diálogos automaticamente e a mensagem se perderia,
por isso o helper `utils/dialogs.ts` registra um ouvinte antes da ação, guarda
o texto e só então confirma o alerta — permitindo validar o conteúdo exibido.

**Confirmação da compra.** A confirmação final não é um `alert()` nativo, e sim
um popup SweetAlert renderizado na página, localizado por `.sweet-alert`.
Dois comportamentos reais do site foram observados na execução e estão refletidos
nas validações: ao confirmar o popup a loja **não** redireciona para a home, e o
formulário de pedido continua aberto atrás dele — por isso o cenário fecha os
dois explicitamente.

**Carrinho compartilhado entre visitantes.** A loja identifica o carrinho de quem
não está autenticado pelo cookie do navegador; sem cookie, todos os visitantes
anônimos compartilham o mesmo carrinho público. Na prática isso significa que um
carrinho sem login pode conter itens de outras pessoas e nunca terá total
previsível. Por isso todo cenário que valida itens ou total faz login antes — é o
que garante um carrinho isolado e determinístico.

**Usuário único por execução.** O site persiste os cadastros. `gerarCredenciais()`
cria um usuário novo a cada execução para evitar falha por
`This user already exist.`.

**Esperas determinísticas.** Em vez de pausas fixas, as actions aguardam a
resposta HTTP das APIs do site (`/bycat`, `/pagination`, `/viewcart`) antes de
validar a tela, evitando tanto lentidão artificial quanto leitura de conteúdo
desatualizado.

**Dois botões "Close" por modal.** Cada modal tem o "×" do cabeçalho e o botão do
rodapé, ambos com nome acessível `Close`. Os locators apontam para o do rodapé
(`.modal-footer button.btn-secondary`) para não cair em ambiguidade.

**Ambiente público.** Por ser um site de demonstração compartilhado, os tempos
limite são mais altos que o padrão e há uma retentativa configurada, evitando
falso negativo por lentidão do ambiente. Pelo mesmo motivo, a abertura da loja
recarrega a página caso a vitrine venha vazia: a API `/entries` eventualmente não
responde, e recarregar é mais honesto do que falhar um cenário por indisponibilidade
do site.
