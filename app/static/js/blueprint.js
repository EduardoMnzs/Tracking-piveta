function waitForElm(e) { return new Promise(t => { if (document.querySelector(e)) return t(document.querySelector(e)); let r = new MutationObserver(c => { document.querySelector(e) && (r.disconnect(), t(document.querySelector(e))) }); r.observe(document.body, { childList: !0, subtree: !0 }) }) }
var path = window.location.href.split("/")[3].replace(/^.*?(?=\?)/gm, "");
waitForElm(`.nav-${path}`).then(e => e.classList.add("active"));

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

var path = window.location.href.split("/")[3].replace(/^.*?(?=\?)/gm, "");
waitForElm(`.nav-${path}`).then(e => e.classList.add("active"));

function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.display === "none" || sidebar.style.display === "") {
        sidebar.style.display = "block";
    } else {
        sidebar.style.display = "none";
    }
}

document.addEventListener('click', function(event) {
    var sidebar = document.getElementById("sidebar");
    var toggle = document.querySelector('.menu-toggle');
    if (!sidebar.contains(event.target) && !toggle.contains(event.target)) {
        sidebar.style.display = "none";
    }
});

function toggleChat() {
    var chatWindow = document.getElementById('chat-window');
    if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
        chatWindow.style.display = 'flex';
    } else {
        chatWindow.style.display = 'none';
    }
}

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    const chatBox = document.getElementById('chat-box');
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);

    setTimeout(function() {
        userMessage.classList.add('show');
    }, 10);

    document.getElementById('user-input').value = '';

    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userInput }),
    });

    const data = await response.json();
    let botResponse = data.response;

    botResponse = botResponse
        .replace(/\n/g, '<br>')
        .replace(/(\*\*)(.*?)\1/g, '<strong>$2</strong>')
        .replace(/(\*)(.*?)\1/g, '<em>$2</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');

    const botMessage = document.createElement('div');
    botMessage.className = 'chat-message bot-message';
    botMessage.innerHTML = botResponse;
    chatBox.appendChild(botMessage);

    setTimeout(function() {
        botMessage.classList.add('show');
    }, 10);
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

function toggleChat() {
    var chatWindow = document.getElementById('chat-window');
    if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
        chatWindow.style.display = 'flex';
        setTimeout(function() {
            chatWindow.classList.add('open');
        }, 10);
    } else {
        chatWindow.classList.remove('open');
        setTimeout(function() {
            chatWindow.style.display = 'none';
        }, 300);
    }
}