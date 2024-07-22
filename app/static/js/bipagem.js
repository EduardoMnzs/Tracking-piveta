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

    document.getElementById('input-hora-edição').value = timeString;
    document.getElementById('input-hora-edição-ch').value = timeString;
    document.getElementById('realtime-clock').textContent = timeString;

    setTimeout(updateClock, 1000);
}
updateClock();

function getFormattedDate() {
    const today = new Date();
    let day = today.getDate().toString().padStart(2, '0');
    let month = (today.getMonth() + 1).toString().padStart(2, '0');
    let year = today.getFullYear();

    const dataString = `${day}/${month}/${year}`;

    document.getElementById('input-data-edição').value = dataString;
    document.getElementById('input-data-edição-ch').value = dataString;
    document.getElementById('realdata').textContent = dataString;
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

    document.getElementById('desmarcar-selecao').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default action of the link
        const checkboxes = document.querySelectorAll('#table-body input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
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
            }, 300);
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
                <a href="#" class="delete-option" style="color: red;">Excluir</a>
            </div>
        `;
        newCell6.appendChild(moreOptionsDiv);

        moreOptionsDiv.querySelector('.fa-ellipsis-v').addEventListener('click', function (event) {
            const dropdownMenu = moreOptionsDiv.querySelector('.dropdown-menu');
            const isOpen = dropdownMenu.style.display === 'block';

            document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');

            dropdownMenu.style.display = isOpen ? 'none' : 'block';

            event.stopPropagation();
        });

        document.addEventListener('click', function () {
            document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');
        });

        const popupExcluirProduto = document.getElementById('popup-excluir-produto-container');
        const buttonConfirmExcluirProduto = document.getElementById('deleteSelectedRows');


        moreOptionsDiv.querySelector('.delete-option').addEventListener('click', function (event) {
            popupExcluirProduto.style.display = 'block';

            buttonConfirmExcluirProduto.onclick = function () {
                newRow.remove();
                productCount--;
                if (productCount < 0) productCount = 0;
                updateProductCount();
                checkCheckboxes();
                popupExcluirProduto.style.display = 'none';
            };

            event.stopPropagation();
        });

        document.querySelectorAll('.edit-codigo').forEach(button => {
            button.addEventListener('click', function () {
                const cell = this.closest('tr').querySelector('td:nth-child(3)');
                const codigo = cell.textContent;
                openEditCodigoPopup(codigo, cell);
            });
        });

        document.querySelectorAll('.edit-chave').forEach(button => {
            button.addEventListener('click', function () {
                const cell = this.closest('tr').querySelector('td:nth-child(4)');
                const chave = cell.textContent;
                openEditChavePopup(chave, cell);
            });
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

    function openEditCodigoPopup(value, cell) {
        const popupContainer = document.getElementById('popup-editar-codigo-container');
        const inputField = document.getElementById('input-codigo-edição');
        const buttonConfirm = document.getElementById('button-confirm-edição-codigo');

        if (!popupContainer || !inputField || !buttonConfirm) {
            console.error(`Elementos do popup de edição código não encontrados.`);
            return;
        }

        inputField.value = value;
        popupContainer.classList.add('fade-in');
        popupContainer.style.display = 'block';

        buttonConfirm.onclick = function () {
            const newValue = inputField.value.trim();
            if (newValue !== '' && /^\d+$/.test(newValue)) {
                cell.textContent = newValue;
                closeEditPopup('codigo');
                popupCodigoEditado();
            } else {
                popupApenasNumeros();
            }
        };
    }

    function popupChaveEditada() {
        const popup = document.getElementById('operação-chave-editada-produto-popup');
        popup.style.display = 'flex';
        popup.classList.remove('fade-out');
        setTimeout(function () {
            popup.classList.add('fade-out');
            setTimeout(function () {
                popup.style.display = 'none';
            }, 500);
        }, 3000);
    }

    function popupCodigoEditado() {
        const popup = document.getElementById('operação-codigo-editado-produto-popup');
        popup.style.display = 'flex';
        popup.classList.remove('fade-out');
        setTimeout(function () {
            popup.classList.add('fade-out');
            setTimeout(function () {
                popup.style.display = 'none';
            }, 500);
        }, 3000);
    }

    function popupApenasNumeros() {
        const popup = document.getElementById('apenas-numeros-popup');
        popup.style.display = 'flex';
        popup.classList.remove('fade-out');
        setTimeout(function () {
            popup.classList.add('fade-out');
            setTimeout(function () {
                popup.style.display = 'none';
            }, 500);
        }, 3000);
    }

    function openEditChavePopup(value, cell) {
        const popupContainer = document.getElementById('popup-editar-chave-container');
        const inputField = document.getElementById('input-chave-edição');
        const buttonConfirm = document.getElementById('button-confirm-edição-chave');

        if (!popupContainer || !inputField || !buttonConfirm) {
            console.error(`Elementos do popup de edição chave não encontrados.`);
            return;
        }

        inputField.value = value;
        popupContainer.classList.add('fade-in');
        popupContainer.style.display = 'block';

        buttonConfirm.onclick = function () {
            const newValue = inputField.value.trim();
            if (newValue !== '' && /^\d+$/.test(newValue)) {
                cell.textContent = newValue;
                closeEditPopup('chave');
                popupChaveEditada();
            } else {
                popupApenasNumeros();
            }
        };
    }

    function closeEditPopup(type) {
        const popupContainer = document.getElementById(`popup-editar-${type}-container`);
        if (popupContainer) {
            popupContainer.classList.remove('fade-in');
            popupContainer.classList.add('fade-out');
            setTimeout(() => {
                popupContainer.style.display = 'none';
                popupContainer.classList.remove('fade-out');
            }, 500);
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
                productCount--;
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
    const popupIniciado = document.getElementById('operação-iniciada-popup');
    const popupExcluirOperacao = document.getElementById('operação-excluir-popup');
    const popupExcluirProdutoFeedback = document.getElementById('operação-excluir-produto-popup');
    const popupFinalizarOperacao = document.getElementById('operação-finalizar-popup');
    const popupEditarCodigo = document.getElementById('popup-editar-codigo-container');
    const btnCancelarEdição = document.getElementById('button-cancel-edição-código');
    const popupEditarChave = document.getElementById('popup-editar-chave-container');
    const btnCancelarEdiçãoChave = document.getElementById('button-cancel-edição-chave');
    const popupTabelaVaziaStyle = document.getElementById('tabela-vazia-popup');


    function popupOperacaoIniciada() {
        const popup = document.getElementById('operação-iniciada-popup');
        popup.style.display = 'flex';
        popup.classList.remove('fade-out');
        setTimeout(function () {
            popup.classList.add('fade-out');
            setTimeout(function () {
                popup.style.display = 'none';
            }, 500);
        }, 3000);
    }

    function popupOperacaoExcluida() {
        const popup = document.getElementById('operação-excluir-popup');
        popup.style.display = 'flex';
        popup.classList.remove('fade-out');
        setTimeout(function () {
            popup.classList.add('fade-out');
            setTimeout(function () {
                popup.style.display = 'none';
            }, 500);
        }, 3000);
    }

    function popupOperacaoProdutoExcluido() {
        const popup = document.getElementById('operação-excluir-produto-popup');
        popup.style.display = 'flex';
        popup.classList.remove('fade-out');
        setTimeout(function () {
            popup.classList.add('fade-out');
            setTimeout(function () {
                popup.style.display = 'none';
            }, 500);
        }, 3000);
    }

    function popupOperacaoFinalizada() {
        const popup = document.getElementById('operação-finalizar-popup');
        popup.style.display = 'flex';
        popup.classList.remove('fade-out');
        setTimeout(function () {
            popup.classList.add('fade-out');
            setTimeout(function () {
                popup.style.display = 'none';
            }, 500);
        }, 3000);
    }

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
            }, 100);
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
        popupOperacaoIniciada();
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
        popupOperacaoExcluida();
    }

    function popupTabelaVazia() {
        const popup = document.getElementById('tabela-vazia-popup');
        popup.style.display = 'flex';
        popup.classList.remove('fade-out');
        setTimeout(function () {
            popup.classList.add('fade-out');
            setTimeout(function () {
                popup.style.display = 'none';
            }, 500);
        }, 3000);
    }

    btnFinalizar.onclick = function () {

        if (tbody.rows.length > 0) {
            btnIniciar.style.display = 'inline-block';
            btnCancelar.style.display = 'none';
            btnFinalizar.style.display = 'none';
            avisoIniciado.style.display = 'none';
            confirmationModal.style.display = 'flex';
        } else {
            popupTabelaVazia();
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
        popupOperacaoFinalizada();
    };

    btnCancelarEdição.onclick = function () {
        popupEditarCodigo.style.display = 'none';
    };

    btnCancelarEdiçãoChave.onclick = function () {
        popupEditarChave.style.display = 'none';
    };

    document.querySelectorAll('.close-button-confirm').forEach(button => {
        button.onclick = function () {
            popupEditarCodigo.style.display = 'none'
            popupFinalizarOperacao.style.display = 'none';
            popupExcluirProdutoFeedback.style.display = 'none';
            popupIniciado.style.display = 'none';
            confirmationCancelModal.style.display = 'none';
            confirmationModal.style.display = 'none';
            loadingPopup.style.display = 'none';
            finalizadoPopup.style.display = 'none';
            popupExcluirProduto.style.display = 'none';
            popupExcluirOperacao.style.display = 'none';
            popupEditarChave.style.display = 'none';
            popupTabelaVaziaStyle.style.display = 'none';
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
            popupOperacaoFinalizada();
        };
    });

    codigoProdutoInput.addEventListener('input', function () {
        chaveProdutoInput.disabled = !codigoProdutoInput.value.trim();
    });

    deleteButton.addEventListener('click', function () {
        popupExcluirProduto.style.display = 'block';
    });

    cancelExcluirButton.addEventListener('click', function () {
        popupExcluirProduto.style.display = 'none';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            popupOperacaoProdutoExcluido();
            popupExcluirProduto.style.display = 'none';
        });
    });
});