let productCount = 0;
let lastProductNumber = 1;


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
    const selectedCountSpan = document.getElementById('selected-count');

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
        const selectedCountSpan = document.getElementById('selected-count');
        const produtoText = document.getElementById('produto-text');

        selectedCountSpan.textContent = count;
        produtoText.textContent = count === 1 ? 'Produto' : 'Produtos';

        document.getElementById('toggleDiv').style.display = count > 0 ? 'block' : 'none';
    }

    function toggleDivVisibility() {
        const anyChecked = selectedCountSpan.textContent > 0;
        document.getElementById('toggleDiv').style.display = anyChecked ? 'block' : 'none';
    }

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
        const uniqueId = 'showDivCheckbox-' + new Date().getTime();
        checkBox.id = uniqueId;
        newCell1.appendChild(checkBox);

        newCell2.textContent = getNextProductNumber();
        newCell3.textContent = codigo;
        newCell4.textContent = chave;
        newCell5.textContent = dataTable();

        const moreOptionsDiv = document.createElement('div');
        moreOptionsDiv.classList.add('more-options');
        moreOptionsDiv.innerHTML = `
            <i class="fa fa-ellipsis-v"></i>
            <div class="dropdown-menu" style="display: none;">
                <a href="#" class="edit-codigo">Editar Código</a>
                <a href="#" class="edit-chave">Editar Chave</a>
                <a href="#" class="delete-option">Excluir</a>
            </div>
        `;
        newCell6.appendChild(moreOptionsDiv);

        // Adicionar eventos para mostrar/ocultar o menu
        moreOptionsDiv.querySelector('.fa-ellipsis-v').addEventListener('click', function () {
            const dropdownMenu = moreOptionsDiv.querySelector('.dropdown-menu');
            dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
        });

        // Adicionar evento para excluir
        moreOptionsDiv.querySelector('.delete-option').addEventListener('click', function () {
            newRow.remove();
            updateProductCount('remove');
            checkCheckboxes();
        });

        // Adicionar evento para editar
        moreOptionsDiv.querySelector('.edit-codigo').addEventListener('click', function () {
            // Lógica de edição
            alert('Editar: ' + codigo);
        });

        moreOptionsDiv.querySelector('.edit-chave').addEventListener('click', function () {
            // Lógica de edição
            alert('Editar: ' + chave);
        });

        productCount++;

        checkBox.addEventListener('change', function () {
            const toggleDiv = document.getElementById('toggleDiv');
            toggleDiv.style.display = this.checked ? 'block' : 'none';
        });

        const avisoIniciado = document.querySelector('.aviso-iniciado');
        if (avisoIniciado) {
            avisoIniciado.style.display = 'none';
        }
    }
    const deleteButton = document.getElementById('deleteSelectedRows');
    const tableBody = document.getElementById('table-body');
    const toggleDiv = document.getElementById('toggleDiv');
    const masterCheckbox = document.getElementById('showDivCheckbox');

    masterCheckbox.addEventListener('change', function () {
        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = this.checked);
        updateDivVisibility();
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

    function updateDivVisibility() {
        const anyChecked = Array.from(tableBody.querySelectorAll('input[type="checkbox"]')).some(checkbox => checkbox.checked);
        toggleDiv.style.display = anyChecked ? 'block' : 'none';
    }

    deleteButton.addEventListener('click', function () {
        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.closest('tr').remove();
                productCount--
                updateProductCount();
            }
        });
        checkCheckboxes();
    });

    checkCheckboxes();
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
    const deleteButton = document.querySelector('.button-excluir-produto-selecionado');
    const popupExcluirProduto = document.getElementById('popup-excluir-produto-container');
    const cancelExcluirButton = document.querySelector('.button-cancel-excluir-produto');
    const closeButtons = document.querySelectorAll('.button-confirm-excluir-produto');
    const deleteProdutoButton = document.getElementById('deleteSelectedRows');

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
        avisoIniciado.style.display = 'flex';
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

        if (tbody.rows.length > 0) {
            btnIniciar.style.display = 'inline-block';
            btnCancelar.style.display = 'none';
            btnFinalizar.style.display = 'none';
            avisoIniciado.style.display = 'none';
            confirmationModal.style.display = 'flex';
        } else {
            alert("Não há dados na tabela para finalizar.");
            confirmationModal.style.display = 'none';
        }

        avisoInicio.style.display = 'none';
        btnIniciar.style.display = 'none';
        btnCancelar.style.display = 'inline';
        btnFinalizar.style.display = 'inline';
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
            popupExcluirProduto.style.display = 'none';
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

    deleteButton.addEventListener('click', function () {
        popupExcluirProduto.style.display = 'block';
    });

    // Esconder o popup quando o botão Cancelar dentro do popup for clicado
    cancelExcluirButton.addEventListener('click', function () {
        popupExcluirProduto.style.display = 'none';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            popupExcluirProduto.style.display = 'none';
        });
    });
});