let check_button = document.querySelector('.check');
check_button.addEventListener( "click" , switchMode);

function switchMode() {
    if (check_button.checked) { //Day mode
        document.body.style.background = "linear-gradient(-45deg, #95DEE3, #BFD641, #EFC050, #E15D44, #E94B3C)";
        document.querySelector('.box').style.background = "#ebebebb9";
        document.querySelector('.label').style.color = "black";
        document.querySelector('#username').style.color = "black";
        document.querySelector('#login').style.color = "black";
    } else {
        document.body.style.background = "linear-gradient(-45deg, #348b3b, #578CA9, #34568B, #6C244C, #6c2424)";
        document.querySelector('.box').style.background = "#191919b9";
        document.querySelector('.label').style.color = "white";
        document.querySelector('#username').style.color = "white";
        document.querySelector('#login').style.color = "white";
    }
    document.body.style.backgroundSize = "450% 450%";
}

function start() {
    console.log("aloha");
    sessionStorage.clear;
    if (localStorage.getItem("players")) {
        localStorage.setItem("players", JSON.stringify([]));
        console.log("initial players array");
    }
    var username = document.querySelector('#username');
    if (/\W+/.test(username.value)) {      
        username.style.border = "3px solid #db3434";
        return;
    }
    sessionStorage.setItem('username', username.value);
    sessionStorage.setItem('background', document.body.style.background.toString())
    console.log(sessionStorage.getItem('username'));
//     document.location.href = "level_1.html";
}

function isEmpty(str) {
    return str.trim() == "";
}
