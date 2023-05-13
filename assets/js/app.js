//VARIABLES GLOBALES
let id = 0
let presupuesto = 0
let totalGastos = 0
let saldoActual = 0
const arrayGastos = []

// FUNCION QUE GENERA UN NUEVO ID
const nuevoId = () => {
    id++
    return id
}

// FUNCION QUE OBTIENE LA FECHA/HORA ACTUAL Y LA FORMATEA
const fechaActual = () => {
    const fechaActual = new Date()
    const dia = fechaActual.getDate()
    const mes = fechaActual.getMonth() + 1
    const anio = fechaActual.getFullYear()
    const horas = fechaActual.getHours()
    const minutos = fechaActual.getMinutes()
    // padStart es un metodo de strings que pregunta el largo de la cadena(2) y si no se cumple agrega un caracter al lado izquierdo(0)
    const fechaFormateada = `
        ${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${anio.toString()} 
        ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`

    return fechaFormateada
}

// OBJETO GASTO
const objGasto = (nombre, valor) => {
    const GASTO = {
        id: nuevoId(),
        nombre: nombre.toLowerCase(),
        valor: parseInt(valor),
        fecha: fechaActual(),
    }

    return JSON.parse(JSON.stringify(GASTO))
}

// FUNCION QUE TOMA EL VALOR DE PRESUPUESTO, LO PARSEA Y PINTA
const pintarPresupuestoYsaldoInicial = () => {
    const inputPresupuesto = document.getElementById('inputBudget').value
    const parrafoPresupuesto = document.getElementById('totalBudget')
    const parrafoSaldo = document.getElementById('totalRemaining')

    const presupuestoNumerico = parseInt(inputPresupuesto)

    // validarInputsNumericos()

    presupuesto += presupuestoNumerico
    saldoActual = presupuestoNumerico

    const presupuestoString = presupuestoNumerico.toLocaleString()
    parrafoPresupuesto.textContent = `$${presupuestoString}`
    parrafoSaldo.textContent = `$${presupuestoString}`

    limpiarInputs()
    habilitarModuloGastos()
}

// FUNCION QUE PINTA EL TOTAL DE GASTOS Y DISMINUYE EL SALDO PRESUPUESTADO
const pintarTotalGastos = () => {
    const inputCantidadGasto = document.getElementById('inputExpense').value
    const inputNombreGasto = document.getElementById('inputExpenseName').value
    const parrafoGastos = document.getElementById('totalExpenses')
    const parrafoSaldo = document.getElementById('totalRemaining')
    const alert = document.querySelectorAll('.error-alerts')
    const GASTO = objGasto(inputNombreGasto, inputCantidadGasto)

    totalGastos += GASTO.valor
    saldoActual -= GASTO.valor

    if (saldoActual < 0) {
        console.warn('SALDO INSUFICIENTE')
        alert[3].classList.remove('invalid-feedback')
    } else {
        arrayGastos.push(GASTO)
        const saldoActualFormateado = saldoActual.toLocaleString()
        const totalGastosFormateado = totalGastos.toLocaleString()

        parrafoGastos.textContent = `$${totalGastosFormateado}`
        parrafoSaldo.textContent = `$${saldoActualFormateado}`

        alert[3].classList.add('invalid-feedback')
        pintarTabla(GASTO)

        console.log(arrayGastos)
        console.log('PRESUPUESTO: ' + presupuesto)
        console.log('TOTAL_GASTOS: ' + totalGastos)
        console.log('SALDO_ACTUAL: ' + saldoActual)
    }
    limpiarInputs()
}

