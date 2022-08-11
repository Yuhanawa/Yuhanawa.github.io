let like = 0;
let loyal = 0;
let ctrl = 0;
let master = "🎂蛋糕🎂"
let pos = 0;
questions = [{
    ctx: "你永远喜欢%", like: 10, loyal: 3, ctrl: 5,
}, {
    ctx: "你对%一心一意", like: 10, loyal: 10, ctrl: 5,
}, {
    ctx: "你对%绝对忠诚", like: 5, loyal: 10, ctrl: 0,
}, {
    ctx: "你认为%一定是个好人", like: 3, loyal: 5, ctrl: 0,
}, {
    ctx: "你永远单推%", like: 10, loyal: 10, ctrl: 2,
}, {
    ctx: "你永远支持%", like: 5, loyal: 10, ctrl: 2,
}, {
    ctx: "你愿意做%的狗", like: 0, loyal: 10, ctrl: -10,
}, {
    ctx: "你愿意拯救%", like: 5, loyal: 5, ctrl: -3,
}, {
    ctx: "你愿意为了%献上生命", like: 5, loyal: 10, ctrl: -10,
}, {
    ctx: "你愿意为了%献上父母", like: 3, loyal: 15, ctrl: -10,
}, {
    ctx: "你愿舔%的脚丫", like: 3, loyal: 10, ctrl: -10,
}, {
    ctx: "你敢于在公共场所抢夺%", like: 5, loyal: 5, ctrl: 12,
}, {
    ctx: "你为%感到荣幸", like: 5, loyal: 0, ctrl: 0,
}, {
    ctx: "你认为%是个可靠的人", like: 5, loyal: 10, ctrl: 0,
}, {
    ctx: "你完全信任%", like: 5, loyal: 10, ctrl: 3,
}, {
    ctx: "%无论怎样打你 你都不会还手", like: 3, loyal: 10, ctrl: -12,
}, {
    ctx: "当%辱骂你时,你会骂回去", like: -3, loyal: -10, ctrl: 12,
}, {
    ctx: "你想独占%", like: 5, loyal: 3, ctrl: 15,
}, {
    ctx: "你想成为%的所有物", like: 5, loyal: 5, ctrl: -10,
}, {
    ctx: "你想把%扑到", like: 10, loyal: -5, ctrl: 10,
}, {
    ctx: "你想被%控制", like: 3, loyal: 10, ctrl: -10,
}, {
    ctx: "你想要杀死%", like: -10, loyal: -10, ctrl: 5,
}, {
    ctx: "你想要杀死%的亲人", like: -5, loyal: -12, ctrl: 3,
}, {
    ctx: "你想要%成为你的玩具", like: 5, loyal: -10, ctrl: 15,
}]

questions.forEach((s, i) => {
    questions[i].ctx = s.ctx.replace("%", master);
});


function next_question(i) {
    like += questions[pos].like * i;
    loyal += questions[pos].loyal * i;
    ctrl += questions[pos].ctrl * i;
    pos++;

    if (pos >= questions.length) {
        document.getElementById("question-area").innerHTML = `
            <h1 style="background: rgba(255,182,193,0.6);color: #84e57c" xmlns="http://www.w3.org/1999/html">
            <p>${get_comment()}</p>
            <br>
            你对${master}的好感度是${get_like()}
            <br>
            你对${master}的忠诚度是${get_loyal()}
            <br>
            你对${master}的控制欲是${get_ctrl()}
            <br>
            <br>
            <br>
            </h1>`;

        document.body.style = Math.round(Math.random() * 10) >= 5 ? `width: 80%;
            min-height: calc(100vh - 4em);
            margin: 0 auto;
            padding: 2em;
            border-color: #eeeeee;
            border-left-style: solid;
            border-right-style: solid;
            border-width: 20px;
            background:url(./img/${get_img_name()}.png) #dddddd no-repeat center center;
            background-size: 60%;` : `width: 80%;
            min-height: calc(100vh - 4em);
            margin: 0 auto;
            padding: 2em;
            border-color: #eeeeee;
            border-left-style: solid;
            border-right-style: solid;
            border-width: 20px;
            background:url(./img/${get_img_name()}.png) #dddddd;`;

    } else {
        document.getElementById("question-text").innerHTML = questions[pos].ctx;
        document.getElementById("question-number").innerHTML = "Question " + (pos + 1) + " of " + questions.length;
    }
}

function get_like() {
    let sum = 0;
    questions.forEach((i) => {
        if (i.like > 0) sum += i.like
    });
    return (like / sum * 100).toFixed(1);
}

function get_loyal() {
    let sum = 0;
    questions.forEach((i) => {
        if (i.loyal > 0) sum += i.loyal
    });
    console.log(loyal);
    console.log(sum);
    return (loyal / sum * 100).toFixed(1);
}

function get_ctrl() {
    let sum = 0;
    questions.forEach((i) => {
        if (i.ctrl > 0) sum += i.ctrl
    });
    return (ctrl / sum * 100).toFixed(1);
}

function get_level() {
    const s = get_like();
    if (s < -90) {
        return -3;
    } else if (s < -70) {
        return -2;
    } else if (s < -30) {
        return -1;
    } else if (s < 30) {
        return 0;
    } else if (s < 70) {
        return 1;
    } else if (s < 90) {
        return 2;
    } else {
        return 3
    }
}

function get_comment() {
    const l = get_level();
    switch (l) {
        case -3:
            return "你对" + master + "恨之入骨";
        case -2:
            return "你对" + master + "怀恨在心";
        case -1:
            return "你对" + master + "略带厌恶";
        case 0:
            return "你对" + master + "不感兴趣";
        case 1:
            return "你对" + master + "略带爱慕";
        case 2:
            return "你对" + master + "非常喜欢";
        case 3:
            return "🤭嘿嘿🤭" + master + "🤭嘿嘿🤭 <br> 你穿条裤子吧";
    }
}

function get_img_name() {
    const s = get_like();
    /*
    * -100~-70: -2
    * -70~-30: -2
    * -30~30: 0
    * 30~70: 1
    * 70~100: 2
    */
    if (s < -70) {
        return -2;
    } else if (s < -30) {
        return -1;
    } else if (s < 30) {
        return 0;
    } else if (s < 70) {
        return 1;
    } else {
        return 2;
    }
}

function prev_question() {
    document.getElementById("question-text").innerHTML = "！！！ 不合格 ！！！";
    document.getElementById("question-number").innerHTML = "";
    document.getElementById("question-button").innerHTML = "";
    document.getElementById("question-button").style.display = "none";
}