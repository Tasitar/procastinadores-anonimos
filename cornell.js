// assets/cornell.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const metodoCornellScreen = document.getElementById('metodo-cornell-screen');
    const btnVolverDesdeCornell = document.getElementById('btnVolverDesdeCornell');
    const btnConfiguracion1 = document.getElementById('btnConfiguracion1');
    const btnConfiguracion2 = document.getElementById('btnConfiguracion2');
    const cornellLayout = document.getElementById('cornell-layout');

    // Función para renderizar el layout de Cornell
    function renderCornellLayout(layoutType) {
        // Limpiar cualquier contenido previo
        cornellLayout.innerHTML = '';
        cornellLayout.className = 'cornell-layout'; // Resetear clases
        let panels = [];

        if (layoutType === 'layout-1') {
            cornellLayout.classList.add('layout-1');
            panels = [
                { title: 'Notas Detalladas', placeholder: 'Escribe aquí tus notas de clase, explicaciones y puntos importantes...' },
                { title: 'Palabras Clave / Preguntas', placeholder: 'Anota aquí palabras clave, preguntas que surjan o ideas principales para revisar...' },
                { title: 'Resumen', placeholder: 'Sintetiza aquí los puntos clave de esta página de notas...' }
            ];
        } else if (layoutType === 'layout-2') {
            cornellLayout.classList.add('layout-2');
            panels = [
                { title: 'Notas Detalladas', placeholder: 'Escribe aquí tus notas de clase, explicaciones y puntos importantes...' },
                { title: 'Palabras Clave / Preguntas', placeholder: 'Anota aquí palabras clave, preguntas que surjan o ideas principales para revisar...' },
                { title: 'Resumen', placeholder: 'Sintetiza aquí los puntos clave de esta página de notas...' }
            ];
        }

        // Crear y añadir los paneles
        panels.forEach(panelData => {
            const panel = document.createElement('div');
            panel.classList.add('cornell-panel');

            const title = document.createElement('h3');
            title.textContent = panelData.title;
            panel.appendChild(title);

            const textarea = document.createElement('textarea');
            textarea.placeholder = panelData.placeholder;
            textarea.rows = 10; // Fila inicial, flex-grow se encargará del resto
            panel.appendChild(textarea);

            cornellLayout.appendChild(panel);
        });
    }

    // --- Manejo de visibilidad de la pantalla de Cornell ---
    // Esta función asume que tienes un botón o enlace en tu index.html
    // para ir a la pantalla de Cornell. Por ejemplo:
    // <a href="#" id="ir-a-cornell">Método Cornell</a>
    const irACornellBtn = document.getElementById('ir-a-cornell');
    if (irACornellBtn) {
        irACornellBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Evitar el comportamiento de enlace por defecto
            
            // Ocultar la pantalla principal (si existe, asumiendo que está en index.html)
            const mainScreen = document.getElementById('estudio-inicio-screen'); // Ajusta este ID si es diferente
            if (mainScreen) {
                mainScreen.classList.remove('active');
                mainScreen.classList.add('hidden');
            }

            // Mostrar la pantalla de Cornell
            metodoCornellScreen.classList.remove('hidden');
            metodoCornellScreen.classList.add('active');

            // Renderizar el layout predeterminado al entrar
            renderCornellLayout('layout-1'); 
        });
    }

    // --- Event Listeners para botones de configuración ---
    if (btnConfiguracion1) {
        btnConfiguracion1.addEventListener('click', () => {
            renderCornellLayout('layout-1');
        });
    }

    if (btnConfiguracion2) {
        btnConfiguracion2.addEventListener('click', () => {
            renderCornellLayout('layout-2');
        });
    }

    // --- Event Listener para el botón Volver al Inicio ---
    if (btnVolverDesdeCornell) {
        btnVolverDesdeCornell.addEventListener('click', () => {
            // Ocultar la pantalla de Cornell
            metodoCornellScreen.classList.remove('active');
            metodoCornellScreen.classList.add('hidden');

            // Mostrar la pantalla principal (si existe, asumiendo que está en index.html)
            const mainScreen = document.getElementById('estudio-inicio-screen'); // Ajusta este ID si es diferente
            if (mainScreen) {
                mainScreen.classList.remove('hidden');
                mainScreen.classList.add('active');
            } else {
                // Si no hay una pantalla principal con ese ID, redirigir al index
                window.location.href = 'index.html'; 
            }
        });
    }

    // Renderizar el layout inicial cuando la página carga, si el elemento de Cornell está activo
    // Esto es útil si cargas directamente cornell_method.html
    if (metodoCornellScreen && metodoCornellScreen.classList.contains('active') || !metodoCornellScreen) { // Si ya está activa o no hay un sistema de pantallas de inicio
        renderCornellLayout('layout-1');
    }
});