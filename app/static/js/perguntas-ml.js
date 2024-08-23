const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.getElementById(tab.getAttribute('data-tab'));

        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(content => content.style.display = 'none');

        tab.classList.add('active');
        target.style.display = 'block';
    });
});

document.querySelectorAll('.input-resposta').forEach((input, index) => {
    const inputResposta = document.getElementById('inputResposta');
    const btnResponder = document.querySelectorAll('.btn-responder')[index];
    const charCount = document.querySelectorAll('.char-count')[index];

    input.addEventListener('input', function () {
        charCount.textContent = `${input.value.length} / 2000`;

        if (input.value.trim() !== "") {
            btnResponder.disabled = false;
        } else {
            btnResponder.disabled = true;
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {

    const popupRespostaEnviada = document.getElementById('resposta-enviada-popup-container');

    document.querySelectorAll('.input-resposta').forEach(input => {
        const button = input.closest('.question').querySelector('.btn-responder');
        const charCount = input.nextElementSibling.querySelector('.char-count');

        input.addEventListener('input', function () {
            charCount.textContent = `${input.value.length} / 2000`;
            button.disabled = !input.value.trim();
        });
    });

    function RespostaEnviada() {
        const popup = document.getElementById('resposta-enviada-popup');
        popup.style.display = 'flex';
        popup.classList.remove('fade-out');
        setTimeout(function () {
            popup.classList.add('fade-out');
            setTimeout(function () {
                popup.style.display = 'none';
            }, 500);
        }, 3000);
    }

    document.querySelectorAll('.btn-responder').forEach(button => {
        button.addEventListener('click', function () {
            var input = this.closest('.question').querySelector('.input-resposta');
            var text = input.value.trim();
            var questionId = this.getAttribute('data-question-id');

            fetch('/enviar-resposta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question_id: questionId,
                    text: text
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert('Erro ao enviar resposta: ' + data.error);
                    } else {
                        RespostaEnviada();
                        input.value = '';
                        this.disabled = true;
                        input.closest('.question-footer').innerHTML = '<div class="pergunta-respondida"><p>Resposta: ' + text + '</p><i class="fa fa-check-circle-o" aria-hidden="true"></i></div>';
                    }
                })
                .catch(error => {
                    console.error('Erro ao enviar resposta:', error);
                    alert('Erro ao enviar resposta: ' + error.message);
                });
        });
    });

    document.querySelectorAll('.close-button-confirm').forEach(button => {
        button.onclick = function () {
            popupRespostaEnviada.style.display = 'none'
        };
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const ellipses = document.querySelectorAll('.fa-ellipsis-v');

    ellipses.forEach(ellipsis => {
        ellipsis.addEventListener('click', function (event) {
            const dropdown = this.nextElementSibling;

            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.style.display = 'none';
                }
            });

            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';

            event.stopPropagation();
        });
    });

    window.addEventListener('click', function () {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    });
});

function openPopup() {
    document.getElementById('quick-responses-popup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('quick-responses-popup').style.display = 'none';
}

document.getElementById('save-response').addEventListener('click', function () {
    const hashtagInput = document.querySelector('.input-hashtag');
    const responseInput = document.querySelector('.input-response');
    const identificador = hashtagInput.value.trim();
    const resposta = responseInput.value.trim();

    if (identificador && resposta) {
        fetch('/add_resposta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identificador, resposta }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Resposta salva com sucesso!');

                    const tableBody = document.getElementById('table-body');
                    const newRow = createTableRow(data.id, identificador, resposta);
                    tableBody.appendChild(newRow);

                    hashtagInput.value = '';
                    responseInput.value = '';

                    updateResponseCount();

                } else {
                    alert('Erro ao salvar a resposta: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao salvar a resposta.');
            });
    } else {
        alert('Por favor, preencha ambos os campos.');
    }
});

function createTableRow(id, identificador, resposta) {
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-id', id);
    newRow.setAttribute('id', `row-${id}`);

    const checkboxCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkboxCell.appendChild(checkbox);

    const identificadorCell = document.createElement('td');
    identificadorCell.className = 'identificador-cell';
    identificadorCell.textContent = `#${identificador}`;

    const respostaCell = document.createElement('td');
    respostaCell.className = 'response-cell';
    respostaCell.textContent = resposta;

    const actionCell = document.createElement('td');
    actionCell.style.position = 'relative';
    const ellipsisIcon = document.createElement('i');
    ellipsisIcon.className = 'fa fa-ellipsis-v';
    ellipsisIcon.style.cursor = 'pointer';

    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'dropdown-menu';
    dropdownMenu.style.display = 'none';

    const editCodigo = document.createElement('a');
    editCodigo.href = '#';
    editCodigo.className = 'edit-codigo';
    editCodigo.textContent = 'Editar resposta';

    const deleteOption = document.createElement('a');
    deleteOption.href = '#';
    deleteOption.className = 'delete-option';
    deleteOption.textContent = 'Excluir';
    deleteOption.style.color = 'red';

    dropdownMenu.appendChild(editCodigo);
    dropdownMenu.appendChild(deleteOption);

    actionCell.appendChild(ellipsisIcon);
    actionCell.appendChild(dropdownMenu);

    newRow.appendChild(checkboxCell);
    newRow.appendChild(identificadorCell);
    newRow.appendChild(respostaCell);
    newRow.appendChild(actionCell);

    setupDropdownAndActions(ellipsisIcon, dropdownMenu, newRow);

    return newRow;
}

