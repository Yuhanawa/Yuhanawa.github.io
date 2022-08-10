let OriginalScore = 0;
let master = "🎂蛋糕🎂"
let pos = 0;
questions=[ // viewpoints
    "你永远喜欢%",
    "你对%一心一意",
    "你对%绝对忠诚",
    "你认为%一定是个好人",
    "你永远单推%",
    "你永远支持%",
    "你愿意做%的狗",
    "你愿意拯救%",
    "你原为%献上生命",
    "你原为%献上父母",
    "你愿舔%的脚丫",
    "你敢于在公共场所抢夺%",
    "你为%感到荣幸",
    "你认为%是个可靠的人",
    "你完全信任%",
    "%无论怎样打你 你都不会还手",
    "你完全接受%辱骂你",
    "你想独占%",
    "你想成为%的所有物",
    "你想把%扑到",
    "你源被%控制",
]
questions.forEach((s,i)=>{questions[i] = s.replace("%", master);});


function next_question(i) {
    OriginalScore += i;
    pos++;

    if (pos >= questions.length) {
        document.getElementById("question-text").innerHTML = get_score_love();
        document.getElementById("question-number").innerHTML = "Your score is " + get_score();
        document.getElementById("question-button").innerHTML = "";
        document.getElementById("question-button").style.display = "none";
    } else {
        document.getElementById("question-text").innerHTML = questions[pos];
        document.getElementById("question-number").innerHTML = "Question " + (pos+1) + " of " + questions.length;
    }
}

function get_score() {
    return OriginalScore/ (questions.length * 10) * 100 ;
}
function get_score_love() {
    let love = "";
    for (let i = 0; i < Math.abs(get_score()); i++) {
        love += "❤"
    }

    if (get_score() > 0) {
        return "<p style='color: red'> " + love +"</p>";
    } else {
        return "<p style='color: black'> " + love +"</p>";
    }
}

function prev_question() {
    document.getElementById("question-text").innerHTML = "！！！ 不合格 ！！！";
    document.getElementById("question-number").innerHTML = "";
    document.getElementById("question-button").innerHTML = "";
    document.getElementById("question-button").style.display = "none";
}