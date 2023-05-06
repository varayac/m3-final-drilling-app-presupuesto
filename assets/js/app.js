document.addEventListener('DOMContentLoaded', () => {})

// DELEGACION DE EVENTOS INPUTS (se manipulan dentro de main mediante target)
main.addEventListener('input', (e) => {
    console.log(e.target)
    if (e.target.id === 'inputBudget') inputBudget()
    if (e.target.id === 'inputExpense') inputExpense()
    if (e.target.id === 'inputExpenseName') inputExpenseName()
})

// DELEGACION DE EVENTOS CLICK (se manipulan dentro de main mediante target)
main.addEventListener('click', (e) => {
    if (e.target.id === 'btnAddExpense') paintExpense()
    if (e.target.id === 'btnBudget') paintBudget()
})

// VARIABLES GLOBALES
let totalExpenses = 0
let id = 0
const arrExpenses = []
// console.log(arrExpenses)

// FUNCION QUE GENERA OBJETO LITERAL GASTO Y RETORNA UNA COPIA
const expanseObj = (nameExpense, valueExpense) => {
    const ExpenseObj = {
        id: newId(),
        nameExpense: nameExpense.toLowerCase(),
        valueExpense: parseInt(valueExpense),
        date: newDate(),
    }
    const NewObj = JSON.parse(JSON.stringify(ExpenseObj))
    // const NewObj = { ...ExpenseObj }
    return NewObj
}

// GENERA Y RETORNA UN NUEVO ID
const newId = () => {
    id++
    return id
}

// CAPTURA LA FECHA DEL NAVEGADOR Y RETORNA FECHA FORMATEADA
const newDate = () => {
    const currentDate = new Date()
    const day = currentDate.getDate()
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()
    const hours = currentDate.getHours()
    const minutes = currentDate.getMinutes()
    // padStart es un metodo de strings que pregunta el largo de la cadena(2) y si no se cumple agrega un caracter al lado izquierdo(0)
    const formatedDate = `
        ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year.toString()} 
        ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}
    `
    return formatedDate
}

// INPUT PRESUPUESTO, VALIDA Y RETORNA UN OBJETO
const inputBudget = () => {
    const input = document.getElementById('inputBudget')
    const btn = document.getElementById('btnBudget')
    const errorAlerts = document.querySelectorAll('.error-alerts')
    const regExp = /^[1-9]\d{0,8}$/
    let inputValue = null
    let isValid = false

    if (!regExp.test(input.value)) {
        input.classList.add('is-invalid')
        errorAlerts[0].classList.remove('invalid-feedback')
        btn.classList.add('disabled')
        isValid = false
    } else {
        input.classList.remove('is-invalid')
        btn.classList.remove('disabled')
        errorAlerts[0].classList.add('invalid-feedback')
        inputValue = parseInt(input.value.replace(/\D/g, ''))
        isValid = true
    }

    return { inputValue, isValid, input, btn }
}

// INPUT NOMBRE GASTO, VALIDA Y RETORNA UN OBJETO
const inputExpenseName = () => {
    const inputNormalExpenseName = document.getElementById('inputExpenseName')
    const btnExpenseName = document.getElementById('btnAddExpense')
    const errorAlerts = document.querySelectorAll('.error-alerts')
    const regExp = /^[A-Za-zÑÁÉÍÓÚñáéíóú ]{0,20}$/
    let inputValueExpenseName = 0
    let isValidExpenseName = false

    if (!regExp.test(inputNormalExpenseName.value)) {
        inputNormalExpenseName.classList.add('is-invalid')
        errorAlerts[1].classList.remove('invalid-feedback')
        btnExpenseName.classList.add('disabled')
        isValidExpenseName = false
    } else {
        inputNormalExpenseName.classList.remove('is-invalid')
        btnExpenseName.classList.remove('disabled')
        errorAlerts[1].classList.add('invalid-feedback')
        inputValueExpenseName = inputNormalExpenseName.value.toLowerCase()
        isValidExpenseName = true
    }

    // console.log(inputValueExpenseName)

    return {
        inputValueExpenseName,
        isValidExpenseName,
        inputNormalExpenseName,
        btnExpenseName,
    }
}

