import { Locator, Page } from '@playwright/test'

export class DemoblazeAutenticacaoLocators {
  readonly modalCadastro: Locator
  readonly tituloModalCadastro: Locator
  readonly campoUsuarioCadastro: Locator
  readonly campoSenhaCadastro: Locator
  readonly botaoConfirmarCadastro: Locator
  readonly botaoFecharCadastro: Locator

  readonly modalLogin: Locator
  readonly tituloModalLogin: Locator
  readonly campoUsuarioLogin: Locator
  readonly campoSenhaLogin: Locator
  readonly botaoConfirmarLogin: Locator
  readonly botaoFecharLogin: Locator

  constructor(page: Page) {
    this.modalCadastro = page.locator('#signInModal')
    this.tituloModalCadastro = page.locator('#signInModalLabel')
    this.campoUsuarioCadastro = page.locator('#sign-username')
    this.campoSenhaCadastro = page.locator('#sign-password')
    this.botaoConfirmarCadastro = this.modalCadastro.getByRole('button', { name: 'Sign up' })
    this.botaoFecharCadastro = this.modalCadastro.locator('.modal-footer button.btn-secondary')

    this.modalLogin = page.locator('#logInModal')
    this.tituloModalLogin = page.locator('#logInModalLabel')
    this.campoUsuarioLogin = page.locator('#loginusername')
    this.campoSenhaLogin = page.locator('#loginpassword')
    this.botaoConfirmarLogin = this.modalLogin.getByRole('button', { name: 'Log in' })
    this.botaoFecharLogin = this.modalLogin.locator('.modal-footer button.btn-secondary')
  }
}
