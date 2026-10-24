import { Page, expect } from '@playwright/test'
import { DemoblazeHomeLocators } from '../locators/DemoblazeHomeLocators'

export class DemoblazeNavegacaoActions {
    private locators: DemoblazeHomeLocators
    private page: Page

    constructor(page: Page) {
        this.page = page
        this.locators = new DemoblazeHomeLocators(page)
    }

    async goto(url: string) {
        await this.page.goto(url)
    }

    async abrirLoja(url: string) {
        await this.page.goto(url)
        await expect(this.locators.logoLoja).toBeVisible({ timeout: 60_000 })
        await expect(this.locators.tituloCategorias).toHaveText('CATEGORIES')
        await this.aguardarVitrine()
    }

    private async aguardarVitrine(tentativas = 3) {
        for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
            const vitrineCarregou = await this.locators.cardsDeProduto
                .first()
                .waitFor({ state: 'visible', timeout: 20_000 })
                .then(() => true)
                .catch(() => false)

            if (vitrineCarregou) return

            if (tentativa < tentativas) {
                await this.page.reload()
            }
        }

        await expect(this.locators.cardsDeProduto.first()).toBeVisible({ timeout: 20_000 })
    }

    async validarQuantidadeNaVitrine(quantidadeEsperada: number) {
        await expect(this.locators.cardsDeProduto).toHaveCount(quantidadeEsperada)
    }

    async irParaProximaPagina() {
        await this.aguardarPaginacao(async () => {
            await this.locators.botaoProximaPagina.click()
        })
    }

    async irParaPaginaAnterior() {
        await this.aguardarPaginacao(async () => {
            await this.locators.botaoPaginaAnterior.click()
        })
    }

    private async aguardarPaginacao(acao: () => Promise<void>) {
        const resposta = this.page.waitForResponse(
            (retorno) => retorno.url().includes('/pagination') && retorno.status() === 200
        )

        await acao()
        await resposta
        await expect(this.locators.cardsDeProduto.first()).toBeVisible({ timeout: 60_000 })
    }

    async irParaCarrinho() {
        const conteudoDoCarrinho = this.page.waitForResponse(
            (retorno) => retorno.url().includes('/viewcart') && retorno.status() === 200
        )

        await this.locators.linkCarrinho.click()
        await expect(this.page).toHaveURL(/cart\.html/)
        await conteudoDoCarrinho
    }

    async voltarParaHome() {
        await this.locators.logoLoja.click()
        await expect(this.page).toHaveURL(/index\.html/)
        await this.aguardarVitrine()
    }

    async validarUsuarioLogado(usuario: string) {
        await expect(this.locators.usuarioLogado).toBeVisible({ timeout: 60_000 })
        await expect(this.locators.usuarioLogado).toHaveText(`Welcome ${usuario}`)
        await expect(this.locators.linkSair).toBeVisible()
        await expect(this.locators.linkCadastrar).toBeHidden()
        await expect(this.locators.linkEntrar).toBeHidden()
    }

    async validarUsuarioDeslogado() {
        await expect(this.locators.linkEntrar).toBeVisible()
        await expect(this.locators.linkCadastrar).toBeVisible()
        await expect(this.locators.usuarioLogado).toBeHidden()
    }
}
