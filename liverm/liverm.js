function remove_element(elem) {
    var parent = elem.parentNode;
    parent.removeChild(elem);
}

function main() {
    var jrzb = document.getElementById('jrzbwrap');
    remove_element(jrzb);
}

/*
chrome.runtime.sendMessage({ msg: "sgamer_liverm_on" }, function (response) {
    console.log(response.enable);
    if (response.enable) main();
});
*/
main()