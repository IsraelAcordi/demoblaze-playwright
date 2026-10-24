import { Page, expect } from '@playwright/test'
import { DemoblazeHomeLocators } from '../locators/DemoblazeHomeLocators'

export class DemoblazePesquisaActions {
    private locators: DemoblazeHomeLocators
    private page: Page

    constructor(page: Page) {
        this.page = page
        this.locators = new DemoblazeHomeLocators(page)
    }

    async filtrarPorCategoria(categoria: string) {
        const respostaDaPesquisa = this.page.waitForResponse(
            (resposta) => resposta.url().includes('/bycat') && resposta.status() === 200
        )

        await this.locators.categoria(categoria).click()
        await respostaDaPesquisa
        await expect(this.locators.cardsDeProduto.first()).toBeVisible({ timeout: 60_000 })
    }

    async validarQuantidadeDeResultados(quantidadeEsperada: number) {
        await expect(this.locators.cardsDeProduto).toHaveCount(quantidadeEsperada)
    }

    async validarProdutoListado(titulo: string) {
        await expect(this.locators.produtoNaVitrine(titulo)).toBeVisible()
    }

    async validarProdutoNaoListado(titulo: string) {
        await expect(this.locators.produtoNaVitrine(titulo)).toHaveCount(0)
    }

    async validarResultadoDaPesquisa(titulosEsperados: string[]) {
        await expect(this.locators.titulosDeProduto).toHaveCount(titulosEsperados.length)
        await expect(this.locators.titulosDeProduto).toHaveText(titulosEsperados)
    }

    async abrirProduto(titulo: string) {
        await this.locators.produtoNaVitrine(titulo).click()
        await expect(this.page).toHaveURL(/prod\.html/)
    }
}
