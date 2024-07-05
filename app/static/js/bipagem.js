let lastProductNumber = 1;
let productCount = 0;

function dataTable() {
    const now = new Date();
    let day = now.getDate().toString().padStart(2, '0');
    let month = (now.getMonth() + 1).toString().padStart(2, '0');
    let year = now.getFullYear();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}
dataTable();

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

function getFormattedDate() {

    const today = new Date();

    let day = today.getDate().toString().padStart(2, '0');
    let month = (today.getMonth() + 1).toString().padStart(2, '0');
    let year = today.getFullYear();

    const dataString = `${day}/${month}/${year}`;

    document.getElementById('realdata').textContent = "Data: " + dataString;
}
getFormattedDate();


function getNextProductNumber() {
    let newNumber = lastProductNumber;
    lastProductNumber += 4;
    return newNumber.toString().padStart(4, '0');
}

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById('table-body');
    const masterCheckbox = document.getElementById('showDivCheckbox');
    const selectedCountSpan = document.getElementById('selected-count'); // Elemento para mostrar a contagem de checkboxes selecionados

    masterCheckbox.addEventListener('change', function () {
        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateCheckboxCount();
        toggleDivVisibility();
    });

    tableBody.addEventListener('change', function (event) {
        if (event.target.type === 'checkbox') {
            updateCheckboxCount();
            toggleDivVisibility();
        }
    });

    function updateCheckboxCount() {
        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
        const count = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
        selectedCountSpan.textContent = count; // Atualiza a contagem no DOM
    }

    function toggleDivVisibility() {
        const anyChecked = selectedCountSpan.textContent > 0;
        document.getElementById('toggleDiv').style.display = anyChecked ? 'block' : 'none';
    }

    // Chamada inicial para configurar o estado correto na carga da página
    updateCheckboxCount();
    toggleDivVisibility();
});

