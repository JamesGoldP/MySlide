jQuery.fn.extend({
    myslide: function(options) {
        options = $.extend({
            autoChange: true,        //是否自动切换
            changeTime: 5000,        //自动切换时间
            prevBtn: null,           //上一张幻灯片按钮
            nextBtn: null,           //下一张幻灯片按钮
            haveNum: false,          //是否有数字导航
            linkText: false,         //是否有带透明的文字背景
            effect: "fade",          //效果
            delayTime:300,           //鼠标经过时对象切换迟滞时间，推荐值为300ms
            hoverChange:false,        //鼠标经过是否切换
            hoverChagneClass:"on"    //鼠标移上去的样式
        }, options || {});
       
        var n = -1;                                                       //索引
        var achange = setInterval(autoChange, options.changeTime);        //定时器
        var num = $(this).length - 1;                                     //计算幻灯片数量
        var _self = $(this);
        var delayTime;//鼠标经过时对象切换迟滞时间，推荐值为300ms
        
        //效果
        function fadeAB() {
            switch(options.effect){
                case "slide":  //向上翻
                _self.hide(500).parent().children().eq(n).show(500); 
                break;
                default:       //默认fade
                _self.fadeOut(1000).parent().children().eq(n).fadeIn(1700); 
                break;
            }
        }

        if (options.linkText) {
            _self.eq(num).after("<div class=\"sli-info\"></div>");
            $(".sli-info").css({
                position: "absolute",
                width: "500px",
                height: "60px",
                "z-index": "3",
                background: "#000",
                bottom: "0px",
                left: "0px",
                opacity: "0.35",
                filter: "alpha(opacity=35)"
            });
            _self.eq(num).after("<div class=\"sli-text \"></div>");
            $(".sli-text").css({
                position:"absolute",
                color: "#fff",
                bottom: "30px",
                left: "20px",
                "z-index": 4
            });
        }

        //数字导航切换
        if (options.haveNum) {
            var slide_ul = "<ul class='slide_ul'>";
            for (var i = 0; i <= num; i++) {
                slide_ul += "<li >"+(i+1)+"</li>"
            }
            slide_ul += "</ul>";
            _self.eq(num).after(slide_ul);
            $(".slide_ul").css({
                "position": "absolute",
                "z-index": "5",
                height: "13px"
            });

            _self.parent().children(".slide_ul").children("li").click(function() {
                init_auto();
                n=$(this).index();
                fadeAB();
                $(this).addClass(options.hoverChagneClass);
                $(this).siblings().removeClass(options.hoverChagneClass);
                if (options.linkText) {
                    //文字
                    $(".sli-text").html(_self.eq(n).find("img").attr("alt"));
                }
            });
            
            if(options.hoverChange){
             _self.parent().children(".slide_ul").children("li").hover(function(){
                init_auto();
                n=$(this).index();
                delayRun = setTimeout(fadeAB,options.delayTime);
                $(this).addClass(options.hoverChagneClass);
                $(this).siblings().removeClass(options.hoverChagneClass);
                if (options.linkText) {
                    //文字
                    $(".sli-text").html(_self.eq(n).find("img").attr("alt"));
                }
                },function(){
                      clearTimeout(delayRun);
                });
            }
        }
        //程序开始先运行一次,如果不先运行一次，则会切换到第一张图片，那么和刚开始看到的
        //图片是一样的，逻辑不对。
        autoChange();
        

        //自动切换
        if (options.autoChange) {
              achange;
        }

        //重置自动切换
        function init_auto(){
             clearInterval(achange);
             achange = setInterval(autoChange, options.changeTime);
        }

        //自动切换函数
        function autoChange() {
            n = n >= num ? 0 : ++n;
            if (options.haveNum) {
                _self.parent().children(".slide_ul").children("li").eq(n).click();
            } else {
                fadeAB();
            }
        }

        //上一个
        if (options.prevBtn) {
            $(options.prevBtn).click(function() {
                n = n - 1 < 0 ? num :n-1;
                if (options.haveNum) 
                {
                    _self.parent().children(".slide_ul").children("li").click();
                    init_auto();
                }
                else
                {
                    fadeAB();  
                    init_auto();
                } 
            })
        }

        //下一个
        if (options.nextBtn) {
            $(options.nextBtn).click(function(){
                n = n + 1 > num ? 0 : ++n;
                if (options.haveNum) 
                {
                    _self.parent().children(".slide_ul").children("li").eq(n).click();
                    init_auto();
                }
                else
                {
                    setTimeout(fadeAB(),500);  
                    init_auto();
                } 
            })
        }
    }
});