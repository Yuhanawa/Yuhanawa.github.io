!function(){function e(){var e=(new Date).getTime()+250;var t=new Date(2021,4,3,18,41,23).getTime();var n=e-t;var r=parseInt(n/1e3/60/60/24);var i=parseInt(n/1e3/60/60-r*24);var o=parseInt(n/1e3/60-r*24*60-i*60);var a=parseInt(n/1e3-r*24*60*60-i*60*60-o*60);document.getElementById("timeDate").innerHTML=`本站已运行 ${r} 天 `;document.getElementById("times").innerHTML=`${i} 小时${o} 分 ${a} 秒`}setInterval(e,1e3)}();(()=>{if(!document.location.href.startsWith("http://localhost")){setInterval(function(){debugger},100);window.addEventListener("resize",e),document.addEventListener("keydown",function(e){return 123!==e.keyCode||(e.returnValue=!1)}),document.addEventListener("contextmenu",function(e){return e.returnValue=!1});try{e()}catch(e){}}function e(){if(window.outerHeight-window.innerHeight>200||window.outerWidth-window.innerWidth>200){document.body.innerHTML='<p style="font-size:6rem">不许调试我哦~</p><p style="font-size:6rem">不许调试我哦~</p><p style="font-size:6rem">不许调试我哦~</p><p style="font-size:6rem">不许调试我哦~</p><p style="font-size:6rem">不许调试我哦~</p>'}setInterval(()=>{(function(){return!1}).constructor("debugger").call()},50)}})();