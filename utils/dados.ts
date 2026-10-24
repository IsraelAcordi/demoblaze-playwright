export type Credenciais = {
    usuario: string
    senha: string
}

export type DadosDoPedido = {
    nome: string
    pais: string
    cidade: string
    cartao: string
    mes: string
    ano: string
}

export function gerarCredenciais(): Credenciais {
    const sufixo = `${Date.now()}${Math.floor(Math.random() * 1000)}`

    return {
        usuario: `qa_demoblaze_${sufixo}`,
        senha: `Senha@${sufixo}`
    }
}

export const CATALOGO = {
    produtosNaPrimeiraPagina: 9,
    produtosNaSegundaPagina: 6,
    celulares: 7,
    notebooks: 6,
    monitores: 2
}

export const PRODUTOS = {
    celular: { titulo: 'Samsung galaxy s6', preco: 360 },
    notebook: { titulo: 'Sony vaio i5', preco: 790 },
    monitor: { titulo: 'Apple monitor 24', preco: 400 }
}

export const MONITORES_ESPERADOS = ['Apple monitor 24', 'ASUS Full HD']

export const DADOS_DO_PEDIDO: DadosDoPedido = {
    nome: 'Israel Acordi',
    pais: 'Brasil',
    cidade: 'Florianopolis',
    cartao: '4111111111111111',
    mes: '12',
    ano: '2030'
}

export const PEDIDO_SEM_DADOS_OBRIGATORIOS: DadosDoPedido = {
    nome: '',
    pais: 'Brasil',
    cidade: 'Florianopolis',
    cartao: '',
    mes: '12',
    ano: '2030'
}

export const MENSAGENS = {
    cadastroRealizado: 'Sign up successful.',
    usuarioJaExiste: 'This user already exist.',
    camposObrigatorios: 'Please fill out Username and Password.',
    usuarioInexistente: 'User does not exist.',
    senhaIncorreta: 'Wrong password.',
    produtoAdicionado: 'Product added',
    dadosDoPedidoObrigatorios: 'Please fill out Name and Creditcard.',
    compraConcluida: 'Thank you for your purchase!'
}