document.addEventListener("DOMContentLoaded", function () {
    const checkbox = document.getElementById('showDivCheckbox');
    const toggleDiv = document.getElementById('toggleDiv');

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            toggleDiv.style.display = 'block';
        } else {
            toggleDiv.style.display = 'none';
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const codigoProdutoInput = document.getElementById('codigoProduto');
    const chaveProdutoInput = document.getElementById('chaveProduto');
    const tbody = document.getElementById('table-body');
    const productCountSpan = document.getElementById('product-count');
    let isDataBeingProcessed = false;

    function updateProductCount() {
        productCount++;
        productCountSpan.textContent = productCount;
    }

    codigoProdutoInput.addEventListener('input', function () {
        chaveProdutoInput.disabled = !codigoProdutoInput.value.trim();
    });

    chaveProdutoInput.addEventListener('input', function () {
        if (codigoProdutoInput.value.trim() && chaveProdutoInput.value.trim() && !isDataBeingProcessed) {
            isDataBeingProcessed = true;
            setTimeout(function () {
                addDataToTable(tbody, codigoProdutoInput.value, chaveProdutoInput.value);
                updateProductCount();
                codigoProdutoInput.value = '';
                chaveProdutoInput.value = '';
                chaveProdutoInput.disabled = true;
                isDataBeingProcessed = false;
                codigoProdutoInput.focus();
            }, 1000);
        }
    });

    function addDataToTable(tbody, codigo, chave) {
        const newRow = tbody.insertRow(-1);
        const newCell1 = newRow.insertCell(0);
        const newCell2 = newRow.insertCell(1);
        const newCell3 = newRow.insertCell(2);
        const newCell4 = newRow.insertCell(3);
        const newCell5 = newRow.insertCell(4);
        const newCell6 = newRow.insertCell(5);

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        const uniqueId = 'showDivCheckbox-' + new Date().getTime(); // Cria um ID único baseado no timestamp
        checkBox.id = uniqueId;
        newCell1.appendChild(checkBox);

        newCell2.textContent = getNextProductNumber();
        newCell3.textContent = codigo;
        newCell4.textContent = chave;
        newCell5.textContent = dataTable();
        newCell6.textContent = 'Ações';

        // Ouvinte de evento diretamente no checkbox criado
        checkBox.addEventListener('change', function () {
            const toggleDiv = document.getElementById('toggleDiv'); // A div que você quer mostrar/ocultar
            toggleDiv.style.display = this.checked ? 'block' : 'none';
        });

        const avisoIniciado = document.querySelector('.aviso-iniciado');
        if (avisoIniciado) {
            avisoIniciado.style.display = 'none';
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById('table-body');
    const toggleDiv = document.getElementById('toggleDiv');
    const masterCheckbox = document.getElementById('showDivCheckbox');

    masterCheckbox.addEventListener('change', function () {
        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        toggleDiv.style.display = this.checked ? 'block' : 'none';
    });

    tableBody.addEventListener('change', function (event) {
        if (event.target.type === 'checkbox') {
            checkCheckboxes();
        }
    });

    function checkCheckboxes() {
        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
        const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        toggleDiv.style.display = anyChecked ? 'block' : 'none';
    }
});

function checkAndToggleAviso(tbody, avisoIniciado) {
    if (tbody.children.length > 0) {
        avisoIniciado.style.display = 'none';
    }

}

document.addEventListener("DOMContentLoaded", function () {
    const btnIniciar = document.querySelector('.button-iniciar');
    const btnCancelar = document.querySelector('.button-cancelar');
    const btnFinalizar = document.querySelector('.button-finalizar');

    btnIniciar.addEventListener('click', function () {
        btnIniciar.style.display = 'none';

        btnCancelar.style.display = 'inline-block';
        btnFinalizar.style.display = 'inline-block';
    });

    btnCancelar.addEventListener('click', function () {
        btnIniciar.style.display = 'inline-block';
        btnCancelar.style.display = 'none';
        btnFinalizar.style.display = 'none';
    });

    btnFinalizar.addEventListener('click', function () {
        btnIniciar.style.display = 'inline-block';
        btnCancelar.style.display = 'none';
        btnFinalizar.style.display = 'none';
    });
});

function clearTbody(tbody) {
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

function resetProductCount() {
    productCount = 0;

    const productCountSpan = document.getElementById('product-count');

    if (productCountSpan) {
        productCountSpan.textContent = productCount;
    }
}

document.addEventListener("DOMContentLoaded", function () {
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
    const codigoProdutoInput = document.getElementById('codigoProduto');
    const chaveProdutoInput = document.getElementById('chaveProduto');

    function toggleInputs(enabled) {
        const codigoProdutoInput = document.getElementById('codigoProduto');
        const chaveProdutoInput = document.getElementById('chaveProduto');

        codigoProdutoInput.disabled = !enabled;
        chaveProdutoInput.disabled = true;
        if (!enabled) {
            codigoProdutoInput.value = '';
            chaveProdutoInput.value = '';
        }
    }

    codigoProdutoInput.addEventListener('input', function () {
        if (codigoProdutoInput.value.trim() !== '') {
            setTimeout(function () {
                chaveProdutoInput.focus();
            }, 1000);
        }
    });

    btnIniciar.onclick = function () {
        resetProductCount();
        btnIniciar.style.display = 'none';
        btnCancelar.style.display = 'inline';
        btnFinalizar.style.display = 'inline';
        avisoInicio.style.display = 'none';
        avisoIniciado.style.display = 'flex';
        toggleInputs(true);
        tbody.style.display = 'table-row-group';
        codigoProdutoInput.focus();
    };

    btnCancelar.onclick = function () {
        avisoInicio.style.display = 'none';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'none';
        btnCancelar.style.display = 'inline';
        btnFinalizar.style.display = 'inline';
        confirmationCancelModal.style.display = 'flex';
        codigoProdutoInput.value = '';
        chaveProdutoInput.value = '';
    };

    btnCancelarPopup.onclick = function () {
        toggleInputs(true);
        codigoProdutoInput.value = '';
        chaveProdutoInput.value = '';
        avisoInicio.style.display = 'none';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'none';
        btnCancelar.style.display = 'inline';
        btnFinalizar.style.display = 'inline';
        confirmationModal.style.display = 'none';
    };

    btnCancelarOperação.onclick = function () {
        toggleInputs(true);
        codigoProdutoInput.value = '';
        chaveProdutoInput.value = '';
        avisoInicio.style.display = 'none';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'none';
        btnCancelar.style.display = 'inline';
        btnFinalizar.style.display = 'inline';
        confirmationCancelModal.style.display = 'none';
    }

    btnConfirmarExcluirOperação.onclick = function () {
        toggleInputs(false);
        codigoProdutoInput.value = '';
        chaveProdutoInput.value = '';
        avisoInicio.style.display = 'flex';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'inline';
        btnCancelar.style.display = 'none';
        btnFinalizar.style.display = 'none';
        confirmationCancelModal.style.display = 'none';
        clearTbody(tbody);
        resetProductCount();
    }

    btnFinalizar.onclick = function () {
        avisoInicio.style.display = 'none';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'none';
        btnCancelar.style.display = 'inline';
        btnFinalizar.style.display = 'inline';
        confirmationModal.style.display = 'flex';
    };

    document.querySelector('.button-confirm').onclick = function () {
        confirmationModal.style.display = 'none';
        loadingPopup.style.display = 'flex';
        setTimeout(function () {
            loadingPopup.style.display = 'none';
            finalizadoPopup.style.display = 'flex';
            clearTbody(tbody);
            toggleInputs(false);
            avisoInicio.style.display = 'flex';
            resetProductCount();
        }, 3000);
    };

    btnConcluir.onclick = function () {
        avisoInicio.style.display = 'flex';
        avisoIniciado.style.display = 'none';
        btnIniciar.style.display = 'inline';
        btnCancelar.style.display = 'none';
        btnFinalizar.style.display = 'none';
        finalizadoPopup.style.display = 'none';
        clearTbody(tbody);
    };

    document.querySelectorAll('.close-button-confirm').forEach(button => {
        button.onclick = function () {
            avisoInicio.style.display = 'none';
            avisoIniciado.style.display = 'none';
            confirmationCancelModal.style.display = 'none';
            confirmationModal.style.display = 'none';
            loadingPopup.style.display = 'none';
            finalizadoPopup.style.display = 'none';
        };
    });

    document.querySelectorAll('.close-button-concluido').forEach(button => {
        button.onclick = function () {
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

    codigoProdutoInput.addEventListener('input', function () {
        chaveProdutoInput.disabled = !codigoProdutoInput.value.trim();
    });
});