(function($){
    $.fn.cxSlide=function(settings){
        if(!this.length){return;};
        settings=$.extend({},$.cxSlide.defaults,settings);
        var obj=this;
        var slide={};
        slide.fn={};
        var _html;
        slide.box=obj.find(".box");
        slide.list=slide.box.find(".list");
        slide.items=slide.list.find("li");
        slide.itemSum=slide.items.length;
        if(slide.itemSum<=1){return;};
        slide.boxWidth=slide.box.width();
		slide.boxHeight=slide.box.height();
		slide.s=0;

        // 方法：开始
        slide.fn.on=function(){
            if(!settings.auto){return;}
            slide.fn.off();

            slide.run=setTimeout(function(){
               slide.fn.goto();
            },settings.time);
        }

        // 方法：停止
        slide.fn.off=function(){
            if(typeof(slide.run!=="undefined")){clearTimeout(slide.run);};
        }

        slide.fn.goto=function(n){
            slide.fn.off();
            var _next=(typeof(n)=="undefined")?slide.s+1:parseInt(n,10);
            var _now=slide.s;
            var _max=slide.itemSum-1;
            if(_next==slide.s){
                slide.fn.on();
                return;
            }

            if(_next>_max){
                _next=0;
            }else if(_next<0){
                _next=_max
            }
            var _moveVal;
            switch(settings.type){
                 // 水平滚动
                case "x":
                    _moveVal=slide.boxWidth*_next;
                    if(_next==0&&_now==_max){
                       slide.items.eq(0).css({"left":slide.boxWidth*slide.itemSum});
                       _moveVal=slide.boxWidth*slide.itemSum;
                    }else if(_now==0){
                       slide.items.eq(0).css({"left":""});
                       slide.box.scrollLeft(0);
                    };
                    slide.box.stop(true,false).animate({"scrollLeft":(_moveVal)},settings.speed);
                    break;
            }

            slide.s=_next;
            
            slide.box.queue(function(){
                slide.fn.on();
                slide.box.dequeue();
            });
             
        }
        
        slide.fn.goto(settings.start);
		
    }
	// 默认值
	$.cxSlide={defaults:{
        auto:true,
        time:5000,       // 自动轮换间隔时间
        start:0,         // 首次展示序号
        type:"x",        // 轮换类型
        speed:800        // 切换速度
	}};
})(jQuery);