// FUNCION QUE PINTA LA TABLA
const pintarTabla = (GASTO) => {
    const tbody = document.getElementById('tbody')
    const inicialEnMayuscula = `${GASTO.nombre[0].toUpperCase()}` // Coloca en mayusculas el primer caracter del string
    const cuerpoEnMinusculas = `${GASTO.nombre.slice(1, GASTO.nombre.length)}` // Elimina el primer caracter de un string
    const nombreGastoFormateado = `${inicialEnMayuscula}${cuerpoEnMinusculas}`

    tbody.innerHTML += `
            <tr id="fila-${GASTO.id}">
                <td>${nombreGastoFormateado}</td>
                <td>$${GASTO.valor.toLocaleString()}</td>
                <td>${GASTO.fecha}</td>
                <td><a id="x" href="#" onclick="eliminarGasto(${GASTO.id})"><i class="bi bi-x-lg"></i></a></td>
            </tr>`
}

// FUNCION QUE ELIMINA UNA FILA DE LA TABLA Y RESTAURA LOS VALORES EN GASTO TOTAL Y SALDO
const eliminarGasto = (id) => {
    const gastoIndex = arrayGastos.findIndex((item) => item.id === id)
    console.log(gastoIndex)

    if (gastoIndex !== -1) {
        const gastoEliminado = arrayGastos.splice(gastoIndex, 1)[0]
        const tr = document.getElementById(`fila-${gastoEliminado.id}`)
        tr.remove()
        console.log(arrayGastos)

        totalGastos -= gastoEliminado.valor
        saldoActual += gastoEliminado.valor

        const totalGastosFormateado = totalGastos.toLocaleString()
        const saldoActualFormateado = saldoActual.toLocaleString()
        document.getElementById('totalRemaining').textContent = `$${saldoActualFormateado}`
        document.getElementById('totalExpenses').textContent = `$${totalGastosFormateado}`
        // const parrafoGastos = document.getElementById('totalExpenses')
        // const parrafoSaldo = document.getElementById('totalRemaining')
        // parrafoGastos.textContent = `$${totalGastosFormateado}`
        // parrafoSaldo.textContent = `$${saldoActualFormateado}`
    }

    console.info('TOTAL_GASTOS: ' + totalGastos)
    console.info('SALDO_ACTUAL: ' + saldoActual)
}

// FUNCION QUE HABILITA EL MODULO GASTO
const habilitarModuloGastos = () => {
    const parrafoPresupuesto = document.getElementById('totalBudget')
    const fieldset = document.querySelector('fieldset')
    if (parrafoPresupuesto.textContent !== '$0') fieldset.disabled = false
}

// VALIDACION DE INPUTS Y MENSAJES DE ERROR
const validarInputPresupuesto = () => {
    const inputPresupuesto = document.getElementById('inputBudget')
    const btnPresupuesto = document.getElementById('btnBudget')
    const alerta = document.querySelectorAll('.error-alerts')
    const regExpNumerico = /^[1-9]\d{0,8}$/

    if (inputPresupuesto.value.length === '' || inputPresupuesto.value === undefined) {
        inputPresupuesto.classList.add('is-invalid')
        // btnPresupuesto.classList.add('disabled')
        // btnPresupuesto.toggleAttribute('disabled')
        btnPresupuesto.setAttribute('disabled', true)
        alerta[0].classList.remove('invalid-feedback')
    } else {
        if (!regExpNumerico.test(inputPresupuesto.value) || inputPresupuesto.value === '') {
            inputPresupuesto.classList.add('is-invalid')
            // btnPresupuesto.classList.add('disabled')
            // btnPresupuesto.toggleAttribute('disabled')
            btnPresupuesto.setAttribute('disabled', true)
            alerta[0].classList.remove('invalid-feedback')
        } else {
            inputPresupuesto.classList.remove('is-invalid')
            // btnPresupuesto.classList.remove('disabled')
            // btnPresupuesto.toggleAttribute('disabled')
            btnPresupuesto.removeAttribute('disabled')
            alerta[0].classList.add('invalid-feedback')
        }
    }
}

