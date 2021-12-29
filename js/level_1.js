let username = sessionStorage.getItem('username');
let background = sessionStorage.getItem('background');
let timerSeconds = document.querySelector('.timer_seconds');
let fragments;
let fragmentBox = document.querySelector('#fragments_box')
let cells = document.querySelectorAll('.js_cell');
let progressBar = document.querySelector('.progress');
let progressLabel = document.querySelector('.progress_label');
let matchIndicators = document.querySelectorAll('.js_indicator');
let pattern = document.querySelector('#pattern');

let allPlayers = [];
let reqSegments = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
let avlSegments = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let hrono = 40;
let offset = 0;
let recalculate = false;
let patternName;
let passed = false;

let fragment;
let timerId; 

function foo() {
    definePattern();
    fragments = document.querySelectorAll('.js_fragment');
    console.log(username);
    console.log(sessionStorage.getItem('username'));
    document.body.style.background = background;
    // console.log(background);
    document.querySelector('#username').innerHTML = username;  
    timerId = setInterval(timer, 1000);
    dragAndDrop();
    rating(JSON.parse(localStorage.getItem("players")));
    // console.log(matchIndicators[1].classList)
    // console.log(fragments);
}

function timer() {
    if (hrono <= 0) {
        document.querySelector('.level').style.pointerEvents = "none";
        showResult();
    } else {
        hrono -= 1;
        timerSeconds.textContent = hrono < 10 ? "00:0" + hrono : "00:" + hrono;
    }
}

const dragAndDrop = () => {

    const dragStart = function() {
        setTimeout(() => {
            this.classList.add('hide');
        }, 0)
        fragment = this;
        recalculate = setOffset(this.parentNode.id);
        console.log(this.parentNode.id);
    };
    const dragEnd = function() {
        this.classList.remove('hide');
    }

    const dragOver = function(evt) {
        evt.preventDefault();
        this.style["boxShadow"] = "0 0 15px #50c8c6da";    
    }

    const dragEnter = function(evt) {
        evt.preventDefault();
        this.style["boxShadow"] = "none"; 
    }

    const dragLeave = function() {
        this.style["boxShadow"] = "none"; 
    }

    const dragDrop = function() {
        if (this.id === fragment.parentNode.id) {
            console.log("to and from equal")
            this.style["boxShadow"] = "none"; 
            this.append(fragment);
            return;
        }
        this.style["boxShadow"] = "none"; 
        this.append(fragment);
        console.log("recalculate is " + recalculate);
        if (recalculate) {
            count(-1);
        }
        if (setOffset(this.id)) {
            console.log("добавление")
            count(1);
        } else if (!recalculate) {
            console.log("пересчет")
            count(-1);
        }
        if (checkMatch()) {
            passed = true;
            document.querySelector('.level').style.pointerEvents = "none";
            clearInterval(timerId);
            progressBar.classList.add('progress_appear');
            progressLabel.classList.add('label_appear');
            document.querySelector('#pattern_name').innerHTML = patternName;
            document.querySelector('#pattern_name').style.background = "#2BFF90";
            document.querySelector('#pattern_name').style.color = "#1F3E46";
            timerId = setTimeout(showResult, 2000);
        }
    }

    cells.forEach(element => {
        element.addEventListener('dragover', dragOver);
        element.addEventListener('dragenter', dragEnter);
        element.addEventListener('dragleave', dragLeave);
        element.addEventListener('drop', dragDrop);
    })

    fragments.forEach(element => {
        element.addEventListener('dragstart', dragStart);
        element.addEventListener('dragend', dragEnd);
    });
}

function showResult() {
    document.querySelector('#score').innerHTML = hrono * 121;
    clearTimeout(timerId);
    slideLeft();
}

function setOffset(id) {
    switch (id) {
        case "match_1":
        case "match_4":
            offset = 0;
            break;
        case "match_2":
        case "match_5":
            offset = 4;
            break;
        case "match_3":
        case "match_6":
            offset = 8;
            break;
        default:
            return false;
    }
    return true;
}

function count(inc) {
    switch (fragment.src.split('/').pop()) {
        case "fr_1.svg":
            avlSegments[offset + 0] += inc;
            avlSegments[offset + 2] += inc;
            break;
        case "fr_2.svg":
            avlSegments[offset + 0] += inc;
            break;
        case "fr_3.svg":
            avlSegments[offset + 0] += inc;
            avlSegments[offset + 1] += inc;
            avlSegments[offset + 2] += inc;
            avlSegments[offset + 3] += inc;
            break;
        case "fr_4.svg":
            avlSegments[offset + 0] += inc;
            avlSegments[offset + 1] += inc;
            avlSegments[offset + 2] += inc;
            break;
        case "fr_5.svg":
            avlSegments[offset + 1] += inc;
            avlSegments[offset + 2] += inc;
            break;
        case "fr_6.svg":
            avlSegments[offset + 3] += inc;
            break;
        case "fr_7.svg":
            avlSegments[offset + 2] += inc;
            avlSegments[offset + 3] += inc;
            break;
        case "fr_8.svg":
            avlSegments[offset + 1] += inc;
            avlSegments[offset + 2] += inc;
            avlSegments[offset + 3] += inc;
            break;
        case "fr_9.svg":
            avlSegments[offset + 0] += inc;
            avlSegments[offset + 1] += inc;
            break;
        case "fr_10.svg":
            avlSegments[offset + 1] += inc;
            avlSegments[offset + 3] += inc;
            break;
        default:
            break;
    }
    console.log(fragment.src.split('/').pop());
    console.log(offset);
    console.log(inc);
    console.log(avlSegments);
}

