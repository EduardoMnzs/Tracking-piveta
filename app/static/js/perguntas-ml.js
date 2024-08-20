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
    // Seleciona todos os ícones de elipse
    const ellipses = document.querySelectorAll('.fa-ellipsis-v');

    // Adiciona um listener de clique a cada ícone
    ellipses.forEach(ellipsis => {
        ellipsis.addEventListener('click', function(event) {
            // Obtém o menu dropdown correspondente
            const dropdown = this.nextElementSibling;

            // Fecha todos os outros menus
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.style.display = 'none';
                }
            });

            // Alterna a exibição do menu atual
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';

            // Previne que o clique feche o menu imediatamente
            event.stopPropagation();
        });
    });

    // Fecha o menu dropdown se clicar fora dele
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