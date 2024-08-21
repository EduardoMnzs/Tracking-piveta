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

document.addEventListener('DOMContentLoaded', function() {
    const ellipses = document.querySelectorAll('.fa-ellipsis-v');

    ellipses.forEach(ellipsis => {
        ellipsis.addEventListener('click', function(event) {
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

    window.addEventListener('click', function() {
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

    editCodigo.addEventListener('click', function(e) {
        e.preventDefault();
        const currentId = row.getAttribute('data-id');
        const currentIdentificador = row.querySelector('.identificador-cell').textContent.slice(1);
        const currentResposta = row.querySelector('.response-cell').textContent;
        openQuickResponsePopup(currentIdentificador, currentResposta, currentId);
    });

    deleteOption.addEventListener('click', function(e) {
        e.preventDefault();
        const currentId = row.getAttribute('data-id');

        if (confirm('Tem certeza de que deseja excluir esta resposta?')) {
            fetch('/delete_resposta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: currentId }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Resposta excluída com sucesso!');
                    row.remove();
                } else {
                    alert('Erro ao excluir a resposta: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao excluir a resposta.');
            });
        }
    });

    window.addEventListener('click', function () {
        dropdownMenu.style.display = 'none';
    });
}

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