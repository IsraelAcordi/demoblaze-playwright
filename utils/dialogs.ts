import { Page } from '@playwright/test'

export async function capturarAlerta(page: Page, acao: () => Promise<void>): Promise<string> {
    const alertaRecebido = new Promise<string>((resolve) => {
        page.once('dialog', async (dialog) => {
            const mensagem = dialog.message()
            await dialog.accept()
            resolve(mensagem)
        })
    })

    await acao()

    return await alertaRecebido
}
