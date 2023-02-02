const xk_ins = document.getElementsByClassName("xk-in");

xk_on = [];

[...xk_ins].forEach((i) => {
    i.onclick = () => {
        if (i.className.indexOf("xk-in-on") !== -1) {
            xk_on.remove(i.id)
            i.className = " xk-in "
        } else if (xk_on.length<3) {
            xk_on.push(i.id)
            i.className += " xk-in-on "
        }
    }
})

//获取元素在数组的下标
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            return i;
        }
    }
    return -1;
};


//根据数组的下标，删除该下标的元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};