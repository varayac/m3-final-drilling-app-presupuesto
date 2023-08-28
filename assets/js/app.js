//VARIABLES GLOBALES
let id = 0;
let presupuesto = 0;
let totalGastos = 0;
let saldoActual = 0;
const arrayGastos = [];
// const validacion = document.querySelectorAll('.error-validacion');

// FUNCION QUE OBTIENE LA FECHA/HORA ACTUAL Y LA FORMATEA
const fechaActual = () => {
	const fechaActual = new Date();
	const dia = fechaActual.getDate();
	const mes = fechaActual.getMonth() + 1;
	const anio = fechaActual.getFullYear();
	const horas = fechaActual.getHours();
	const minutos = fechaActual.getMinutes();
	// padStart es un metodo de strings que pregunta el largo de la cadena(2) y si no se cumple agrega un caracter al lado izquierdo(0)
	const fechaFormateada = `
        ${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${anio.toString()} 
        ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;

	return fechaFormateada;
};

// OBJETO GASTO
const objGasto = (nombre, valor) => {
	const GASTO = {
		id: nuevoId(),
		nombre: nombre.toLowerCase(),
		valor: parseInt(valor),
		fecha: fechaActual(),
	};

	return JSON.parse(JSON.stringify(GASTO));
};

// FUNCION QUE GENERA UN NUEVO ID
const nuevoId = () => {
	id++;
	return id;
};

// FUNCION QUE TOMA EL VALOR DE PRESUPUESTO, LO PARSEA Y PINTA
const pintarPresupuestoYsaldoInicial = () => {
	const inputPresupuesto = document.getElementById('inputPresupuesto').value || 0;
	const parrafoPresupuesto = document.getElementById('totalPresupuesto');
	const parrafoSaldo = document.getElementById('totalSaldo');

	console.log('LINEA 48: ', inputPresupuesto);

	const presupuestoNumerico = parseInt(inputPresupuesto);
	presupuesto += presupuestoNumerico;
	saldoActual = presupuestoNumerico;

	const presupuestoString = presupuestoNumerico.toLocaleString();

	parrafoPresupuesto.textContent = `$${presupuestoString}`;
	parrafoSaldo.textContent = `$${presupuestoString}`;

	habilitarModuloGastos();
	limpiarInputs();
};

// FUNCION QUE PINTA EL TOTAL DE GASTOS Y DISMINUYE EL SALDO PRESUPUESTADO
const pintarTotalGastos = () => {
	const inputCantidadGasto = document.getElementById('inputCantidadGasto').value;
	const inputNombreGasto = document.getElementById('inputNombreGasto').value;
	const parrafoGastos = document.getElementById('totalGasto');
	const parrafoSaldo = document.getElementById('totalSaldo');
	const validacion = document.querySelectorAll('.error-validacion');
	const btnGasto = document.getElementById('btnGasto');
	const GASTO = objGasto(inputNombreGasto, inputCantidadGasto);

	const nuevoSaldo = saldoActual - GASTO.valor;

	if (nuevoSaldo < 0) {
		// saldoActual = GASTO.valor
		console.log('Nuevo Saldo (if): ' + nuevoSaldo);
		console.warn('SALDO INSUFICIENTE');
		validacion[3].classList.remove('invalid-feedback');
		btnGasto.classList.add('disabled');
		limpiarInputs();
	} else {
		totalGastos += GASTO.valor;
		// saldoActual -= GASTO.valor
		saldoActual = nuevoSaldo;

		arrayGastos.push(GASTO);
		const saldoActualFormateado = saldoActual.toLocaleString();
		const totalGastosFormateado = totalGastos.toLocaleString();

		parrafoGastos.textContent = `$${totalGastosFormateado}`;
		parrafoSaldo.textContent = `$${saldoActualFormateado}`;

		pintarTabla(GASTO);
		validacion[3].classList.add('invalid-feedback');

		console.log(arrayGastos);
		console.log('ID GLOBAL: ' + id);
		console.log('PRESUPUESTO: ' + presupuesto);
		console.log('TOTAL_GASTOS: ' + totalGastos);
		console.log('SALDO_ACTUAL: ' + saldoActual);
	}
	limpiarInputs();
};

// FUNCION QUE PINTA LA TABLA
const pintarTabla = (GASTO) => {
	const tbody = document.getElementById('tbody');
	const inicialEnMayuscula = `${GASTO.nombre[0].toUpperCase()}`; // Coloca en mayusculas el primer caracter del string
	const cuerpoEnMinusculas = `${GASTO.nombre.slice(1, GASTO.nombre.length)}`; // Elimina el primer caracter de un string
	const nombreGastoFormateado = `${inicialEnMayuscula}${cuerpoEnMinusculas}`;

	tbody.innerHTML += `
            <tr id="fila-${GASTO.id}">
                <td>${nombreGastoFormateado}</td>
                <td>$${GASTO.valor.toLocaleString()}</td>
                <td>${GASTO.fecha}</td>
                <td><a id="x" href="#" onclick="eliminarGasto(${GASTO.id})"><i class="bi bi-x-lg"></i></a></td>
            </tr>`;
};

// FUNCION QUE ELIMINA UNA FILA DE LA TABLA Y RESTAURA LOS VALORES EN GASTO TOTAL Y SALDO
const eliminarGasto = (id) => {
	const gastoIndex = arrayGastos.findIndex((item) => item.id === id);
	console.log('INDEX ELIMINADO: ' + gastoIndex);

	if (gastoIndex !== -1) {
		const gastoEliminado = arrayGastos.splice(gastoIndex, 1)[0];
		const tr = document.getElementById(`fila-${gastoEliminado.id}`);
		tr.remove();
		console.log(arrayGastos);

		totalGastos -= gastoEliminado.valor;
		saldoActual += gastoEliminado.valor;

		const totalGastosFormateado = totalGastos.toLocaleString();
		const saldoActualFormateado = saldoActual.toLocaleString();
		const parrafoGastos = document.getElementById('totalGasto');
		const parrafoSaldo = document.getElementById('totalSaldo');
		parrafoGastos.textContent = `$${totalGastosFormateado}`;
		parrafoSaldo.textContent = `$${saldoActualFormateado}`;
	}

	const validacion = document.querySelectorAll('.error-validacion');
	validacion[3].classList.add('invalid-feedback');

	console.log('ID GLOBAL: ' + id);
	console.log('TOTAL_GASTOS: ' + totalGastos);
	console.log('SALDO_ACTUAL: ' + saldoActual);
};

// FUNCION QUE HABILITA EL MODULO GASTO
const habilitarModuloGastos = () => {
	const parrafoPresupuesto = document.getElementById('totalPresupuesto');
	const fieldset = document.querySelector('fieldset');
	if (parrafoPresupuesto.textContent !== '$0') fieldset.disabled = false;
};

// VALIDACION DE INPUTS Y MENSAJES DE ERROR
const validarInputPresupuesto = () => {
	const inputPresupuesto = document.getElementById('inputPresupuesto');
	const btnPresupuesto = document.getElementById('btnPresupuesto');
	const validacion = document.querySelectorAll('.error-validacion');
	const regExpNumerico = /^[1-9]\d{0,8}$/;

	if (inputPresupuesto.value.length === 0 || inputPresupuesto.value === '') {
		inputPresupuesto.classList.add('is-invalid');
		btnPresupuesto.setAttribute('disabled', true);
		validacion[0].classList.remove('invalid-feedback');
	} else {
		if (!regExpNumerico.test(inputPresupuesto.value) || inputPresupuesto.value === '') {
			inputPresupuesto.classList.add('is-invalid');
			btnPresupuesto.setAttribute('disabled', true);
			validacion[0].classList.remove('invalid-feedback');
		} else {
			inputPresupuesto.classList.remove('is-invalid');
			btnPresupuesto.removeAttribute('disabled');
			validacion[0].classList.add('invalid-feedback');
		}
	}
};

const validarInputNombreGasto = () => {
	const inputNombreGasto = document.getElementById('inputNombreGasto') || '';
	const btnGasto = document.getElementById('btnGasto');
	const validacion = document.querySelectorAll('.error-validacion');
	const regExpLiteral = /^[A-Za-zÑÁÉÍÓÚñáéíóú ]{0,20}$/;

	if (inputNombreGasto.value === '' || inputNombreGasto.value === null) {
		inputNombreGasto.classList.add('is-invalid');
		// btnGasto.setAttribute('disabled', true);
		validacion[1].classList.remove('invalid-feedback');
	} else {
		if (!regExpLiteral.test(inputNombreGasto.value) || inputNombreGasto.value === '') {
			inputNombreGasto.classList.add('is-invalid');
			// btnGasto.setAttribute('disabled', true);
			validacion[1].classList.remove('invalid-feedback');
		} else {
			inputNombreGasto.classList.remove('is-invalid');
			validacion[1].classList.add('invalid-feedback');
		}
	}
};

const validarInputCantidadGasto = () => {
	const inputCantidadGasto = document.getElementById('inputCantidadGasto');
	const btnGasto = document.getElementById('btnGasto');
	const validacion = document.querySelectorAll('.error-validacion');
	const regExpNumerico = /^[1-9]\d{0,8}$/;

	if (inputCantidadGasto.value.length <= 0) {
		inputCantidadGasto.classList.add('is-invalid');
		btnGasto.classList.add('disabled');
		// btnGasto.setAttribute('disabled', true)
		validacion[2].classList.remove('invalid-feedback');
	} else {
		if (!regExpNumerico.test(inputCantidadGasto.value) || inputCantidadGasto.value === '') {
			inputCantidadGasto.classList.add('is-invalid');
			btnGasto.classList.add('disabled');
			validacion[2].classList.remove('invalid-feedback');
		} else {
			inputCantidadGasto.classList.remove('is-invalid');
			btnGasto.classList.remove('disabled');
			validacion[2].classList.add('invalid-feedback');
		}
	}
};

// LIMPIEZA DE INPUTS Y BLOQUEO DE BOTONES
const limpiarInputs = () => {
	const validacion = document.querySelectorAll('.error-validacion');
	document.getElementById('inputPresupuesto').value = '';
	document.getElementById('inputNombreGasto').value = '';
	document.getElementById('inputCantidadGasto').value = '';
	validacion[0].classList.add('invalid-feedback');
	validacion[1].classList.add('invalid-feedback');
	validacion[2].classList.add('invalid-feedback');
};

// REFRESCA PAGINA COMPLETA
const refrescarPagina = () => {
	limpiarInputs();
	location.reload();
};

// DELEGACION DE EVENTOS CLICK (se manipulan dentro de main mediante target)
main.addEventListener('click', (e) => {
	if (e.target.id === 'btnPresupuesto') {
		if (document.getElementById('inputPresupuesto').value <= 0) {
			document.getElementById('inputPresupuesto').classList.add('is-invalid');
			document.querySelectorAll('.error-validacion')[0].classList.remove('invalid-feedback');
		} else {
			pintarPresupuestoYsaldoInicial();
		}
	}
	if (e.target.id === 'btnGasto') pintarTotalGastos();
});

main.addEventListener('input', (e) => {
	if (e.target.id === 'inputPresupuesto') validarInputPresupuesto();
	if (e.target.id === 'inputNombreGasto') validarInputNombreGasto();
	if (e.target.id === 'inputCantidadGasto') validarInputCantidadGasto();
});

// Ejecuta limpieza antes de todo
document.addEventListener('DOMContentLoaded', () => {
	limpiarInputs();
});
