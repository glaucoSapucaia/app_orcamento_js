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

    // recuperando registros do local storage
    recuperaRegistros() {
        // lista de despesas
        let despesas = []

        let id = localStorage.getItem('id')

        // iterando sobre itens
        for (let i = 1; i <= id; i++) {

            // coerção de JSON para objeto
            let despesa = JSON.parse(localStorage.getItem(i))

            // tratando indices nulos
            if (despesa === null) {
                continue
            }

            // associando key para exclusão
            despesa.id = i

            // adicionando despesa a lista
            despesas.push(despesa)
        }

        return despesas
    }

    // pesquisando despesas
    pesuisar(despesa) {
        let despesasFiltradas = []
        // recuperando todas as despesas
        despesasFiltradas = this.recuperaRegistros()

        // ignorando campos vazios para os filtros
        if (despesa.ano != '') {
            // filtando atributos
            // é necessário atribuir o novo valor com o filtro a variavel,
            // para garantir a sobreposição de valores filtrados
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
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

        // limpando campos
        dia.value = ''
        mes.value = ''
        ano.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

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

// Recuperando despesas para exibição
function carregaLista(despesas = Array(), filtro = false) {
    // verificando se há lista
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperaRegistros()
    }

    // selecionando tbody da tabela
    let listaDespesas = document.getElementById('lista_despesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d) {
        // criando as linhas (tr)
        let linha = listaDespesas.insertRow()

        // criando colunas e inserindo valores
        linha.insertCell(0).innerHTML = `${d.dia}/ ${d.mes}/${d.ano}`

        // selecionando tipo de despesa
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        // btn de exclusão
        let btn = document.createElement('button')

        // btn style
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<ion-icon name="close-outline"></ion-icon>'

        // associando id
        btn.id = `id_despesa_${d.id}`

        // ação do btn
        btn.onclick = function() {
            // refatorando str do id
            let id = this.id.replace('id_despesa_', '')
            
            // removendo id com metodo do objeto bd
            bd.remover(id)
            alert('Despesa removida!')

            // atualizando pagina após remoção de despesa
            window.location.reload()
        }

        // inserção do btn por linha
        linha.insertCell(4).append(btn)
    })
}

// pesquisando e filtrano despesas
function pesquisaDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    // criando array de listas filtradas
    let despesas = bd.pesuisar(despesa)

    // carregando lista filtrada
    carregaLista(despesas, true)
}

