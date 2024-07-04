function updateClock() {

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById('realtime-clock').textContent = "Hora: " + timeString;

    setTimeout(updateClock, 1000);
}
updateClock();

document.addEventListener("DOMContentLoaded", function() {
    const btnIniciar = document.querySelector('.button-iniciar');
    const btnCancelar = document.querySelector('.button-cancelar');
    const btnFinalizar = document.querySelector('.button-finalizar');

    btnIniciar.addEventListener('click', function() {
        btnIniciar.style.display = 'none';

        btnCancelar.style.display = 'inline-block';
        btnFinalizar.style.display = 'inline-block';
    });

    btnCancelar.addEventListener('click', function() {
        btnIniciar.style.display = 'inline-block';
        btnCancelar.style.display = 'none';
        btnFinalizar.style.display = 'none';
    });

    btnFinalizar.addEventListener('click', function() {
        btnIniciar.style.display = 'inline-block';
        btnCancelar.style.display = 'none';
        btnFinalizar.style.display = 'none';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const btnIniciar = document.querySelector('.button-iniciar');
    const btnCancelar = document.querySelector('.button-cancelar');
    const btnFinalizar = document.querySelector('.button-finalizar');
    const confirmationModal = document.getElementById('popup-finalizar-container');
    const confirmationCancelModal = document.getElementById('popup-cancelar-container');
    const loadingPopup = document.getElementById('popup-loading-container');
    const finalizadoPopup = document.getElementById('popup-finalizado-container');
    const btnConcluir = document.querySelector('.button-concluir');
    const btnCancelarPopup = document.querySelector('.button-cancel');
    const btnCancelarOperação = document.querySelector('.button-cancel-operação');
    const btnConfirmarExcluirOperação = document.querySelector('.button-confirm-cancel-operação');
    const tbody = document.querySelector('tbody');
    const avisoInicio = document.querySelector('.aviso-inicio');
    const avisoIniciado = document.querySelector('.aviso-iniciado');

    btnIniciar.onclick = function() {
        btnIniciar.style.display = 'none';
        btnCancelar.style.display = 'inline';
        btnFinalizar.style.display = 'inline';
        avisoInicio.style.display = 'none';
        avisoIniciado.style.display = 'flex';

        //tbody.style.display = 'table-row-group';
    };

    btnCancelar.onclick = function() {
        avisoInicio.style.display = 'none';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'none';
        btnCancelar.style.display = 'inline';
        btnFinalizar.style.display = 'inline';
        confirmationCancelModal.style.display = 'flex';
    };

    btnCancelarPopup.onclick = function() {
        avisoInicio.style.display = 'none';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'none';
        btnCancelar.style.display = 'inline';
        btnFinalizar.style.display = 'inline';
        confirmationModal.style.display = 'none';
    };

    btnCancelarOperação.onclick = function() {
        avisoInicio.style.display = 'none';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'none';
        btnCancelar.style.display = 'inline';
        btnFinalizar.style.display = 'inline';
        confirmationCancelModal.style.display = 'none';
    }

    btnConfirmarExcluirOperação.onclick = function() {
        avisoInicio.style.display = 'flex';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'inline';
        btnCancelar.style.display = 'none';
        btnFinalizar.style.display = 'none';
        confirmationCancelModal.style.display = 'none';
    }

    btnFinalizar.onclick = function() {
        avisoInicio.style.display = 'flex';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'none';
        btnCancelar.style.display = 'inline';
        btnFinalizar.style.display = 'inline';
        confirmationModal.style.display = 'flex';
    };

    document.querySelector('.button-confirm').onclick = function() {
        confirmationModal.style.display = 'none';
        loadingPopup.style.display = 'flex';
        setTimeout(function() {
            loadingPopup.style.display = 'none';
            finalizadoPopup.style.display = 'flex';
        }, 3000);
    };

    btnConcluir.onclick = function() {
        avisoInicio.style.display = 'flex';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'inline';
        btnCancelar.style.display = 'none';
        btnFinalizar.style.display = 'none';
        finalizadoPopup.style.display = 'none';
    };

    document.querySelectorAll('.close-button-confirm').forEach(button => {
        button.onclick = function() {
            avisoInicio.style.display = 'none';
            avisoIniciado.style.display = 'none';
            confirmationCancelModal.style.display = 'none';
            confirmationModal.style.display = 'none';
            loadingPopup.style.display = 'none';
            finalizadoPopup.style.display = 'none';
        };
    });

    document.querySelectorAll('.close-button-concluido').forEach(button => {
        button.onclick = function() {
            avisoInicio.style.display = 'none';
            avisoIniciado.style.display = 'none';
            btnIniciar.style.display = 'inline';
            btnCancelar.style.display = 'none';
            btnFinalizar.style.display = 'none';
            finalizadoPopup.style.display = 'none';
            confirmationModal.style.display = 'none';
            loadingPopup.style.display = 'none';
        };
    });
});

function closeFinalizadoPopup() {
    document.getElementById('popup-finalizado-container').style.display = 'none';
}