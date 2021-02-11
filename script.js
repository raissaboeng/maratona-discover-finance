const Modal = {
    open(){
        //Abrir modal
        //Adicionar a class active ao modal
        document.querySelector('.modal-overlay').classList.add('active');
    },
    close(){
        //fechar o Modal
        //remover a class active do modal
        document.querySelector('.modal-overlay').classList.remove('active');
    }
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021',
    },
    {
        id: 2,
        description: 'Website',
        amount: 500000,
        date: '23/01/2021',
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021',
    },

]

const Transaction = {
    incomes() {
        let income = 0;
        //pegar todas as transações
        //para cada transação
        transactions.forEach(transaction => {
            //se ela for maior que zero
            if(transaction.amount > 0){
                //somar a uma variável e retorná-la
                income += transaction.amount;
            }
        })
        return income;
    },
    expenses() {
        let expense = 0;
        transactions.forEach(transaction => {
            if(transaction.amount < 0){
                expense += transaction.amount;
            }
        })
        return expense;
    },
    total() {
        return  Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${CSSclass}>${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover Transação">
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
    }
}

const  Utils = {
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

transactions.forEach(function(transaction){
    DOM.addTransaction(transaction)
})

DOM.updateBalance()