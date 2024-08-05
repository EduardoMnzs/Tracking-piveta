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