window.onload = function () {
    var flag = true; //表示节流阀是打开的

    var config = [
       
    ]; //其实就是一个配置单 规定了每张图片的大小位置层级透明度
    


var pid= GetQueryString("pid");

    //找人
    var wrap = $("#slider");
    var slide = $("#slide");
    var ul = $("#slide ul");
    var lis = $("#slide ul li");
    
    
    function assign() {
        //让所有的li 按照配置单 渐渐地 各就各位
        for (var i = 0; i < lis.length; i++) {
            //
            animate(lis[i], config[i], function () {
                flag = true; //动画执行完成后 让falg为true 打开节流阀
            });
        }
    }
    
    
    $(document).on("swiperight", "#slide", function () {
        if (flag) { //如果节流阀是打开的 才能执行动画
            flag = false; //只要执行了 就把节流阀先关闭
            //arr.push(arr.shift());
            config.push(config.shift());
            //然后还要让每一个li 根据新生成的配置单 重新从当前位置跑到新的位置
            assign();
        }
    });
    
    // $("#slide").on("swipeleft", function () {
    // 建议使用这种方式绑定事件
    $(document).on("swipeleft", "#slide", function () {
        config.unshift(config.pop());
        assign();
    });
    
    // 4.节流阀 点击箭头后就不能再点击了 当前动画执行完成后 才能再点击
    $.getJSON("https://rapi.zjwist.com/wapdisplay/indexpage", {pid: pid}, function (data) {
        if (data.code == 0) {
            
            $("body").eq(0).attr("background",data.data.wapbgimg);

            //document.body.style.background = "url('images/bg1.jpg')";
            var typeinfostr = "<ul id='typelist'>";
            
            // 动态配置config
            config = [];
            
            $.each(data.data.typeinfos, function (index, typeinfo) {
                typeinfostr += "<li class='picture'>";
                typeinfostr += "<a href='search.html?pid="+pid+"&typeid="+typeinfo.typeid+"' target='_blank'><img src='" +
                typeinfo.wapshowimg + "'/></a>";
    
                typeinfostr += "<div class='picture_one'><a href='search.html?pid=40&typeid="+typeinfo.typeid+"' target='_blank'>" + typeinfo.mobilememo  + "</a></div>";
                typeinfostr += "<img src='images/btn_goto@2x.png' alt=''>";
                typeinfostr += "</li>";
                
                // 动态配置config
                if (index === 0) {
                    // 第一个激活的卡片
                    config.push({
                        "width": 200,
                        "height": 365,
                        "top": 0,
                        "left": 50,
                        "opacity": 1,
                        "zIndex": 4
                    });
                } else if (index === 1) {
                    // 右边的卡片
                    config.push({
                        "width": 150,
                        "height": 274,
                        "top": 45,
                        "left": 150,
                        "opacity": 1,
                        "zIndex": 3
                    });
                } else if (index === data.data.typeinfos.length - 1) {
                    // 左边的卡片
                    config.push({
                        "width": 125,
                        "height": 274,
                        "top": 45,
                        "left": 0,
                        "opacity": 1,
                        "zIndex": 3
                    });
                } else {
                    // 其它的卡片暂时先放到最后面
                    config.push({
                        "width": 125,
                        "height": 274,
                        "top": 45,
                        "left": 75,
                        "opacity": 1,
                        "zIndex": 0
                    });
                }
            });
            typeinfostr += "</ul>";
            $("#slide").html(typeinfostr);
            
            lis = $("#slide ul li");
            
            assign();
            
        }
    });

};