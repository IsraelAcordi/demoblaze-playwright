import { Page, expect } from '@playwright/test'
import { DemoblazeCarrinhoLocators } from '../locators/DemoblazeCarrinhoLocators'
import { DadosDoPedido, MENSAGENS } from '../utils/dados'
import { capturarAlerta } from '../utils/dialogs'

export class DemoblazeCarrinhoActions {
    private locators: DemoblazeCarrinhoLocators
    private page: Page

    constructor(page: Page) {
        this.page = page
        this.locators = new DemoblazeCarrinhoLocators(page)
    }

    async validarProdutosNoCarrinho(titulos: string[]) {
        await expect(this.locators.tituloProdutos).toBeVisible()
        await expect(this.locators.linhasDoCarrinho).toHaveCount(titulos.length, { timeout: 60_000 })

        for (const titulo of titulos) {
            await expect(this.locators.linhaDoProduto(titulo)).toBeVisible()
        }
    }

    async validarCarrinhoVazio() {
        await expect(this.locators.tituloProdutos).toBeVisible()
        await expect(this.locators.linhasDoCarrinho).toHaveCount(0, { timeout: 60_000 })
        await expect(this.locators.totalDoCarrinho).toBeEmpty()
    }

    async validarTotal(totalEsperado: number) {
        await expect(this.locators.totalDoCarrinho).toHaveText(String(totalEsperado), { timeout: 60_000 })
    }

    async removerProduto(titulo: string) {
        const conteudoDoCarrinho = this.page.waitForResponse(
            (retorno) => retorno.url().includes('/viewcart') && retorno.status() === 200
        )

        await this.locators.botaoExcluirProduto(titulo).click()
        await conteudoDoCarrinho
        await expect(this.locators.linhaDoProduto(titulo)).toHaveCount(0, { timeout: 60_000 })
    }

    async abrirFormularioDePedido() {
        await this.locators.botaoRealizarPedido.click()
        await expect(this.locators.modalPedido).toBeVisible()
        await expect(this.locators.tituloModalPedido).toHaveText('Place order')
    }

    async informarDadosDoPedido(dados: DadosDoPedido) {
        await this.locators.campoNome.fill(dados.nome)
        await this.locators.campoPais.fill(dados.pais)
        await this.locators.campoCidade.fill(dados.cidade)
        await this.locators.campoCartao.fill(dados.cartao)
        await this.locators.campoMes.fill(dados.mes)
        await this.locators.campoAno.fill(dados.ano)
    }

    async concluirCompra() {
        await this.locators.botaoComprar.click()
    }

    async tentarConcluirCompra(): Promise<string> {
        return await capturarAlerta(this.page, async () => {
            await this.locators.botaoComprar.click()
        })
    }

    async validarCompraConcluida(dados: DadosDoPedido, totalEsperado: number) {
        await expect(this.locators.popupConfirmacao).toBeVisible({ timeout: 60_000 })
        await expect(this.locators.tituloConfirmacao).toHaveText(MENSAGENS.compraConcluida)
        await expect(this.locators.detalhesConfirmacao).toContainText('Id:')
        await expect(this.locators.detalhesConfirmacao).toContainText(`Amount: ${totalEsperado} USD`)
        await expect(this.locators.detalhesConfirmacao).toContainText(`Card Number: ${dados.cartao}`)
        await expect(this.locators.detalhesConfirmacao).toContainText(`Name: ${dados.nome}`)
    }

    async validarConfirmacaoNaoExibida() {
        await expect(this.locators.popupConfirmacao).toBeHidden()
    }

    async validarFormularioDePedidoAberto() {
        await expect(this.locators.modalPedido).toBeVisible()
        await expect(this.locators.botaoComprar).toBeVisible()
    }

    async fecharConfirmacao() {
        await this.locators.botaoOkConfirmacao.click()
        await expect(this.locators.popupConfirmacao).toBeHidden({ timeout: 60_000 })
    }

    async fecharFormularioDePedido() {
        await this.locators.botaoFecharPedido.click()
        await expect(this.locators.modalPedido).toBeHidden()
    }
}
