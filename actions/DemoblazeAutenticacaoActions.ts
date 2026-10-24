import { Page, expect } from '@playwright/test'
import { DemoblazeAutenticacaoLocators } from '../locators/DemoblazeAutenticacaoLocators'
import { DemoblazeHomeLocators } from '../locators/DemoblazeHomeLocators'
import { Credenciais } from '../utils/dados'
import { capturarAlerta } from '../utils/dialogs'

export class DemoblazeAutenticacaoActions {
    private locators: DemoblazeAutenticacaoLocators
    private home: DemoblazeHomeLocators
    private page: Page

    constructor(page: Page) {
        this.page = page
        this.locators = new DemoblazeAutenticacaoLocators(page)
        this.home = new DemoblazeHomeLocators(page)
    }

    async abrirModalDeCadastro() {
        await this.home.linkCadastrar.click()
        await expect(this.locators.modalCadastro).toBeVisible()
        await expect(this.locators.tituloModalCadastro).toHaveText('Sign up')
    }

    async informarDadosDeCadastro(credenciais: Credenciais) {
        await this.locators.campoUsuarioCadastro.fill(credenciais.usuario)
        await this.locators.campoSenhaCadastro.fill(credenciais.senha)
        await expect(this.locators.campoUsuarioCadastro).toHaveValue(credenciais.usuario)
    }

    async confirmarCadastro(): Promise<string> {
        return await capturarAlerta(this.page, async () => {
            await this.locators.botaoConfirmarCadastro.click()
        })
    }

    async cadastrarUsuario(credenciais: Credenciais): Promise<string> {
        await this.abrirModalDeCadastro()
        await this.informarDadosDeCadastro(credenciais)
        return await this.confirmarCadastro()
    }

    async validarModalDeCadastroAberto() {
        await expect(this.locators.modalCadastro).toBeVisible()
        await expect(this.locators.campoUsuarioCadastro).toBeVisible()
    }

    async fecharModalDeCadastro() {
        await this.locators.botaoFecharCadastro.click()
        await expect(this.locators.modalCadastro).toBeHidden()
    }

    async abrirModalDeLogin() {
        await this.home.linkEntrar.click()
        await expect(this.locators.modalLogin).toBeVisible()
        await expect(this.locators.tituloModalLogin).toHaveText('Log in')
    }

    async informarCredenciais(credenciais: Credenciais) {
        await this.locators.campoUsuarioLogin.fill(credenciais.usuario)
        await this.locators.campoSenhaLogin.fill(credenciais.senha)
        await expect(this.locators.campoUsuarioLogin).toHaveValue(credenciais.usuario)
    }

    async fazerLogin(credenciais: Credenciais) {
        await this.abrirModalDeLogin()
        await this.informarCredenciais(credenciais)
        await this.locators.botaoConfirmarLogin.click()
        await expect(this.locators.modalLogin).toBeHidden({ timeout: 60_000 })
    }

    async tentarLogin(credenciais: Credenciais): Promise<string> {
        await this.abrirModalDeLogin()
        await this.informarCredenciais(credenciais)

        return await capturarAlerta(this.page, async () => {
            await this.locators.botaoConfirmarLogin.click()
        })
    }

    async validarModalDeLoginAberto() {
        await expect(this.locators.modalLogin).toBeVisible()
        await expect(this.locators.campoUsuarioLogin).toBeVisible()
    }

    async fecharModalDeLogin() {
        await this.locators.botaoFecharLogin.click()
        await expect(this.locators.modalLogin).toBeHidden()
    }

    async sair() {
        await this.home.linkSair.click()
        await expect(this.page).toHaveURL(/index\.html/)
    }
}
