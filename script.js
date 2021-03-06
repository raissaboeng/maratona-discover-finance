/*dark mode -------------- */
const checkbox = document.getElementById('checkbox')
checkbox.addEventListener('change', () => {
    //change the theme of the website
    document.querySelector(':root').classList.toggle('dark')
})

const Modal = {
    toggle() {
        //retirar o status ativo do alert para campos vazios caso tenha antes de abrir ou de fechar o modal
        document.querySelector('.alert').classList.remove('active')
        //limpar os campos caso não tenha enviado o formulario e apenas cancelando fechando o modal
        Form.clearFields()
        //adicionar ou remover a class active do modal
        document.querySelector('.modal-overlay').classList.toggle('active')
    }
}

const ModalLoading = {
    init(){
        setTimeout (function () {document.querySelector('.modal-loading').classList.remove('active')}, 5000)
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }

}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index,1)
        App.reload()
    },
 
    incomes() {
        let income = 0;
        //pegar todas as transações
        //para cada transação
        Transaction.all.forEach(transaction => {
            //se ela for maior que zero
            if(transaction.amount > 0){
                //somar a uma variável e retorná-la
                income += transaction.amount
            }
        })
        return income
    },

    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0){
                expense += transaction.amount
            }
        })
        return expense
    },

    total() {
        return  Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${CSSclass}>${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `

        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const  Utils = {
    formatAmount(value){
        //o input type number já retorna um number, desa forma apenas 
        //precisamos transformar pra ficar sem pontos e virgulas
        //porém ao usar centavos pode ficar um número muito grande
        //então usar o math.random pra arrendondar
        value = value * 100
        return Math.round(value)
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        //Definir o sinal do valor, se negativo ou positivo
        const signal = Number(value) < 0 ? "-" : ""
        //Alterar o value para ficar apenas com os números usando expressão regular
        value = String(value).replace(/\D/g, "")
        //Transformar o número em double para pegar as casas decimais
        value = Number(value) / 100
        //Usar a função toLocaleString para formatar em Real 
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        //retornar o sinal concatenando com o valor formatado
        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        const {description, amount, date} = Form.getValues()
        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues(){
        let {description, amount, date} = Form.getValues()

        amount= Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try{
            //verificar se todas as informações foram preenchidas
            Form.validateFields()
            //formatar od dados para salvar
            const newTransaction = Form.formatValues()
            //salvar
            Transaction.add(newTransaction)
            //apagar os dados do formulario
            Form.clearFields()
            //fechar o modal
            Modal.toggle()
        }catch(error){
            document.querySelector('.alert').classList.add('active')
        }
    }
}


const App = {
    init() {
        //inicia a tela de carregamento
        ModalLoading.init()
        //verifica se possui transações para exibir, se não houver, exibe icone de vazio
        Transaction.all.length == 0 ? document.querySelector('.empty').classList.add('active') : document.querySelector('.empty').classList.remove('active')
        //Passa por todo array de transações para adicionar na tela
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        //a cada adição de transação, refaz a conta do balanço total
        DOM.updateBalance()
        //guarda todas as transações no localStorage
        Storage.set(Transaction.all)
    },
    reload() {
        //Limpa o array de transações
        DOM.clearTransactions()
        //Refaz todo o processamento**pode ser melhorado
        App.init()
    }
}

App.init()
