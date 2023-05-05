document.addEventListener('DOMContentLoaded', () => {
    validateInputs()
    printResumeBudget()
})

// VALIDADOR DE INPUTS
const validateInputs = () => {
    const inputBudget = document.getElementById('inputBudget')
    const inputName = document.getElementById('inputExpenseName')
    const inputExpense = document.getElementById('inputExpense')
    const btnBudget = document.getElementById('btnBudget')
    const btnExpense = document.getElementById('btnAddExpense')
    const errorMessages = document.querySelectorAll('.error-messages')
    const regExpNums = /^[1-9]\d{0,8}$/
    const regExpStrings = /^[A-Za-zÑÁÉÍÓÚñáéíóú ]{0,20}$/

    // Valida el input presupuesto
    inputBudget.addEventListener('input', () => {
        if (!regExpNums.test(inputBudget.value)) {
            inputBudget.classList.add('is-invalid')
            errorMessages[0].classList.remove('invalid-feedback')
            btnBudget.classList.add('disabled')
        } else {
            inputBudget.classList.remove('is-invalid')
            btnBudget.classList.remove('disabled')
            errorMessages[0].classList.add('invalid-feedback')
        }
    })

    // valida el input valor gasto
    inputExpense.addEventListener('input', () => {
        if (!regExpNums.test(inputExpense.value)) {
            inputExpense.classList.add('is-invalid')
            btnExpense.classList.add('disabled')
            errorMessages[2].classList.remove('invalid-feedback')
        } else {
            inputExpense.classList.remove('is-invalid')
            btnExpense.classList.remove('disabled')
            errorMessages[2].classList.add('invalid-feedback')
        }
    })

    // Valida el input nombre gasto
    inputName.addEventListener('input', () => {
        if (!regExpStrings.test(inputName.value)) {
            inputName.classList.add('is-invalid')
            btnExpense.classList.add('disabled')
            errorMessages[1].classList.remove('invalid-feedback')
        } else {
            inputName.classList.remove('is-invalid')
            btnExpense.classList.remove('disabled')
            errorMessages[1].classList.add('invalid-feedback')
        }
    })
}

// LIMPIADOR DE INPUTS
const clearInputs = () => {
    document.getElementById('inputBudget').value = ''
    document.getElementById('inputExpenseName').value = ''
    document.getElementById('inputExpense').value = ''
}

// PINTA EL PRESUPUESTO EN EL CUADRO RESUMEN
const printResumeBudget = () => {
    const inputBudget = document.getElementById('inputBudget')
    const resumeBudget = document.getElementById('totalBudget')
    const btnBudget = document.getElementById('btnBudget')

    btnBudget.addEventListener('click', () => {
        const budgetValue = parseInt(inputBudget.value.replace(/\D/g, '')) // remueve los caracteres no numéricos del input
        const budgetFormatted = budgetValue.toLocaleString() // formatea el número con separador de miles
        if (isNaN(budgetValue)) {
            resumeBudget.innerHTML = `<span>$</span>0`
        } else {
            resumeBudget.innerHTML = `<span>$</span>${budgetFormatted}`
        }
        clearInputs()
    })
}
