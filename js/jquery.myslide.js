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
            hoverChange:false,        //鼠标经过是否切换
            hoverChagneClass:"on",    //鼠标移上去的样式
            delayTime:300,           //鼠标经过时对象切换迟滞时间，推荐值为300ms
            slideTime:1000
        }, options || {});
       
        var n = -1;                                                   //索引
        var _next=-1;;
        var achange = setInterval(autoChange, options.changeTime);    //定时器
        var max = $(this).find(".item").length - 1;      //计算幻灯片数量                  
        var parent=$(this);
        var _self = $(this).find(".item");
        var _moveVal;                                                 //移动值
        //设置a的高度
        _self.css({
            height:_self.children("div").height()+"px",
            display:"block",
            width:"100%"
        });
        var delayTime;//鼠标经过时对象切换迟滞时间，推荐值为300ms
        
        //效果
        function fadeAB() {
            switch(options.effect){
                //水平滚动
                case "x":
                _moveVal=_self.width()*_next;
                if(_next==0&&_now==max){
                  _self.eq(0).css({"left":_self.width()*(max+1)});
                  _moveVal=_self.width()*(max+1);
                }else if(_now==0){
                   _self.eq(0).css({"left":""});
                   parent.scrollLeft(0);
                };
                parent.animate({"scrollLeft":(_moveVal)});
                break;
                
                //垂直滚动
                case "y":
                _moveVal=_self.height()*_next;
                if(_next==0&&_now==max){
                  _self.eq(0).css({"left":_self.height()*(max+1)});
                  _moveVal=_self.height()*(max+1);
                }else if(_now==0){
                   _self.eq(0).css({"top":""});
                   parent.scrollTop(0);
                };
                parent.animate({"scrollTop":(_moveVal)});
                break;
                
                //淡入淡出
                default:       //默认fade
                _self.fadeOut(options.slideTime).parent().children(".item").eq(_next).fadeIn(options.slideTime); 
                break;
            }
        }

        if (options.linkText) {
            _self.eq(max).after("<div class=\"sli-info\"></div>");
            _self.parent().children(".sli-info").css({
                position: "absolute",
                width: "100%",
                height: "30px",
                "z-index": "3",
                background: "#fff",
                bottom: "0px",
                left: "0px",
                opacity: "0.7",
                filter: "alpha(opacity=70)"
            });
            _self.eq(max).after("<div class=\"sli-text \"></div>");
            _self.parent().children(".sli-text").css({
                position:"absolute",
                bottom: "0px",
                height:"30px",
                left: "20px",
                "z-index": 4
            });
            
            function lkText(){
                //文字
                if(_self.attr("alt")){
                   _self.parent().children(".sli-text").html(_self.eq(_next).find("img").attr("alt"));
                }else if(_self.attr("title").length){
                   _self.parent().children(".sli-text").html(_self.eq(_next).attr("title"));
                }
            }

            lkText();
        }


        

        //数字导航切换
        if (options.haveNum) {
            if(_self.parent().children(".slide_ul").length==0){
                var slide_ul = "<ul class='slide_ul'>";
                for (var i = 0; i <= max; i++) {
                    slide_ul += "<li >"+(i+1)+"</li>"
                }
                slide_ul += "</ul>";
                _self.eq(max).after(slide_ul);
            }
            _self.parent().children(".slide_ul").css({
                "position": "absolute",
                "z-index": "5"
            });

            _self.parent().children(".slide_ul").children("li").click(function() {
                init_auto();
                _next=$(this).index();
                fadeAB();
                $(this).addClass(options.hoverChagneClass);
                $(this).siblings().removeClass(options.hoverChagneClass);
                if (options.linkText) {
                    lkText();
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
                        lkText();
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
            _now=n;
            n=_next;
            _next= n>=max ? 0: ++n;
            if (options.haveNum) {
                _self.parent().children(".slide_ul").children("li").eq(_next).click();
            } else {
                fadeAB();

            }
            if (options.linkText) {
                    lkText();
            }
        }

        //上一个
        if (options.prevBtn) {
            $(options.prevBtn).click(function() {
                n=_next;
                _next = n - 1 < 0 ? max :n-1;
                if (options.haveNum){
                    _self.parent().children(".slide_ul").children("li").eq(_next).click();
                    init_auto();
                }
                else{
                    fadeAB();  
                    init_auto();
                } 
            })
        }

        //下一个
        if (options.nextBtn) {
            $(options.nextBtn).click(function(){
                n=_next;
                _next= n>=max ? 0: ++n;
                if (options.haveNum){
                    _self.parent().children(".slide_ul").children("li").eq(_next).click();
                    init_auto();
                }else{
                    fadeAB();  
                    init_auto();
                } 
            })
        }
    }
});