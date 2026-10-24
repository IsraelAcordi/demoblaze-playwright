import { test, expect } from '../fixtures/DemoblazeFixtures'
import { URLS } from '../utils/urls'
import {
    MENSAGENS,
    PEDIDO_SEM_DADOS_OBRIGATORIOS,
    PRODUTOS,
    gerarCredenciais
} from '../utils/dados'

test.describe('Demoblaze - Cenarios negativos', () => {
    test('Nao permitir cadastro sem informar usuario e senha', async ({
        navegacao,
        autenticacao
    }) => {
        await navegacao.abrirLoja(URLS.demoblaze)

        await autenticacao.abrirModalDeCadastro()
        await autenticacao.informarDadosDeCadastro({ usuario: '', senha: '' })

        const mensagem = await autenticacao.confirmarCadastro()
        expect(mensagem).toBe(MENSAGENS.camposObrigatorios)

        await autenticacao.validarModalDeCadastroAberto()
        await autenticacao.fecharModalDeCadastro()
        await navegacao.validarUsuarioDeslogado()
    })

    test('Nao permitir login de usuario inexistente', async ({
        navegacao,
        autenticacao
    }) => {
        await navegacao.abrirLoja(URLS.demoblaze)

        const mensagem = await autenticacao.tentarLogin({
            usuario: `usuario_inexistente_${Date.now()}`,
            senha: 'SenhaQualquer123'
        })
        expect(mensagem).toBe(MENSAGENS.usuarioInexistente)

        await autenticacao.validarModalDeLoginAberto()
        await autenticacao.fecharModalDeLogin()
        await navegacao.validarUsuarioDeslogado()
    })

    test('Nao permitir login com senha incorreta', async ({
        navegacao,
        autenticacao
    }) => {
        const credenciais = gerarCredenciais()

        await navegacao.abrirLoja(URLS.demoblaze)

        const mensagemDeCadastro = await autenticacao.cadastrarUsuario(credenciais)
        expect(mensagemDeCadastro).toBe(MENSAGENS.cadastroRealizado)

        const mensagem = await autenticacao.tentarLogin({
            usuario: credenciais.usuario,
            senha: 'SenhaTotalmenteErrada123'
        })
        expect(mensagem).toBe(MENSAGENS.senhaIncorreta)

        await autenticacao.validarModalDeLoginAberto()
        await autenticacao.fecharModalDeLogin()
        await navegacao.validarUsuarioDeslogado()
    })

    test('Nao permitir fechar pedido sem nome e sem cartao de credito', async ({
        navegacao,
        autenticacao,
        pesquisa,
        produto,
        carrinho
    }) => {
        const credenciais = gerarCredenciais()

        await navegacao.abrirLoja(URLS.demoblaze)

        const mensagemDeCadastro = await autenticacao.cadastrarUsuario(credenciais)
        expect(mensagemDeCadastro).toBe(MENSAGENS.cadastroRealizado)

        await autenticacao.fazerLogin(credenciais)
        await navegacao.validarUsuarioLogado(credenciais.usuario)

        await pesquisa.filtrarPorCategoria('Phones')
        await pesquisa.abrirProduto(PRODUTOS.celular.titulo)
        await produto.validarDetalhesDoProduto(PRODUTOS.celular)

        const alertaDoProduto = await produto.adicionarAoCarrinho()
        expect(alertaDoProduto).toContain(MENSAGENS.produtoAdicionado)

        await navegacao.irParaCarrinho()
        await carrinho.validarProdutosNoCarrinho([PRODUTOS.celular.titulo])
        await carrinho.validarTotal(PRODUTOS.celular.preco)

        await carrinho.abrirFormularioDePedido()
        await carrinho.informarDadosDoPedido(PEDIDO_SEM_DADOS_OBRIGATORIOS)

        const mensagem = await carrinho.tentarConcluirCompra()
        expect(mensagem).toBe(MENSAGENS.dadosDoPedidoObrigatorios)

        await carrinho.validarConfirmacaoNaoExibida()
        await carrinho.validarFormularioDePedidoAberto()
        await carrinho.fecharFormularioDePedido()
        await carrinho.validarProdutosNoCarrinho([PRODUTOS.celular.titulo])
    })
})