let currentDeleteId = null;
let currentDeleteRow = null;

function setupDropdownAndActions(ellipsisIcon, dropdownMenu, row) {
    ellipsisIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu !== dropdownMenu) {
                menu.style.display = 'none';
            }
        });
        dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
    });

    const editCodigo = dropdownMenu.querySelector('.edit-codigo');
    const deleteOption = dropdownMenu.querySelector('.delete-option');

    editCodigo.addEventListener('click', function (e) {
        e.preventDefault();
        const currentId = row.getAttribute('data-id');
        const currentIdentificador = row.querySelector('.identificador-cell').textContent.slice(1);
        const currentResposta = row.querySelector('.response-cell').textContent;
        openQuickResponsePopup(currentIdentificador, currentResposta, currentId);
    });

    deleteOption.addEventListener('click', function (e) {
        e.preventDefault();
        currentDeleteId = row.getAttribute('data-id');
        currentDeleteRow = row;
        openDeletePopup();
    });

    window.addEventListener('click', function () {
        dropdownMenu.style.display = 'none';
    });
}

function openDeletePopup() {
    document.getElementById('delete-response-popup').style.display = 'flex';
}

function closeDeletePopup() {
    document.getElementById('delete-response-popup').style.display = 'none';
}

function confirmDeleteResponse() {
    if (currentDeleteId) {
        fetch('/delete_resposta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: currentDeleteId }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Resposta excluída com sucesso!');
                    currentDeleteRow.remove();
                    closeDeletePopup();

                    updateResponseCount();
                } else {
                    alert('Erro ao excluir a resposta: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao excluir a resposta.');
            });
    }
}

document.getElementById('confirm-delete-btn').addEventListener('click', confirmDeleteResponse);

document.querySelectorAll('#table-body tr').forEach(row => {
    const ellipsisIcon = row.querySelector('.fa-ellipsis-v');
    const dropdownMenu = row.querySelector('.dropdown-menu');
    setupDropdownAndActions(ellipsisIcon, dropdownMenu, row);
});

function openQuickResponsePopup(identificador, resposta, rowId) {
    currentEditingId = rowId;
    document.getElementById('custom-identificador').value = identificador;
    document.getElementById('custom-conteudo-resposta').value = resposta;
    document.getElementById('quick-response-popup').style.display = 'flex';
}

function closeQuickResponsePopup() {
    document.getElementById('quick-response-popup').style.display = 'none';
}

function saveQuickResponse() {
    const novaResposta = document.getElementById('custom-conteudo-resposta').value;

    if (currentEditingId) {
        fetch('/update_resposta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: currentEditingId, resposta: novaResposta }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Resposta atualizada com sucesso!');
                    document.querySelector(`#row-${currentEditingId} .response-cell`).textContent = novaResposta;
                    closeQuickResponsePopup();
                } else {
                    alert('Erro ao atualizar a resposta: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao atualizar a resposta.');
            });
    } else {
        alert('Erro: Nenhuma resposta está sendo editada.');
    }
}

document.querySelectorAll('.menu-container .fa-ellipsis-v').forEach(icon => {
    const dropdownMenu = icon.nextElementSibling;
    const row = icon.closest('tr');
    setupDropdownAndActions(icon, dropdownMenu, row);
});

function updateResponseCount() {
    const tableBody = document.getElementById('table-body');
    const responseCount = tableBody.querySelectorAll('tr').length;
    document.querySelector('.quantidade-resposta').textContent = responseCount;
}

document.addEventListener('DOMContentLoaded', function () {
    updateResponseCount();
});

document.getElementById('save-response').addEventListener('click', function () {
    updateResponseCount();
});

function confirmDeleteResponse() {
    if (currentDeleteId) {
        fetch('/delete_resposta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: currentDeleteId }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Resposta excluída com sucesso!');
                    currentDeleteRow.remove();
                    closeDeletePopup();

                    updateResponseCount();
                } else {
                    alert('Erro ao excluir a resposta: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao excluir a resposta.');
            });
    }
}

document.getElementById('delete-selected').addEventListener('click', function () {
    const selectedRows = document.querySelectorAll('#table-body tr input[type="checkbox"]:checked');
    const idsToDelete = [];
    const rowsToDelete = [];

    selectedRows.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const rowId = row.getAttribute('data-id');
        if (rowId) {
            idsToDelete.push(rowId);
            rowsToDelete.push(row);
        }
    });

    if (idsToDelete.length > 0) {
        if (confirm(`Tem certeza de que deseja excluir as ${idsToDelete.length} respostas selecionadas?`)) {
            let deleteCount = 0;
            idsToDelete.forEach((id, index) => {
                fetch('/delete_resposta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            deleteCount++;
                            rowsToDelete[index].remove();
                        } else {
                            alert('Erro ao excluir a resposta: ' + data.message);
                        }

                        if (deleteCount === idsToDelete.length) {
                            updateResponseCount();
                        }
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                        alert('Erro ao excluir a resposta.');
                    });
            });
        }
    } else {
        alert('Por favor, selecione pelo menos uma resposta para excluir.');
    }
});

