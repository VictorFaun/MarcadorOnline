
const marcadorId = window.location.pathname.split('/').pop();  // Obtener el ID del marcador desde la URL
const socket = io();  // Conectar a Socket.IO
let streamModo = true;

// Unirse a la sala del marcador específico
socket.emit('joinMarcador', marcadorId);

// Escuchar actualizaciones en tiempo real
socket.on('actualizarMarcador', (marcador) => {
    const marcadorElement = document.querySelector('.marcador');
    const localElement = document.querySelector('.local');
    const visitaElement = document.querySelector('.visita');

    function isIphone() {
        return /iPhone/i.test(navigator.userAgent);
      }

      if (isIphone()) {
        document.querySelector('body').style.maxWidth = '85%';
      } else {
        document.querySelector('body').style.maxWidth = '100%';
      }

    if (!marcador.estado) {
        if (document.querySelector('.fondo').style.display != 'none') {

            document.querySelector('.fondo').style.display = 'none';

            document.querySelector('.fondo').classList.remove('animated-change');
            void document.querySelector('.fondo').offsetWidth; // Forzar reflujo para reiniciar la animación
            document.querySelector('.fondo').classList.add('animated-change');
        }
    } else {
        if (document.querySelector('.fondo').style.display != 'block') {
            document.querySelector('.fondo').style.display = 'block';

            document.querySelector('.fondo').classList.remove('animated-change');
            void document.querySelector('.fondo').offsetWidth; // Forzar reflujo para reiniciar la animación
            document.querySelector('.fondo').classList.add('animated-change');
        }
    }

    document.querySelector('.fondo').addEventListener('click', function () {
        document.querySelector('.fondo').classList.add('bloqueoModo');

        if (document.querySelector('.fondo').classList.contains('modo3')) {

            document.querySelector('.fondo').classList.add('modo2');
            document.querySelector('.fondo').classList.remove('modo3');
        } else {
            if (document.querySelector('.fondo').classList.contains('modo2')) {

                document.querySelector('.fondo').classList.remove('modo2');
                document.querySelector('.fondo').classList.remove('modo3');
            } else {

                document.querySelector('.fondo').classList.add('modo3');
            }
        }

        document.querySelector('.fondo').classList.remove('animated-change');
        void document.querySelector('.fondo').offsetWidth; // Forzar reflujo para reiniciar la animación
        document.querySelector('.fondo').classList.add('animated-change');
    });

    if (marcador.modo == 2) {
        if (!document.querySelector('.fondo').classList.contains('bloqueoModo') && !document.querySelector('.fondo').classList.contains('modo2')) {
            document.querySelector('.fondo').classList.add('modo2');
            document.querySelector('.fondo').classList.remove('animated-change');
            void document.querySelector('.fondo').offsetWidth; // Forzar reflujo para reiniciar la animación
            document.querySelector('.fondo').classList.add('animated-change');
        }
    }

    if (marcador.modo == 1) {
        if (!document.querySelector('.fondo').classList.contains('bloqueoModo') && document.querySelector('.fondo').classList.contains('modo2')) {
            document.querySelector('.fondo').classList.remove('modo2');
            document.querySelector('.fondo').classList.remove('animated-change');
            void document.querySelector('.fondo').offsetWidth; // Forzar reflujo para reiniciar la animación
            document.querySelector('.fondo').classList.add('animated-change');
        }
    }

    // Agregar o quitar la clase 'invert'
    if (marcador.invert) {
        if (!marcadorElement.classList.contains('invert')) {
            marcadorElement.classList.add('invert');

            if(!document.querySelector('.fondo').classList.contains('modo2')){

                marcadorElement.classList.remove('animated-change');
                void marcadorElement.offsetWidth; // Forzar reflujo para reiniciar la animación
                marcadorElement.classList.add('animated-change');
            }
        }
    } else {

        if (marcadorElement.classList.contains('invert')) {

            marcadorElement.classList.remove('invert');

            
            if(!document.querySelector('.fondo').classList.contains('modo2')){

                marcadorElement.classList.remove('animated-change');
                void marcadorElement.offsetWidth; // Forzar reflujo para reiniciar la animación
                marcadorElement.classList.add('animated-change');
            }
        }
    }



    if (marcador.saque == "local") {
        actualizarConAnimacionDisplay(document.querySelector('.saqueLocal').querySelector('img'), 'block');
    } else {
        actualizarConAnimacionDisplay(document.querySelector('.saqueLocal').querySelector('img'), 'none');
    }

    if (marcador.saque == "visit") {
        actualizarConAnimacionDisplay(document.querySelector('.saqueVisita').querySelector('img'), 'block');
    } else {
        actualizarConAnimacionDisplay(document.querySelector('.saqueVisita').querySelector('img'), 'none');
    }

    const equipoLocalElement = document.querySelector('.equipoLocal');
    const equipoVisitaElement = document.querySelector('.equipoVisita');

    actualizarConAnimacionTextContent(equipoLocalElement, marcador.equipoLocal ? marcador.equipoLocal : "");

    actualizarConAnimacionTextContent(equipoVisitaElement, marcador.equipoVisita ? marcador.equipoVisita : "");

    actualizarConAnimacionTextContent(document.querySelector('.puntosLocal').querySelector('label'), marcador.puntosLocal || '0');
    actualizarConAnimacionTextContent(document.querySelector('.setsLocal').querySelector('label'), marcador.setsLocal || '0');
    actualizarConAnimacionTextContent(document.querySelector('.setsVisita').querySelector('label'), marcador.setsVisita || '0');
    actualizarConAnimacionTextContent(document.querySelector('.puntosVisita').querySelector('label'), marcador.puntosVisita || '0');



    if (marcador.winLocal) {
        document.querySelector('.puntosLocal').querySelector('label').classList.add('win');
        document.querySelector('.puntosLocal').querySelector('p').classList.add('win');
    } else {
        document.querySelector('.puntosLocal').querySelector('label').classList.remove('win');
        document.querySelector('.puntosLocal').querySelector('p').classList.remove('win');
    }

    if (marcador.winVisita) {
        document.querySelector('.puntosVisita').querySelector('label').classList.add('win');
        document.querySelector('.puntosVisita').querySelector('p').classList.add('win');
    } else {
        document.querySelector('.puntosVisita').querySelector('label').classList.remove('win');
        document.querySelector('.puntosVisita').querySelector('p').classList.remove('win');
    }

    function actualizarConAnimacionTextContent(elemento, nuevoValor) {
        // Solo actualiza si el valor ha cambiado
        if (elemento.textContent != nuevoValor) {
            elemento.classList.remove('animated-change'); // Remueve la clase para reiniciar la animación
            void elemento.offsetWidth; // Forzar reflujo para reiniciar la animación
            elemento.textContent = nuevoValor; // Actualiza el contenido
            elemento.classList.add('animated-change'); // Agrega la clase para aplicar la animación
        }
    }
    function actualizarConAnimacionDisplay(elemento, nuevoValor) {
        // Solo actualiza si el valor ha cambiado
        if (elemento.style.display !== nuevoValor) {
            elemento.classList.remove('animated-change'); // Remueve la clase para reiniciar la animación

            void elemento.offsetWidth; // Forzar reflujo para reiniciar la animación
            elemento.style.display = nuevoValor; // Actualiza el contenido
            elemento.classList.add('animated-change'); // Agrega la clase para aplicar la animación
        }
    }
});