const validarInputNombreGasto = () => {
    const inputNombreGasto = document.getElementById('inputExpenseName')
    const btnGasto = document.getElementById('btnAddExpense')
    const alerta = document.querySelectorAll('.error-alerts')
    const regExpLiteral = /^[A-Za-zÑÁÉÍÓÚñáéíóú ]{0,20}$/

    if (inputNombreGasto.value.length === '' || inputNombreGasto.value === undefined) {
        inputNombreGasto.classList.add('is-invalid')
        // btnGasto.classList.add('disabled')
        btnGasto.setAttribute('disabled', true)
        alerta[1].classList.remove('invalid-feedback')
    } else {
        if (!regExpLiteral.test(inputNombreGasto.value) || inputNombreGasto.value === '') {
            inputNombreGasto.classList.add('is-invalid')
            // btnGasto.classList.add('disabled')
            btnGasto.setAttribute('disabled', true)
            alerta[1].classList.remove('invalid-feedback')
        } else {
            inputNombreGasto.classList.remove('is-invalid')
            // btnGasto.classList.remove('disabled')
            // btnGasto.removeAttribute('disabled')
            alerta[1].classList.add('invalid-feedback')
        }
    }
}

const validarInputCantidadGasto = () => {
    const inputCantidadGasto = document.getElementById('inputExpense')
    const btnGasto = document.getElementById('btnAddExpense')
    const alerta = document.querySelectorAll('.error-alerts')
    const regExpNumerico = /^[1-9]\d{0,8}$/

    if (inputCantidadGasto.value.length === 0) {
        console.log('RESULTA PLSSS')
        inputCantidadGasto.classList.add('is-invalid')
        // btnGasto.classList.add('disabled')
        btnGasto.setAttribute('disabled', true)
        alerta[2].classList.remove('invalid-feedback')
    } else {
        if (!regExpNumerico.test(inputCantidadGasto.value) || inputCantidadGasto.value === '') {
            inputCantidadGasto.classList.add('is-invalid')
            // btnGasto.classList.add('disabled')
            btnGasto.setAttribute('disabled', true)
            alerta[2].classList.remove('invalid-feedback')
        } else {
            inputCantidadGasto.classList.remove('is-invalid')
            // btnGasto.classList.remove('disabled')
            btnGasto.removeAttribute('disabled')
            alerta[2].classList.add('invalid-feedback')
        }
    }
}

// LIMPIEZA DE INPUTS Y BLOQUEO DE BOTONES
const limpiarInputs = () => {
    const alerta = document.querySelectorAll('.error-alerts')
    document.getElementById('inputBudget').value = ''
    document.getElementById('inputBudget').classList.remove('is-invalid')
    document.getElementById('btnBudget').setAttribute('disabled', true)
    document.getElementById('inputExpenseName').value = ''
    document.getElementById('inputExpense').value = ''
    document.getElementById('inputExpenseName').classList.remove('is-invalid')
    document.getElementById('inputExpense').classList.remove('is-invalid')
    document.getElementById('btnAddExpense').setAttribute('disabled', true)
    alerta[0].classList.add('invalid-feedback')
    alerta[1].classList.add('invalid-feedback')
    alerta[2].classList.add('invalid-feedback')
    // alerta[3].classList.add('invalid-feedback')
}

// REFRESCA PAGINA COMPLETA
const refrescarPagina = () => {
    limpiarInputs()
    location.reload()
}

// DELEGACION DE EVENTOS CLICK (se manipulan dentro de main mediante target)
main.addEventListener('click', (e) => {
    if (e.target.id === 'btnBudget') pintarPresupuestoYsaldoInicial()
    if (e.target.id === 'btnAddExpense') pintarTotalGastos()
})

main.addEventListener('input', (e) => {
    if (e.target.id === 'inputBudget') validarInputPresupuesto()
    if (e.target.id === 'inputExpenseName') validarInputNombreGasto()
    if (e.target.id === 'inputExpense') validarInputCantidadGasto()
})

// Ejecuta limpieza antes de todo
document.addEventListener('DOMContentLoaded', () => {
    limpiarInputs()
})
