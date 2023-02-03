window.scrollTo(0,710);


const xk_ins = document.getElementsByClassName("xk-in");
const zysum = document.getElementById("zysum");
const xxzysum = document.getElementById("xxzysum");
const percent = document.getElementById("percent");
const zys = document.getElementById("zys");
const hidden_in = document.getElementById("hidden_in");

var xk_on = [];
let _zys = [];

[...xk_ins].forEach((i) => {
    i.onclick = () => {
        if (i.className.indexOf("xk-in-on") !== -1) {
            xk_on.remove(i.id)
            i.className = " xk-in "
            summary();
        } else if (xk_on.length < 3) {
            xk_on.push(i.id)
            i.className += " xk-in-on "
            summary();
        }
    }
})


const summary = () => {
    _zys = [];
    let _xxzysum = 0;
    let _zysum = 0;


    Object.keys(zy).forEach((key) => {
        let keyeqnum = 0;
        let keysplits = key.split(',');

        keysplits.forEach((k) => {
            [...xk_on].forEach((xk) => {
                if (k === xk.substring(0, 2)) {
                    keyeqnum++;
                }
            })
        })

        if (keyeqnum === keysplits.length) {
            _zysum += zy[key].count;
        }
    })
    Object.keys(xxzy).forEach((key) => {
        let keyeqnum = 0;
        let keysplits = key.split(',');

        keysplits.forEach((k) => {
            [...xk_on].forEach((xk) => {
                if (k === xk.substring(0, 2)) {
                    keyeqnum++;
                }
            })
        })

        if (keyeqnum === keysplits.length) {
            _xxzysum += xxzy[key].count;
            _zys.push(...(xxzy[key].zy));
        }
    })



    percent.innerText = (_xxzysum / 38411 * 100).toFixed(1).toString() + "%";
    xxzysum.innerText = _xxzysum;
    zysum.innerText = _zysum;
    zys_filter();
}

let zys_filter_input = document.getElementById("zys_filter_input").value;
zys_filter = (input)=>{
    if (input !== undefined){
        zys_filter_input = input.trim();
    }
    let reg = RegExp(zys_filter_input.split("").join("(.{0,4})").replace(" ","(.{0,8})"));

    let filterlist = _zys.filter((v)=> reg.test(v)).filter((_,i)=>i<250);
    zys.innerHTML = filterlist.map((v)=> `<li class="zyli">${v}</li>`).join("");

    if(!hidden_in.checked&&filterlist.length<120){
        zys.innerHTML += xxzy["any"].zy.map((v)=> `<li class="zyli">${v}</li>`).join("");
    }
}



document.getElementById("wl-in").click();










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




// from web

watermark()
function watermark() {
    //默认设置
    const defaultSettings = {
        watermark_txt: "https://yuhanawa.github.io/tools/ *" + getNow(),
        watermark_x: 20, //水印起始位置x轴坐标
        watermark_y: 20, //水印起始位置Y轴坐标
        watermark_rows: 10, //水印行数
        watermark_cols: 22, //水印列数
        watermark_x_space: 40, //水印x轴间隔
        watermark_y_space: 60, //水印y轴间隔
        watermark_color: '#aaa', //水印字体颜色
        watermark_alpha: 0.3, //水印透明度
        watermark_fontsize: '13px', //水印字体大小
        watermark_font: '', //水印字体
        watermark_width: 220, //水印宽度
        watermark_height: 80, //水印长度
        watermark_angle: 20 //水印倾斜度数
    };
    if (arguments.length === 1 && typeof arguments[0] === "object") {
        const src = arguments[0] || {};
        for (let key in src) {
            if (src[key]) defaultSettings[key] = src[key];
        }
    }
    const oTemp = document.createDocumentFragment();
    //获取页面最大宽度
    let page_width = Math.max(document.body.scrollWidth, document.body.clientWidth,window.innerWidth-20);
    const cutWidth = page_width * 0.0150;
    page_width = page_width - cutWidth;
    //获取页面最大高度
    let page_height = Math.max(document.body.scrollHeight, document.body.clientHeight) + 450;
    page_height = Math.max(page_height, window.innerHeight - 30);
    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (defaultSettings.watermark_cols === 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
        defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
        defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
    }
    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (defaultSettings.watermark_rows === 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
        defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
        defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
    }
    let x;
    let y;
    for (let i = 0; i < defaultSettings.watermark_rows; i++) {
        y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
        for (let j = 0; j < defaultSettings.watermark_cols; j++) {
            x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
            const mask_div = document.createElement('div');
            mask_div.id = 'mask_div' + i + j;
            mask_div.className = 'mask_div';
            mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
            //设置水印div倾斜显示
            mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.visibility = "";
            mask_div.style.position = "absolute";
            mask_div.style.left = x + 'px';
            mask_div.style.top = y + 'px';
            mask_div.style.overflow = "hidden";
            mask_div.style.zIndex = "9999";
            //让水印不遮挡页面的点击事件
            mask_div.style.pointerEvents = 'none';
            mask_div.style.opacity = defaultSettings.watermark_alpha;
            mask_div.style.fontSize = defaultSettings.watermark_fontsize;
            mask_div.style.fontFamily = defaultSettings.watermark_font;
            mask_div.style.color = defaultSettings.watermark_color;
            mask_div.style.textAlign = "center";
            mask_div.style.width = defaultSettings.watermark_width + 'px';
            mask_div.style.height = defaultSettings.watermark_height + 'px';
            mask_div.style.display = "block";
            oTemp.appendChild(mask_div);
        }
    }

    document.body.appendChild(oTemp);
}

function getNow() {
    const d = new Date();
    const year = d.getFullYear();
    const month = change(d.getMonth() + 1);
    const day = change(d.getDate());
    const hour = change(d.getHours());

    function change(t) {
        if (t < 10) {
            return "0" + t;
        } else {
            return t;
        }
    }

    return `${year}年${month}月${day}日 ${hour}时`;
}

