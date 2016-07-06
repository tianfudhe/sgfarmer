var exton = true;

function enableExtension(signal) {
    exton = signal;
}

function toogle_jrzb() {
    var btn = document.getElementById('jrzb_button');
    if (btn.textContent == "开") {
        btn.textContent = "关";
        enableExtension(false);
    } else {
        btn.textContent = "开";
        enableExtension(true);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('jrzb_button');
    // onClick's logic below:
    btn.addEventListener('click', toogle_jrzb);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg == "sgamer_liverm_on") {
        sendResponse({ enable: exton });
        return true;
    }
});