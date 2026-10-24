import { Page, expect } from '@playwright/test'
import { DemoblazeProdutoLocators } from '../locators/DemoblazeProdutoLocators'
import { capturarAlerta } from '../utils/dialogs'

type Produto = {
    titulo: string
    preco: number
}

export class DemoblazeProdutoActions {
    private locators: DemoblazeProdutoLocators
    private page: Page

    constructor(page: Page) {
        this.page = page
        this.locators = new DemoblazeProdutoLocators(page)
    }

    async validarDetalhesDoProduto(produto: Produto) {
        await expect(this.locators.nomeProduto).toHaveText(produto.titulo, { timeout: 60_000 })
        await expect(this.locators.precoProduto).toContainText(`$${produto.preco}`)
        await expect(this.locators.precoProduto).toContainText('*includes tax')
        await expect(this.locators.imagemProduto.first()).toBeVisible()
        await expect(this.locators.botaoAdicionarAoCarrinho).toBeVisible()
    }

    async validarDescricaoVisivel() {
        await expect(this.locators.tituloDescricao).toBeVisible()
        await expect(this.locators.textoDescricao).not.toBeEmpty()
    }

    async adicionarAoCarrinho(): Promise<string> {
        return await capturarAlerta(this.page, async () => {
            await this.locators.botaoAdicionarAoCarrinho.click()
        })
    }
}
