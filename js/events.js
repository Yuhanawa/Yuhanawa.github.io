HTMLElement.prototype.wrap=function(o){this.parentNode.insertBefore(o,this),this.parentNode.removeChild(this),o.appendChild(this)},Fluid.events={registerNavbarEvent:function(){var o=$("#navbar"),t=$("#navbar .dropdown-menu");0<o.offset().top&&(o.removeClass("navbar-dark"),t.removeClass("navbar-dark")),Fluid.utils.listenScroll(function(){o[50<o.offset().top?"addClass":"removeClass"]("top-nav-collapse"),t[50<o.offset().top?"addClass":"removeClass"]("dropdown-collapse"),0<o.offset().top?o.removeClass("navbar-dark"):o.addClass("navbar-dark"),t.removeClass("navbar-dark")}),$("#navbar-toggler-btn").on("click",function(){$(".animated-icon").toggleClass("open"),$("#navbar").toggleClass("navbar-col-show")})},registerParallaxEvent:function(){var n,r=$('#banner[parallax="true"]');0===r.length||0!==(n=$("#board")).length&&Fluid.utils.listenScroll(function(){var o=$(window).scrollTop()/5,t=96+parseInt(n.css("margin-top"),0);r.css({transform:"translate3d(0,"+(o=t<o?t:o)+"px,0)","-webkit-transform":"translate3d(0,"+o+"px,0)","-ms-transform":"translate3d(0,"+o+"px,0)","-o-transform":"translate3d(0,"+o+"px,0)"}),$("#toc")&&$("#toc-ctn").css({"padding-top":o+"px"})})},registerScrollDownArrowEvent:function(){var o=$(".scroll-down-bar");0!==o.length&&o.on("click",function(){Fluid.utils.scrollToElement("#board",-$("#navbar").height())})},registerScrollTopArrowEvent:function(){var t,n,r,o,e,a=$("#scroll-top-button");0===a.length||0!==(t=$("#board")).length&&(r=n=!1,(o=function(){var o=t[0].getClientRects()[0].right,o=document.body.offsetWidth-o;n=50<=o,a.css({bottom:n&&r?"20px":"-60px",right:o-64+"px"})})(),$(window).resize(o),e=t.offset().top,Fluid.utils.listenScroll(function(){var o=document.body.scrollTop+document.documentElement.scrollTop;r=e<=o,a.css({bottom:n&&r?"20px":"-60px"})}),a.on("click",function(){$("body,html").animate({scrollTop:0,easing:"swing"})}))},billboard:function(){"console"in window&&console.log(`
------------------------------------------------
|                                              |
|     ________  __            _        __      |
|    |_   __  |[  |          (_)      |  ]     |
|      | |_ \\_| | | __   _   __   .--.| |      |
|      |  _|    | |[  | | | [  |/ /'\`\\' |      |
|     _| |_     | | | \\_/ |, | || \\__/  |      |
|    |_____|   [___]'.__.'_/[___]'.__.;__]     |
|                                              |
|           Powered by Hexo x Fluid            |
|         GitHub: https://git.io/JqpVD         |
|                                              |
------------------------------------------------
    `)}};