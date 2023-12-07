let lastScrolled, wpm, position = 0, LINE_HEIGHT;
const WORDS_PER_LINE=13.3;

function time() { return Date.now() / 1000.0 }

function humanTime(s) {
    if (s <= 50) {
        return `${Math.round(s)} seconds`;
    } else if (s <= 3500) {
        return `${Math.round(s/60)} minutes`;
    } else if (s <= 28800) {
        return `${Math.round(s/3600)} hours`;
    } else  {
        return `${Math.round(s/28800)} days`;
    }
}

function scaleOut(input, min, max) { return (max-min)*input + min; }

function updateSpeed() {
    scroll();
    const val = $("#speed-input").val();
    // Interpret input on a log scale going from 10wpm to 2000wpm
    wpm = Math.round(scaleOut(val/100.0, 10, 2000));
    const eta = 424945 / wpm * 60;
    $(".wpm-output").text(`${wpm} wpm`);
    $(".eta-output").text(humanTime(eta));
}


function scrollToTop() {
    LINE_HEIGHT = $(".book").height() / 39426;
    lastScrolled = time();
    position = load() || 0;
    scrollTo(position);
}

function scroll() {
    const now = time();
    const elapsed = now - lastScrolled;
    lastScrolled = now;

    const linesToScroll = wpm * (elapsed / 60.0) / WORDS_PER_LINE;
    position += linesToScroll;
    scrollTo(position);
}

function scrollTo(line) {
    const y = line*LINE_HEIGHT;
    $(".book").css("top", `-${y}px`);
}

function save() {
    window.localStorage.setItem("speedread", position);
}

function load() {
    return Number(window.localStorage.getItem("speedread"));
}

$(document).ready(() => {
    updateSpeed();
    scrollToTop();
    $("#speed-input").on("input", updateSpeed);
    setInterval(scroll, 10);
    setInterval(save, 1000);
});