// INPUT VALOR GASTO, VALIDA Y RETORNA UN OBJETO
const inputExpense = () => {
    const inputNormalExpense = document.getElementById('inputExpense')
    const btnExpense = document.getElementById('btnAddExpense')
    const errorAlerts = document.querySelectorAll('.error-alerts')
    const regExp = /^[1-9]\d{0,8}$/
    let inputValueExpense = null
    let isValidExpense = false

    if (!regExp.test(inputNormalExpense.value)) {
        inputNormalExpense.classList.add('is-invalid')
        errorAlerts[2].classList.remove('invalid-feedback')
        btnExpense.classList.add('disabled')
        isValidExpense = false
    } else {
        inputNormalExpense.classList.remove('is-invalid')
        btnExpense.classList.remove('disabled')
        errorAlerts[2].classList.add('invalid-feedback')
        inputValueExpense = parseInt(inputNormalExpense.value.replace(/\D/g, ''))
        isValidExpense = true
    }

    return { inputValueExpense, isValidExpense, inputNormalExpense, btnExpense }
}

// FUNCION QUE PINTA EL CUADRO PRESUPUESTO
const paintBudget = () => {
    const resumeBudget = document.getElementById('totalBudget')
    // const btn = document.getElementById('btnBudget')
    const { inputValue, isValid, input, btn } = inputBudget()

    if (isValid) {
        const newInputValue = inputValue.toLocaleString()
        resumeBudget.innerHTML = `<span>$</span>${newInputValue}`
    } else {
        resumeBudget.innerHTML = `<span>$</span>0`
    }
    input.value = ''
    btn.classList.add('disabled')
}

// FUNCION QUE PINTA EL PARRAFO TOTAL GASTO
const paintExpense = () => {
    const totalExpense = document.getElementById('totalExpenses')
    const { inputValueExpense, isValidExpense, inputNormalExpense } = inputExpense()
    const { inputValueExpenseName, isValidExpenseName, inputNormalExpenseName } = inputExpenseName()
    const Expense = expanseObj(inputValueExpenseName, inputValueExpense)
    // console.log(Expense)

    totalExpenses += Expense.valueExpense // Suma y acumula
    const newTotalExpenses = totalExpenses.toLocaleString()

    arrExpenses.push(Expense) // pushea a array global

    if (isValidExpense && isValidExpenseName) {
        totalExpense.innerHTML = `<span>$</span>${newTotalExpenses}`
        paintTable(Expense)
    }

    inputNormalExpenseName.value = ''
    inputNormalExpense.value = ''
}

// FUNCION QUE PINTA EL PARRAFO DEL RESTANTE
const paintRemaining = () => {
    //..Continuar
}

// FUNCION QUE PINTA LAS FILAS DE LA TABLA
const paintTable = (Expense) => {
    const tbody = document.getElementById('tbody')
    const upperFirstLetter = `${Expense.nameExpense[0].toUpperCase()}` // Coloca en mayusculas el primer caracter del string
    const deleteOldFirstLetter = `${Expense.nameExpense.slice(1, Expense.nameExpense.length)}` // Este metodo elimina el primer caracter de un string
    const newExpenseNameExpense = `${upperFirstLetter}${deleteOldFirstLetter}`

    tbody.innerHTML += `
            <tr id="row-${Expense.id}">
                <td>${newExpenseNameExpense}</td>
                <td>$${Expense.valueExpense.toLocaleString()}</td>
                <td>${Expense.date}</td>
                <td><a href="#" onclick="deleteExpenseRow(${Expense.id}) "><i class="bi bi-x-lg"></i></a></td>
            </tr>`
}

// FUNCION QUE ELIMINA UNA FILA DE LA TABLA
const deleteExpenseRow = (id) => {
    arrExpenses.filter((expense) => {
        if (expense.id === id) {
            // console.log('Soy el ID: ' + id)
            const deleteRow = document.getElementById(`row-${expense.id}`)
            deleteRow.remove()
            return false
        }
        return true
    })
}
