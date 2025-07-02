// --- 1. Datos de las Tarjetas (Ahora se cargan desde el almacenamiento local) ---
let todasLasTarjetas = JSON.parse(localStorage.getItem('flashcardsPA')) || [
    {
        id: 1,
        pregunta: "¿Cuál es la capital de Francia?",
        tipoRespuesta: "seleccion",
        opciones: ["Berlín", "Madrid", "París", "Roma"],
        respuestaCorrecta: "París"
    },
    {
        id: 2,
        pregunta: "¿Quién pintó la Mona Lisa?",
        tipoRespuesta: "texto",
        respuestaCorrecta: "Leonardo da Vinci"
    },
    {
        id: 3,
        pregunta: "¿Cuántos planetas hay en nuestro sistema solar?",
        tipoRespuesta: "seleccion",
        opciones: ["7", "8", "9", "10"],
        respuestaCorrecta: "8"
    },
    {
        id: 4,
        pregunta: "¿En qué año llegó el hombre a la luna?",
        tipoRespuesta: "texto",
        respuestaCorrecta: "1969"
    },
    {
        id: 5,
        pregunta: "¿Cuál es el elemento químico más abundante en la Tierra?",
        tipoRespuesta: "seleccion",
        opciones: ["Hidrógeno", "Oxígeno", "Carbono", "Hierro"],
        respuestaCorrecta: "Oxígeno"
    }
    // ¡Añade más tarjetas aquí con el mismo formato o crea las tuyas desde la app!
    // Asegúrate de que cada tarjeta tenga un 'id' único.
];

// --- 2. Variables Globales para el Estado de la Sesión ---
let tarjetasParaSesion = []; // Las tarjetas que se usarán en la sesión actual
let indiceTarjetaActual = 0; // Para saber qué tarjeta estamos mostrando
let temporizadorActivo = false;
let duracionTemporizadorMinutos = 5;
let tiempoRestanteSegundos;
let temporizadorInterval;

// --- 3. Funciones de Utilidad ---

/**
 * Muestra la pantalla deseada y oculta las demás.
 * @param {string} screenId El ID de la sección (ej. 'estudio-inicio-screen') que quieres mostrar.
 */
function mostrarPantalla(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden'); // Oculta todas las pantallas
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.remove('hidden'); // Muestra la pantalla deseada
    document.getElementById(screenId).classList.add('active');
}

/**
 * Baraja un array usando el algoritmo de Fisher-Yates.
 * @param {Array} array El array a barajar.
 * @returns {Array} El array barajado.
 */
function barajarArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// --- 4. Lógica del Temporizador ---
const temporizadorDisplay = document.getElementById('temporizadorDisplay');

function iniciarTemporizador() {
    if (!temporizadorActivo) return; // Si no está activo, no hacemos nada

    tiempoRestanteSegundos = duracionTemporizadorMinutos * 60;
    temporizadorDisplay.classList.remove('hidden'); // Mostrar el display del temporizador

    // Limpiar cualquier temporizador previo para evitar duplicados
    if (temporizadorInterval) {
        clearInterval(temporizadorInterval);
    }

    temporizadorInterval = setInterval(actualizarTemporizador, 1000);
    actualizarTemporizador(); // Llamada inicial para mostrar el tiempo inmediatamente
}

