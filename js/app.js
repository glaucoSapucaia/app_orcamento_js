// despesa object
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    // validando dados
    validaDados() {
        for (let i in this) {
            if (
                this[i] == undefined || this[i] == '' || this[i] == null
            ) {
                return false
            }
        }
        return true
    }
}

// classe para comunicação com Local Storage
class Bd {
    constructor() {
        // lógica - primary KEY
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        // localStorage.getItem()
        // Busca elementos do banco de dados
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    // Local storage function
    salvar(d) {
    // chamando local storage
    // JSON.stringify()
    // Converte dados de um objeto para o formato JSON
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
}

// instanciando classe Bd
let bd = new Bd()

// index | Lançamento
function cadastrarDespesa() {
    // recuperando valores
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    // instanciando classe
    let despesa = new Despesa(
        ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value
    )

    // validando dados
    if (despesa.validaDados()) {
        // Mantendo dados no local storage
        bd.salvar(despesa)

        // alteração dinâmica do modal
        document.getElementById('modal_div').className = "modal-header text-success"
        document.getElementById('modal_btn').className = 'btn btn-success'
        document.getElementById('modal_titulo').innerHTML = 'Registro Efetuado!'
        document.getElementById('modal_texto').innerHTML = "A despesa foi cadastrada."

        // config e exibe modal
        let modal = new bootstrap.Modal(document.getElementById('modalRegistraDespesa'))
        modal.show()
    } else {
        // jquery | Modal components
        // Selecionamos a div modal, e a exibimos com 'show'

        // alteração dinâmica do modal
        document.getElementById('modal_div').className = "modal-header text-danger"
        document.getElementById('modal_btn').className = 'btn btn-danger'
        document.getElementById('modal_titulo').innerHTML = 'Erro ao Registrar!!'
        document.getElementById('modal_texto').innerHTML = "Você deixou campos vazios."

        // config e exibe modal
        let modal = new bootstrap.Modal(document.getElementById('modalRegistraDespesa'))
        modal.show()
    }

}
