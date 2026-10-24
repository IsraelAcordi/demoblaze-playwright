import { Locator, Page } from '@playwright/test'

export class DemoblazeCarrinhoLocators {
  private readonly page: Page

  readonly tituloProdutos: Locator
  readonly linhasDoCarrinho: Locator
  readonly titulosDoCarrinho: Locator
  readonly totalDoCarrinho: Locator
  readonly botaoRealizarPedido: Locator

  readonly modalPedido: Locator
  readonly tituloModalPedido: Locator
  readonly totalNoModal: Locator
  readonly campoNome: Locator
  readonly campoPais: Locator
  readonly campoCidade: Locator
  readonly campoCartao: Locator
  readonly campoMes: Locator
  readonly campoAno: Locator
  readonly botaoComprar: Locator
  readonly botaoFecharPedido: Locator

  readonly popupConfirmacao: Locator
  readonly tituloConfirmacao: Locator
  readonly detalhesConfirmacao: Locator
  readonly botaoOkConfirmacao: Locator

  constructor(page: Page) {
    this.page = page
    this.tituloProdutos = page.getByRole('heading', { name: 'Products' })
    this.linhasDoCarrinho = page.locator('#tbodyid tr.success')
    this.titulosDoCarrinho = page.locator('#tbodyid tr.success td:nth-child(2)')
    this.totalDoCarrinho = page.locator('#totalp')
    this.botaoRealizarPedido = page.getByRole('button', { name: 'Place Order' })

    this.modalPedido = page.locator('#orderModal')
    this.tituloModalPedido = page.locator('#orderModalLabel')
    this.totalNoModal = page.locator('#totalm')
    this.campoNome = page.locator('#name')
    this.campoPais = page.locator('#country')
    this.campoCidade = page.locator('#city')
    this.campoCartao = page.locator('#card')
    this.campoMes = page.locator('#month')
    this.campoAno = page.locator('#year')
    this.botaoComprar = this.modalPedido.getByRole('button', { name: 'Purchase' })
    this.botaoFecharPedido = this.modalPedido.locator('.modal-footer button.btn-secondary')

    this.popupConfirmacao = page.locator('.sweet-alert')
    this.tituloConfirmacao = page.locator('.sweet-alert h2')
    this.detalhesConfirmacao = page.locator('.sweet-alert > p')
    this.botaoOkConfirmacao = page.locator('.sweet-alert button.confirm')
  }

  linhaDoProduto(titulo: string): Locator {
    return this.page.locator('#tbodyid tr.success', { hasText: titulo })
  }

  botaoExcluirProduto(titulo: string): Locator {
    return this.linhaDoProduto(titulo).getByRole('link', { name: 'Delete' })
  }
}