function actualizarTemporizador() {
    const minutos = Math.floor(tiempoRestanteSegundos / 60);
    const segundos = tiempoRestanteSegundos % 60;
    temporizadorDisplay.textContent =
        `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

    if (tiempoRestanteSegundos <= 0) {
        clearInterval(temporizadorInterval);
        alert("¡Tiempo terminado! Sesión finalizada.");
        finalizarSesion();
    } else {
        tiempoRestanteSegundos--;
    }
}

function detenerTemporizador() {
    clearInterval(temporizadorInterval);
    temporizadorDisplay.classList.add('hidden'); // Ocultar el display del temporizador
}

// --- 5. Lógica de la Sesión de Estudio ---
const preguntaTarjeta = document.getElementById('preguntaTarjeta');
const areaRespuesta = document.getElementById('areaRespuesta');
const respuestaCorrectaDisplay = document.getElementById('respuestaCorrecta');
const btnMostrarRespuesta = document.getElementById('btnMostrarRespuesta');
const contadorActual = document.getElementById('contadorActual');
const contadorTotal = document.getElementById('contadorTotal');
const btnSiguienteTarjeta = document.getElementById('btnSiguienteTarjeta');

function iniciarSesion(usarConfiguracionPersonalizada = false) {
    // Reiniciar estado
    indiceTarjetaActual = 0;
    tarjetasParaSesion = [];

    let tarjetasBase = [...todasLasTarjetas]; // Copiar todas las tarjetas

    if (usarConfiguracionPersonalizada) {
        // Obtener límite de tarjetas de la configuración
        const limite = parseInt(document.getElementById('numTarjetas').value);
        if (limite > 0 && limite < tarjetasBase.length) {
            // Si el límite es menor que el total, tomamos una subselección aleatoria
            tarjetasBase = barajarArray(tarjetasBase).slice(0, limite);
        }
        // Obtener configuración del temporizador
        temporizadorActivo = document.getElementById('toggleTemporizador').checked;
        if (temporizadorActivo) {
            duracionTemporizadorMinutos = parseInt(document.getElementById('duracionTemporizador').value);
        } else {
            detenerTemporizador(); // Asegurarse de que no haya un temporizador corriendo
        }
    } else {
        // Valores por defecto para "Comenzar Sesión Rápida" (puedes ajustar el límite aquí si quieres)
        temporizadorActivo = false;
        detenerTemporizador(); // Asegurarse de que no haya un temporizador corriendo
        // Si no usas configuración personalizada, podrías limitar aquí el número de tarjetas por defecto
        // tarjetasBase = barajarArray(tarjetasBase).slice(0, 10); // Por ejemplo, 10 tarjetas por defecto
    }

    // Barajar las tarjetas finales para la sesión
    tarjetasParaSesion = barajarArray(tarjetasBase);

    if (tarjetasParaSesion.length === 0) {
        alert("No hay tarjetas disponibles para esta sesión. Intenta añadir más o ajustar la configuración.");
        mostrarPantalla('estudio-inicio-screen');
        return;
    }

    // Mostrar la primera tarjeta
    mostrarTarjeta(tarjetasParaSesion[indiceTarjetaActual]);

    // Iniciar temporizador si está activo
    if (temporizadorActivo) {
        iniciarTemporizador();
    }

    mostrarPantalla('estudio-sesion-screen');
}

/**
 * Muestra el contenido de una tarjeta específica.
 * @param {Object} tarjeta El objeto de la tarjeta a mostrar.
 */
function mostrarTarjeta(tarjeta) {
    preguntaTarjeta.textContent = tarjeta.pregunta;
    areaRespuesta.innerHTML = ''; // Limpiar opciones/campo de texto anterior
    respuestaCorrectaDisplay.classList.add('hidden'); // Ocultar respuesta correcta
    respuestaCorrectaDisplay.textContent = '';
    btnMostrarRespuesta.style.display = 'block'; // Mostrar botón de "Mostrar Respuesta" por defecto

    contadorActual.textContent = indiceTarjetaActual + 1;
    contadorTotal.textContent = tarjetasParaSesion.length;

    if (tarjeta.tipoRespuesta === "seleccion") {
        tarjeta.opciones.forEach(opcion => {
            const botonOpcion = document.createElement('button');
            botonOpcion.textContent = opcion;
            botonOpcion.classList.add('opcion-respuesta');
            // Lógica para verificar respuesta en click de opción (ahora funciona)
            botonOpcion.onclick = () => verificarRespuestaSeleccion(opcion, tarjeta.respuestaCorrecta, botonOpcion);
            areaRespuesta.appendChild(botonOpcion);
        });
        // Ocultar el botón "Mostrar Respuesta" si es de selección múltiple (la verificación es instantánea)
        btnMostrarRespuesta.style.display = 'none';
    } else if (tarjeta.tipoRespuesta === "texto") {
        const campoTexto = document.createElement('textarea');
        campoTexto.placeholder = "Escribe tu respuesta aquí...";
        campoTexto.id = "campoRespuestaTexto";
        areaRespuesta.appendChild(campoTexto);
    }
}

// Función para verificar la respuesta de opción múltiple
function verificarRespuestaSeleccion(opcionSeleccionada, respuestaCorrecta, botonClicked) {
    // Deshabilitar todos los botones de opción después de una selección
    document.querySelectorAll('.opcion-respuesta').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = 0.6; // Dar una indicación visual de deshabilitado
    });

    if (opcionSeleccionada === respuestaCorrecta) {
        respuestaCorrectaDisplay.textContent = `¡Correcto! La respuesta es: ${respuestaCorrecta}`;
        respuestaCorrectaDisplay.style.color = '#28a745'; // Verde para correcto
        botonClicked.style.backgroundColor = '#d4edda'; // Un verde claro para la opción elegida
        botonClicked.style.borderColor = '#28a745';
    } else {
        respuestaCorrectaDisplay.textContent = `Incorrecto. La respuesta correcta era: ${respuestaCorrecta}`;
        respuestaCorrectaDisplay.style.color = '#dc3545'; // Rojo para incorrecto
        botonClicked.style.backgroundColor = '#f8d7da'; // Un rojo claro para la opción elegida
        botonClicked.style.borderColor = '#dc3545';

        // Opcional: Mostrar también la opción correcta con un color diferente
        document.querySelectorAll('.opcion-respuesta').forEach(btn => {
            if (btn.textContent === respuestaCorrecta) {
                btn.style.backgroundColor = '#d4edda'; // Verde claro para la correcta
                btn.style.borderColor = '#28a745';
            }
        });
    }
    respuestaCorrectaDisplay.classList.remove('hidden'); // Mostrar el mensaje de correcto/incorrecto
}


function siguienteTarjeta() {
    indiceTarjetaActual++;
    if (indiceTarjetaActual < tarjetasParaSesion.length) {
        mostrarTarjeta(tarjetasParaSesion[indiceTarjetaActual]);
    } else {
        alert("¡Has completado todas las tarjetas de esta sesión!");
        finalizarSesion();
    }
}

function finalizarSesion() {
    detenerTemporizador();
    mostrarPantalla('estudio-inicio-screen');
}

// --- 6. Lógica para Crear Tarjetas (¡Nueva funcionalidad!) ---
const btnCrearTarjeta = document.getElementById('btnCrearTarjeta');
const formCrearTarjeta = document.getElementById('formCrearTarjeta');
const tipoRespuestaCrear = document.getElementById('tipoRespuestaCrear');
const opcionesContainer = document.getElementById('opcionesContainer');
const opcionesInput = document.getElementById('opcionesInput');
const preguntaInput = document.getElementById('preguntaInput');
const respuestaCorrectaInput = document.getElementById('respuestaCorrectaInput');
const btnCancelarCreacion = document.getElementById('btnCancelarCreacion');

// Función para guardar el array de tarjetas en el localStorage del navegador
function guardarTarjetasEnLocalStorage() {
    localStorage.setItem('flashcardsPA', JSON.stringify(todasLasTarjetas));
}

// Manejar el cambio en el tipo de respuesta (texto vs selección) para mostrar/ocultar opciones
tipoRespuestaCrear.addEventListener('change', () => {
    if (tipoRespuestaCrear.value === 'seleccion') {
        opcionesContainer.classList.remove('hidden');
        opcionesInput.setAttribute('required', 'required'); // Hacer el campo de opciones requerido
    } else {
        opcionesContainer.classList.add('hidden');
        opcionesInput.removeAttribute('required'); // No requerido si es texto
    }
});

// Manejar el envío del formulario de creación de tarjetas
formCrearTarjeta.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita que la página se recargue al enviar el formulario

    const nuevaTarjeta = {
        // Genera un ID único: busca el ID más alto y le suma 1, o usa 1 si no hay tarjetas
        id: todasLasTarjetas.length > 0 ? Math.max(...todasLasTarjetas.map(t => t.id)) + 1 : 1,
        pregunta: preguntaInput.value.trim(),
        tipoRespuesta: tipoRespuestaCrear.value,
        respuestaCorrecta: respuestaCorrectaInput.value.trim()
    };

    if (nuevaTarjeta.tipoRespuesta === "seleccion") {
        // Divide las opciones por coma, elimina espacios extra y filtra vacías
        nuevaTarjeta.opciones = opcionesInput.value.split(',').map(opcion => opcion.trim()).filter(opcion => opcion !== '');
        
        if (nuevaTarjeta.opciones.length < 2) {
            alert("Para opción múltiple, por favor, introduce al menos dos opciones separadas por coma.");
            return;
        }
        // Valida que la respuesta correcta esté entre las opciones
        if (!nuevaTarjeta.opciones.includes(nuevaTarjeta.respuestaCorrecta)) {
             alert("La respuesta correcta debe ser una de las opciones proporcionadas.");
             return;
        }
    }

    todasLasTarjetas.push(nuevaTarjeta); // Añade la nueva tarjeta a la lista global
    guardarTarjetasEnLocalStorage(); // Guarda la lista actualizada en localStorage

    alert("¡Tarjeta creada y guardada con éxito!");

    // Limpiar el formulario después de guardar
    formCrearTarjeta.reset();
    opcionesContainer.classList.add('hidden'); // Ocultar el contenedor de opciones
    tipoRespuestaCrear.value = "texto"; // Restablecer el tipo de respuesta a 'texto'

    mostrarPantalla('estudio-inicio-screen'); // Volver a la pantalla de inicio
});

// --- 7. Event Listeners (Para que los botones funcionen) ---

// Se ejecuta cuando todo el HTML está cargado
document.addEventListener('DOMContentLoaded', () => {
    // --- Botones de la Pantalla de Inicio ---
    document.getElementById('btnComenzarSesion').addEventListener('click', () => {
        iniciarSesion(false); // Inicia sesión con configuración por defecto
    });

    document.getElementById('btnConfiguracion').addEventListener('click', () => {
        // Al abrir la configuración, se establecen valores por defecto para los campos
        document.getElementById('numTarjetas').value = 10;
        document.getElementById('toggleTemporizador').checked = false;
        document.getElementById('duracionTemporizadorGroup').classList.add('hidden');
        document.getElementById('duracionTemporizador').value = 5;

        mostrarPantalla('estudio-configuracion-screen');
    });

    // Event listener para el nuevo botón "Crear Nueva Tarjeta"
    btnCrearTarjeta.addEventListener('click', () => {
        // Reiniciar el formulario de creación al abrirlo
        formCrearTarjeta.reset();
        tipoRespuestaCrear.value = "texto"; // Asegura que el tipo de respuesta sea "texto" por defecto
        opcionesContainer.classList.add('hidden'); // Oculta las opciones al inicio
        opcionesInput.removeAttribute('required'); // No requerido por defecto
        mostrarPantalla('crear-tarjeta-screen');
    });


    // --- Botones de la Pantalla de Configuración ---
    const toggleTemporizador = document.getElementById('toggleTemporizador');
    const duracionTemporizadorGroup = document.getElementById('duracionTemporizadorGroup');

    toggleTemporizador.addEventListener('change', () => {
        if (toggleTemporizador.checked) {
            duracionTemporizadorGroup.classList.remove('hidden');
        } else {
            duracionTemporizadorGroup.classList.add('hidden');
        }
    });

    document.getElementById('btnGuardarComenzar').addEventListener('click', () => {
        iniciarSesion(true); // Inicia sesión usando la configuración personalizada
    });

    document.getElementById('btnCancelarConfiguracion').addEventListener('click', () => {
        mostrarPantalla('estudio-inicio-screen'); // Vuelve a la pantalla de inicio
    });

    // --- Botones de la Pantalla de Creación ---
    btnCancelarCreacion.addEventListener('click', () => {
        mostrarPantalla('estudio-inicio-screen'); // Vuelve a la pantalla de inicio
    });


    // --- Botones de la Sesión de Estudio ---
    btnMostrarRespuesta.addEventListener('click', () => {
        const tarjetaActual = tarjetasParaSesion[indiceTarjetaActual];
        // Muestra la respuesta correcta para tarjetas de tipo "texto"
        respuestaCorrectaDisplay.textContent = `Respuesta correcta: ${tarjetaActual.respuestaCorrecta}`;
        respuestaCorrectaDisplay.classList.remove('hidden');
        btnMostrarRespuesta.style.display = 'none'; // Oculta el botón después de mostrar la respuesta
    });

    btnSiguienteTarjeta.addEventListener('click', siguienteTarjeta); // Pasa a la siguiente tarjeta

    document.getElementById('btnTerminarSesion').addEventListener('click', finalizarSesion); // Finaliza la sesión actual
});