
window.onload = function() {
    var flag = true; //表示节流阀是打开的

    var config = [{
            "width": 125,
            "height": 274,
            "top": 45,
            "left": 0,
            "opacity": 1,
            "zIndex": 3
        }, //1
        
        {
            "width": 200,
            "height": 365,
            "top": 0,
            "left": 50,
            "opacity": 1,
            "zIndex": 4
        }, //2
        {
            "width": 150,
            "height": 274,
            "top": 45,
            "left": 150,
            "opacity": 1,
            "zIndex": 3
        }, //3
       
    ]; //其实就是一个配置单 规定了每张图片的大小位置层级透明度
    //找人
    var wrap = document.getElementById("wrap");
    var slide = document.getElementById("slide");
    var ul = slide.children[0];
    var lis = ul.children;
    var arrow = document.getElementById("arrow");
    var arrLeft = document.getElementById("arrLeft");
    var arrRight = document.getElementById("arrRight");
    //鼠标经过盒子 让箭头 渐渐地 显示出来
    wrap.onmouseover = function() {
        animate(arrow, {
            "opacity": 1
        });
    };
    //离开盒子渐渐隐藏
    wrap.onmouseout = function() {
        animate(arrow, {
            "opacity": 0
        });
    };

    function assign() {
        //让所有的li 按照配置单 渐渐地 各就各位
        for (var i = 0; i < lis.length; i++) {
            //
            animate(lis[i], config[i], function() {
                flag = true; //动画执行完成后 让falg为true 打开节流阀
            });
        }
    }

    assign();

    //3.点击箭头 实现旋转
    //点击右箭头 让配置单 把最前的放到最后
    $("#slide").on("swiperight", function() {
        if (flag) { //如果节流阀是打开的 才能执行动画
            flag = false; //只要执行了 就把节流阀先关闭
            //arr.push(arr.shift());
            config.push(config.shift());
            //然后还要让每一个li 根据新生成的配置单 重新从当前位置跑到新的位置
            assign();
        }
    });
    $("#slide").on("swipeleft", function() {
        config.unshift(config.pop());
        assign();
    });

    //4.节流阀 点击箭头后就不能再点击了 当前动画执行完成后 才能再点击



$.getJSON("https://rapi.zjwist.com/wapdisplay/indexpage"),{pid:40},function(data){
         if(data.code==0){
            var typeinfostr ="<ul id='typelist'>";
            $.each(data.data.typeinfos,function(index,typeinfo){
            typeinfostr +="<li class='picture'>";
                            typeinfostr +="<img src='"+typeinfo.wapshowimg+" alt=''>";
                            typeinfostr +="<div>"+typeinfo.mobilememo+"</div>";
                            typeinfostr +="<img src='images/btn_goto@2x.png' alt=''>";
                            typeinfostr +="</li>"
                
            });
            typeinfostr +="</ul>";
           $("#slide").html(typeinfostr);
          // console.log(typeinfostr);
          // console.log(data);
         }

    };
};