document.getElementById('select-all').addEventListener('change', function () {
    const checkboxes = document.querySelectorAll('#table-body tr input[type="checkbox"]');
    const selectAllChecked = this.checked;

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllChecked;
    });
});

let quickResponses = [];

function fetchQuickResponses() {
    fetch('/get_quick_responses')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                quickResponses = data.data;
            } else {
                console.error('Erro ao buscar respostas rápidas:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar respostas rápidas:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchQuickResponses();

    document.querySelectorAll('.input-resposta').forEach(inputField => {
        inputField.addEventListener('input', function () {
            const input = this.value;
            const suggestionsContainer = this.nextElementSibling.nextElementSibling;

            if (input.includes('#')) {
                const query = input.split('#').pop().trim().toLowerCase();

                const filteredSuggestions = quickResponses.filter(response =>
                    response.identificador.toLowerCase().startsWith(query)
                );

                if (filteredSuggestions.length > 0) {
                    suggestionsContainer.innerHTML = '';
                    filteredSuggestions.forEach(suggestion => {
                        const suggestionElement = document.createElement('div');
                        suggestionElement.textContent = `#${suggestion.identificador}: ${suggestion.resposta}`;

                        suggestionElement.addEventListener('click', function () {
                            inputField.value = suggestion.resposta;
                            suggestionsContainer.style.display = 'none';
                        });

                        suggestionsContainer.appendChild(suggestionElement);
                    });
                    suggestionsContainer.style.display = 'block';
                } else {
                    suggestionsContainer.style.display = 'none';
                }
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });
    });
});

window.addEventListener('click', function () {
    document.querySelectorAll('.suggestions-container').forEach(container => {
        container.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Função para configurar sugestões de respostas rápidas e contador de caracteres
    function setupInputFeatures(inputElement, suggestionsContainer, charCountElement, submitButton) {
        inputElement.addEventListener('input', function() {
            const value = this.value;

            // Atualiza o contador de caracteres
            updateCharCount(value, charCountElement);

            // Habilita ou desabilita o botão de resposta baseado no conteúdo do input
            submitButton.disabled = value.trim() === '';

            if (value.startsWith('#')) {
                fetchSuggestions(value, suggestionsContainer);
            } else {
                clearSuggestions(suggestionsContainer);
            }
        });

        function fetchSuggestions(query, container) {
            fetch(`/get_suggestions?query=${query}`)
                .then(response => response.json())
                .then(suggestions => {
                    displaySuggestions(suggestions, container, inputElement);
                })
                .catch(error => {
                    console.error('Erro ao buscar sugestões:', error);
                });
        }

        function displaySuggestions(suggestions, container, inputElement) {
            container.innerHTML = '';
            suggestions.forEach(suggestion => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.textContent = `#${suggestion.identificador}: ${suggestion.resposta}`;
                suggestionItem.addEventListener('click', function() {
                    inputElement.value = suggestion.resposta;  // Insere apenas a resposta no input
                    clearSuggestions(container);  // Limpa as sugestões após selecionar
                    updateCharCount(inputElement.value, charCountElement);  // Atualiza o contador após seleção
                    submitButton.disabled = inputElement.value.trim() === '';  // Atualiza o estado do botão
                });
                container.appendChild(suggestionItem);
            });
            container.style.display = 'block';
        }

        function clearSuggestions(container) {
            container.innerHTML = '';
            container.style.display = 'none';
        }

        function updateCharCount(value, charCountElement) {
            charCountElement.textContent = `${value.length} / 2000`;
        }

        // Clique fora da caixa de sugestões para fechá-la
        document.addEventListener('click', function(event) {
            if (!inputElement.contains(event.target) && !suggestionsContainer.contains(event.target)) {
                clearSuggestions(suggestionsContainer);
            }
        });
    }

    // Configurar todos os campos de entrada e contêineres de sugestões
    document.querySelectorAll('.question-input-container').forEach(container => {
        const inputElement = container.querySelector('.input-resposta');
        const suggestionsContainer = container.querySelector('.suggestions-container');
        const charCountElement = container.querySelector('.char-count');
        const submitButton = container.closest('.question-footer').querySelector('.btn-responder');
        setupInputFeatures(inputElement, suggestionsContainer, charCountElement, submitButton);
    });

    // Adiciona a # ao clicar em "Respostas rápidas"
    document.querySelectorAll('.resposta-rapida').forEach(button => {
        button.addEventListener('click', function() {
            const inputElement = this.closest('.question').querySelector('.input-resposta');
            inputElement.value = '#';
            inputElement.focus();  // Move o foco para o campo de input
            inputElement.dispatchEvent(new Event('input'));  // Simula a entrada de texto para acionar as sugestões
        });
    });
});