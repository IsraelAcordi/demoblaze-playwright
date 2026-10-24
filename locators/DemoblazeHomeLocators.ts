import { Locator, Page } from '@playwright/test'

export class DemoblazeHomeLocators {
  private readonly page: Page

  readonly logoLoja: Locator
  readonly linkHome: Locator
  readonly linkContato: Locator
  readonly linkSobreNos: Locator
  readonly linkCarrinho: Locator
  readonly linkEntrar: Locator
  readonly linkCadastrar: Locator
  readonly linkSair: Locator
  readonly usuarioLogado: Locator
  readonly tituloCategorias: Locator
  readonly categoriaCelulares: Locator
  readonly categoriaNotebooks: Locator
  readonly categoriaMonitores: Locator
  readonly vitrine: Locator
  readonly cardsDeProduto: Locator
  readonly titulosDeProduto: Locator
  readonly botaoProximaPagina: Locator
  readonly botaoPaginaAnterior: Locator

  constructor(page: Page) {
    this.page = page
    this.logoLoja = page.locator('#nava')
    this.linkHome = page.getByRole('link', { name: 'Home' })
    this.linkContato = page.getByRole('link', { name: 'Contact' })
    this.linkSobreNos = page.getByRole('link', { name: 'About us' })
    this.linkCarrinho = page.locator('#cartur')
    this.linkEntrar = page.locator('#login2')
    this.linkCadastrar = page.locator('#signin2')
    this.linkSair = page.locator('#logout2')
    this.usuarioLogado = page.locator('#nameofuser')
    this.tituloCategorias = page.locator('#cat')
    this.categoriaCelulares = page.getByRole('link', { name: 'Phones' })
    this.categoriaNotebooks = page.getByRole('link', { name: 'Laptops' })
    this.categoriaMonitores = page.getByRole('link', { name: 'Monitors' })
    this.vitrine = page.locator('#tbodyid')
    this.cardsDeProduto = page.locator('#tbodyid .card')
    this.titulosDeProduto = page.locator('#tbodyid .card .card-title a')
    this.botaoProximaPagina = page.locator('#next2')
    this.botaoPaginaAnterior = page.locator('#prev2')
  }

  produtoNaVitrine(titulo: string): Locator {
    return this.vitrine.getByRole('link', { name: titulo, exact: true })
  }

  categoria(nome: string): Locator {
    return this.page.getByRole('link', { name: nome, exact: true })
  }
}
