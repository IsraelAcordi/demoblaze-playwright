import { test as base } from '@playwright/test'
import { DemoblazeNavegacaoActions } from '../actions/DemoblazeNavegacaoActions'
import { DemoblazeAutenticacaoActions } from '../actions/DemoblazeAutenticacaoActions'
import { DemoblazePesquisaActions } from '../actions/DemoblazePesquisaActions'
import { DemoblazeProdutoActions } from '../actions/DemoblazeProdutoActions'
import { DemoblazeCarrinhoActions } from '../actions/DemoblazeCarrinhoActions'

type DemoblazeFixtures = {
    navegacao: DemoblazeNavegacaoActions
    autenticacao: DemoblazeAutenticacaoActions
    pesquisa: DemoblazePesquisaActions
    produto: DemoblazeProdutoActions
    carrinho: DemoblazeCarrinhoActions
}

export const test = base.extend<DemoblazeFixtures>({
    navegacao: async ({ page }, use) => {
        await use(new DemoblazeNavegacaoActions(page))
    },

    autenticacao: async ({ page }, use) => {
        await use(new DemoblazeAutenticacaoActions(page))
    },

    pesquisa: async ({ page }, use) => {
        await use(new DemoblazePesquisaActions(page))
    },

    produto: async ({ page }, use) => {
        await use(new DemoblazeProdutoActions(page))
    },

    carrinho: async ({ page }, use) => {
        await use(new DemoblazeCarrinhoActions(page))
    }
})

export { expect } from '@playwright/test'
