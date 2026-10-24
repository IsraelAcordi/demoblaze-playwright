import { test } from '../fixtures/DemoblazeFixtures'
import { URLS } from '../utils/urls'
import { CATALOGO, MONITORES_ESPERADOS, PRODUTOS } from '../utils/dados'

test.describe('Demoblaze - Pesquisa de produtos', () => {
    test('Pesquisar produtos por categoria e validar os resultados retornados', async ({
        navegacao,
        pesquisa,
        produto
    }) => {
        await navegacao.abrirLoja(URLS.demoblaze)
        await navegacao.validarQuantidadeNaVitrine(CATALOGO.produtosNaPrimeiraPagina)

        await pesquisa.filtrarPorCategoria('Phones')
        await pesquisa.validarQuantidadeDeResultados(CATALOGO.celulares)
        await pesquisa.validarProdutoListado(PRODUTOS.celular.titulo)
        await pesquisa.validarProdutoNaoListado(PRODUTOS.monitor.titulo)
        await pesquisa.validarProdutoNaoListado(PRODUTOS.notebook.titulo)

        await pesquisa.filtrarPorCategoria('Laptops')
        await pesquisa.validarQuantidadeDeResultados(CATALOGO.notebooks)
        await pesquisa.validarProdutoListado(PRODUTOS.notebook.titulo)
        await pesquisa.validarProdutoNaoListado(PRODUTOS.celular.titulo)

        await pesquisa.filtrarPorCategoria('Monitors')
        await pesquisa.validarQuantidadeDeResultados(CATALOGO.monitores)
        await pesquisa.validarResultadoDaPesquisa(MONITORES_ESPERADOS)

        await pesquisa.abrirProduto(PRODUTOS.monitor.titulo)
        await produto.validarDetalhesDoProduto(PRODUTOS.monitor)
        await produto.validarDescricaoVisivel()

        await navegacao.voltarParaHome()
        await navegacao.validarQuantidadeNaVitrine(CATALOGO.produtosNaPrimeiraPagina)
        await navegacao.irParaProximaPagina()
        await navegacao.validarQuantidadeNaVitrine(CATALOGO.produtosNaSegundaPagina)
        await navegacao.irParaPaginaAnterior()
        await navegacao.validarQuantidadeNaVitrine(CATALOGO.produtosNaPrimeiraPagina)
    })
})
