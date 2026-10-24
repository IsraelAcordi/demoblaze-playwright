import { Locator, Page } from '@playwright/test'

export class DemoblazeProdutoLocators {
  readonly nomeProduto: Locator
  readonly precoProduto: Locator
  readonly tituloDescricao: Locator
  readonly textoDescricao: Locator
  readonly imagemProduto: Locator
  readonly botaoAdicionarAoCarrinho: Locator

  constructor(page: Page) {
    this.nomeProduto = page.locator('h2.name')
    this.precoProduto = page.locator('h3.price-container')
    this.tituloDescricao = page.getByText('Product description')
    this.textoDescricao = page.locator('#more-information p')
    this.imagemProduto = page.locator('#imgp img')
    this.botaoAdicionarAoCarrinho = page.getByRole('link', { name: 'Add to cart' })
  }
}