function checkMatch() {
    var result = true;
    for (let i = 0; i < 12; i++) {
        if (reqSegments[i] != avlSegments[i]) {
            matchIndicators[i].classList.remove('match_appear');
            if (avlSegments[i] > 0) {
                matchIndicators[i].classList.add('wrong_match');
            } else {
                matchIndicators[i].classList.remove('wrong_match');
            }
            result = false;
        } else {
            matchIndicators[i].classList.remove('wrong_match');
            console.log()
            if (reqSegments[i] > 0) { 
                matchIndicators[i].classList.add('match_appear');
            }
        }
    }
    return result;
}

function definePattern() {
    switch (getRandomInRange(0, 2)) {
        case 0:
            pattern.src = "svg/pat_1.svg"
            reqSegments = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            patternName = "Polydimethylsiloxane";
            document.querySelector('#pattern_number').innerHTML = "T37"
            defineFragments(0);
            break;
        case 1:
            pattern.src = "svg/pat_2.svg"
            reqSegments = [1, 1, 0, 1, 1, 1, 2, 1, 1, 0, 1, 1];
            patternName = "5-Dimethylythiazol";
            document.querySelector('#pattern_number').innerHTML = "CO6"
            defineFragments(1);
            break;
        case 2:
            pattern.src = "svg/pat_3.svg"
            reqSegments = [0, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 0];
            patternName = "Carbon Nanotube";
            document.querySelector('#pattern_number').innerHTML = "P12"
            defineFragments(2);
            break;
        default:
            pattern.src = "svg/pat_1.svg"
            reqSegments = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            patternName = "Polydimethylsiloxane";
            defineFragments(0);
            break;
    }
}

function defineFragments(pat) {
    switch (pat) {
        case 0:
            fragmentBox.appendChild(createImg("svg/fr_9.svg"));
            fragmentBox.appendChild(createImg("svg/fr_2.svg"));
            fragmentBox.appendChild(createImg("svg/fr_3.svg"));
            fragmentBox.appendChild(createImg("svg/fr_4.svg"));
            fragmentBox.appendChild(createImg("svg/fr_5.svg"));
            fragmentBox.appendChild(createImg("svg/fr_6.svg"));
            fragmentBox.appendChild(createImg("svg/fr_7.svg"));
            fragmentBox.appendChild(createImg("svg/fr_8.svg"));
            break;
        case 1:
            fragmentBox.appendChild(createImg("svg/fr_9.svg"));
            fragmentBox.appendChild(createImg("svg/fr_2.svg"));
            fragmentBox.appendChild(createImg("svg/fr_1.svg"));
            fragmentBox.appendChild(createImg("svg/fr_10.svg"));
            fragmentBox.appendChild(createImg("svg/fr_5.svg"));
            fragmentBox.appendChild(createImg("svg/fr_6.svg"));
            fragmentBox.appendChild(createImg("svg/fr_7.svg"));
            fragmentBox.appendChild(createImg("svg/fr_8.svg"));
            break;
        case 2:
            fragmentBox.appendChild(createImg("svg/fr_9.svg"));
            fragmentBox.appendChild(createImg("svg/fr_2.svg"));
            fragmentBox.appendChild(createImg("svg/fr_3.svg"));
            fragmentBox.appendChild(createImg("svg/fr_4.svg"));
            fragmentBox.appendChild(createImg("svg/fr_1.svg"));
            fragmentBox.appendChild(createImg("svg/fr_10.svg"));
            fragmentBox.appendChild(createImg("svg/fr_7.svg"));
            fragmentBox.appendChild(createImg("svg/fr_8.svg"));
            break;
    }
}

function createImg(src) {
    var img = document.createElement('img');
    img.src = src;
    img.className = "js_fragment";
    return img;
}

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


let tutorial = document.querySelector('.tutorial');
let results = document.querySelector('.result');

function slideLeft() {
    document.querySelector('.result_menu').style.cursor = "unset";
    // slideBack(tutorial, "-1030px");
    results.classList.add('result_show');
    // slideBack(1);
}

function slideRight() {
    document.querySelector('.tutorial_text').style.cursor = "unset";
    // slideBack(results, "1500px");
    tutorial.classList.add('tutorial_show');
    // slideBack(-1);
}

function slideBack(side) {
    if (side > 0) {
        tutorial.classList.remove('tutorial_show');
        document.querySelector('.tutorial_text').style.cursor = "pointer";
    } else {
        document.querySelector('.result_menu').style.cursor = "pointer";
        results.classList.remove('result_show');
    }
}

function rating(players) {
    removeAllChild(document.querySelector(".rating"));
    addPlayers(players.sort((a, b) => {
        return parseInt(b.split(" ").pop()) - parseInt(a.split(" ").pop())
    }).slice(0, 5));
}

function addPlayers(players) {
    players.forEach(element => {
        var li = document.createElement("li");
        li.innerHTML = element;
        document.querySelector('.rating').appendChild(li);
    });
}

function nextLevel() {
    document.location.href = "level_2.html";
}

function saveResult() {
    if (!passed) {
        hrono = 0;
    }
    var players = JSON.parse(localStorage.getItem("players"));
    console.log(players);
    players.push(username + " " + hrono * 121);
    console.log(players);
    localStorage.setItem("players", JSON.stringify(players));
    rating(players);
}

function downloadResults() {
    var blob = new Blob([localStorage.getItem("players")], {type: "text"});
    var link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "All_results_" + Date.now());
    link.click();
    console.log("download");
}

function restart() {
    document.location.href = "level_1.html";
}

function deleteResults() {
    localStorage.setItem("players", JSON.stringify([]));
    removeAllChild(document.querySelector(".rating"));
}

function removeAllChild(root) {
    while( root.firstChild ){
        root.removeChild( root.firstChild );
    }
}