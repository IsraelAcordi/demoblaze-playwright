import { test, expect } from '../fixtures/DemoblazeFixtures'
import { URLS } from '../utils/urls'
import {
    CATALOGO,
    DADOS_DO_PEDIDO,
    MENSAGENS,
    PRODUTOS,
    gerarCredenciais
} from '../utils/dados'

test.describe('Demoblaze - Caminho feliz', () => {
    test('Cadastrar usuario, autenticar, montar o carrinho e finalizar a compra', async ({
        navegacao,
        autenticacao,
        pesquisa,
        produto,
        carrinho
    }) => {
        const credenciais = gerarCredenciais()
        const totalEsperado = PRODUTOS.notebook.preco + PRODUTOS.monitor.preco
        const totalComItemExtra = totalEsperado + PRODUTOS.celular.preco

        await navegacao.abrirLoja(URLS.demoblaze)
        await navegacao.validarQuantidadeNaVitrine(CATALOGO.produtosNaPrimeiraPagina)
        await navegacao.validarUsuarioDeslogado()

        const mensagemDeCadastro = await autenticacao.cadastrarUsuario(credenciais)
        expect(mensagemDeCadastro).toBe(MENSAGENS.cadastroRealizado)

        await autenticacao.fazerLogin(credenciais)
        await navegacao.validarUsuarioLogado(credenciais.usuario)

        await pesquisa.filtrarPorCategoria('Laptops')
        await pesquisa.validarQuantidadeDeResultados(CATALOGO.notebooks)
        await pesquisa.abrirProduto(PRODUTOS.notebook.titulo)
        await produto.validarDetalhesDoProduto(PRODUTOS.notebook)

        const alertaDoNotebook = await produto.adicionarAoCarrinho()
        expect(alertaDoNotebook).toContain(MENSAGENS.produtoAdicionado)

        await navegacao.voltarParaHome()
        await pesquisa.filtrarPorCategoria('Monitors')
        await pesquisa.validarQuantidadeDeResultados(CATALOGO.monitores)
        await pesquisa.abrirProduto(PRODUTOS.monitor.titulo)
        await produto.validarDetalhesDoProduto(PRODUTOS.monitor)

        const alertaDoMonitor = await produto.adicionarAoCarrinho()
        expect(alertaDoMonitor).toContain(MENSAGENS.produtoAdicionado)

        await navegacao.voltarParaHome()
        await pesquisa.filtrarPorCategoria('Phones')
        await pesquisa.validarQuantidadeDeResultados(CATALOGO.celulares)
        await pesquisa.abrirProduto(PRODUTOS.celular.titulo)
        await produto.validarDetalhesDoProduto(PRODUTOS.celular)

        const alertaDoCelular = await produto.adicionarAoCarrinho()
        expect(alertaDoCelular).toContain(MENSAGENS.produtoAdicionado)

        await navegacao.irParaCarrinho()
        await carrinho.validarProdutosNoCarrinho([
            PRODUTOS.notebook.titulo,
            PRODUTOS.monitor.titulo,
            PRODUTOS.celular.titulo
        ])
        await carrinho.validarTotal(totalComItemExtra)

        await carrinho.removerProduto(PRODUTOS.celular.titulo)
        await carrinho.validarProdutosNoCarrinho([
            PRODUTOS.notebook.titulo,
            PRODUTOS.monitor.titulo
        ])
        await carrinho.validarTotal(totalEsperado)

        await carrinho.abrirFormularioDePedido()
        await carrinho.informarDadosDoPedido(DADOS_DO_PEDIDO)
        await carrinho.concluirCompra()
        await carrinho.validarCompraConcluida(DADOS_DO_PEDIDO, totalEsperado)
        await carrinho.fecharConfirmacao()
        await carrinho.fecharFormularioDePedido()

        await navegacao.voltarParaHome()
        await navegacao.irParaCarrinho()
        await carrinho.validarCarrinhoVazio()

        await navegacao.validarUsuarioLogado(credenciais.usuario)
        await autenticacao.sair()
        await navegacao.validarUsuarioDeslogado()
    })
})
