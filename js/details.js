window.onload = function () {
    (function ($) {
        $.getUrlParam = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }
    })(jQuery);

    var createMap = function (mapData) {
        var p0 = mapData.gpsbd.split(",")[0]; //
        var p1 = mapData.gpsbd.split(",")[1]; //按照原数组的point格式将地图点坐标的经纬度分别提出来
        var item = mapData.unitinfo;

        var zjwMap;
        zjwMap = new BMap.Map("allmap", {mapType: BMAP_HYBRID_MAP});    // 创建Map实例
        // 百度地图API功能
        var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_HYBRID_MAP, BMAP_NORMAL_MAP]});
        var points = new BMap.Point(p1, p0);
        zjwMap.centerAndZoom(points, 13);
        //zjwMap.addControl(mapType1);
        // zjwMap.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
        zjwMap.enableScrollWheelZoom();
        var myIcon = new BMap.Icon("http://dt.zbta.net/images/travel_icon.png", new BMap.Size(30, 48));
        //var marker = new BMap.Marker(points, {icon: myIcon});

        ////
        //zjwMap.addOverlay(marker);
        var content = '<div style="margin:0;line-height:20px;padding:2px;">';
        if (item.flagpic != "") {
            if (item.typeid == "318") {
                content += '';
            } else {
                content += '<img src=' + item.flagpic + ' style="float:right;zoom:1;overflow:hidden;width:120px;height:90px;margin-left:3px;"/>';
            }
        }
        if (item.address) {
            content += "地址：" + item.address;

        }
        if (item.telephone != "") {
            content += "<br/>电话：" + item.zonecode + "-" + item.telephone;
        }
        content += '</div>';
        var titleBar = "";
        // var typename = "abc";
        // var unitname = "unitname";
        // var url = "url";
        if (item.typeid != "318") {
            titleBar = "<span style='font-size:14px'>" + item.unitname + "</span>";
        } else {
            titleBar = "<span style='font-size:14px'>" + item.unitname + "</span>"
        }
        var searchInfoWindow = new BMapLib.SearchInfoWindow(zjwMap, content, {
            title: titleBar,      //标题
            width: 350,             //宽度
            height: 105,              //高度
            enableAutoPan: true,     //自动平移
            searchTypes: [],
            enableSendToPhone: false
        });

        searchInfoWindow.addEventListener("close", function (e) {
            isopen = false;
        });
        searchInfoWindow.addEventListener("open", function (e) {
            isopen = true;
        });


        var infoWindow = new BMap.InfoWindow("", {
            width: 0,     // 信息窗口宽度
            height: 0,     // 信息窗口高度
            title: "<span style='font-size:15px;background-color:#fff'>" + mapData.unitname + "</span>", // 信息窗口标题
            enableMessage: false,//设置允许信息窗发送短息
            //message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
        });

        // var searchInfoWindow = new BMapLib.SearchInfoWindow(zjwMap, content, {
        //     title: mapData.unitname,      //标题
        //     width: 350,             //宽度
        //     height: 105,              //高度
        //     enableAutoPan: true,     //自动平移
        //     searchTypes: [],
        //     enableSendToPhone: false
        // });
        zjwMap.openInfoWindow(infoWindow, points);
        // zjwMap.openInfoWindow(searchInfoWindow,points);


        //marker.addEventListener("click", function (e) {

        //    isopen = true;
        //    searchInfoWindow.open(marker);
        //});
        // marker.addEventListener("mouseover", function (e) {
        //     this.setTitle(item.unitname);
        // });
    }

    var  NumgetDesc = [];

    var getDesc = function (desc, len) {

        NumgetDesc.push(desc);      //姜维省略完整的字段存入NumgetDesc数组  后面以此为数据源展开

        len = len || 25;
        if (!desc) {
            return "";
        }
        if (desc.length > len) {

            return desc.substr(0, len) + "...";

        }


        return desc;
    }




    var _unitid = $.getUrlParam('unitid');
    $.getJSON("https://rapi.zjwist.com/WapDisplay/GetUnitInfo", {
        unitid: _unitid
    }, function (data) {
        // 拼接字符串
        if (data.code == 0) {
            var unitinfostr = "";
            var star = "AAAAA";
            $.each(data.data, function (index, typeinfo) {
                // 页面标题部分
                unitinfostr += "<div class='top'>";
                unitinfostr += "<h1>" + typeinfo.pubinfounit.unitname + "</h1>";
                //debugger;
                if (typeinfo.pubinfounit.level >= 1 && typeinfo.pubinfounit.level < 6) {
                    unitinfostr += "<div class='top_three'>";
                    unitinfostr += "<div class='top_one'>";
                    unitinfostr += "<p>" + star.substr(0, typeinfo.pubinfounit.level) + "</p>";
                    unitinfostr += "</div>";
                    unitinfostr += "<div class='top_two'>";
                    if (typeinfo.pubinfounit.address) {
                        unitinfostr += "<p>" + typeinfo.pubinfounit.address + "</p>";
                    } else {
                        unitinfostr += "<p></p>";
                    }
                    unitinfostr += "</div>";
                    unitinfostr += "</div>";
                }


                // 轮播图部分
                unitinfostr += "<div class='slider' id='slider'>";
                unitinfostr += "<ul class='clearfix' id='clearfix'>";

                $.each(typeinfo.picinfos, function (index, typeinfo) {
                    unitinfostr += "<li><img src=\'" + typeinfo.picurl + "?width=412\'/></li>"
                });
                unitinfostr += "</ul>";
                unitinfostr += "<ul class='circle J-circle'>";

                $.each(typeinfo.picinfos, function (index, typeinfo) {
                    if (index === 0) {
                        unitinfostr += "<li class='now'></li>";
                    } else {
                        unitinfostr += "<li></li>";
                    }
                });

                unitinfostr += "</ul>";
                unitinfostr += "</div>";

                // 景区简介
                unitinfostr += "<div class='article'>";
                unitinfostr += "<p id='tableList' class='J-table-list description'>" + (typeinfo.pubinfounit.desc || "") + "</p>";
                unitinfostr += "<h1 class='display-more'>查看全部简介</h1>";
                unitinfostr += "<div id='triangle-right'></div>";
                unitinfostr += "</div>";
                //景区基本信息
                unitinfostr += "<div class='details'>"; //外面的盒子 start

                unitinfostr += "<div class='details_one'>";
                unitinfostr += "<h1>地&nbsp址</h1>";
                unitinfostr += "<div class='details_two'><p>" + typeinfo.pubinfounit.areaname + "</p></div>";
                unitinfostr += "</div>";
                if (typeinfo.pubinfounit.businesstime) {
                    unitinfostr += "<div class='details_four'>";
                    unitinfostr += "<h1>营业时间</h1>";
                    unitinfostr += "<div class='details_three'><p>夏季：" + typeinfo.pubinfounit.businesstime + "</p><span>冬季：" + typeinfo.pubinfounit.businesstime + "</span></div>";
                    unitinfostr += "</div>";
                }
                unitinfostr += "<div class='details_ten_one'>";
                unitinfostr += "<h1>咨询电话</h1>";
                unitinfostr += "<div class='details_six'><p>" + typeinfo.pubinfounit.zonecode + "-" + typeinfo.pubinfounit.telephone + "</p></div>";
                unitinfostr += "</div>";

                unitinfostr += "<div class='details_seven'>";
                unitinfostr += "<h1>门票价格</h1>";
                unitinfostr += "<div class='details_six'><p>" + typeinfo.pubinfounit.ticketprice + "/人</p></div>";
                unitinfostr += "</div>";

                if (typeinfo.pubinfounit.tips) {
                    unitinfostr += "<div class='details_seven'>";
                    unitinfostr += "<h1>门票说明</h1>";
                    unitinfostr += "<div class='details_six'><p class='Desc1'>" + getDesc(typeinfo.pubinfounit.tips) + "</p>";
                    unitinfostr += "</div>";
                    unitinfostr += "</div>";
                }

                if (typeinfo.pubinfounit.favouredpolicy) {
                    unitinfostr += "<div class='details_none '>";
                    unitinfostr += "<h1>优惠政策</h1>";
                    unitinfostr += "<div class='details_ten'><p class='J-details_ten  detailss Desc1'>" + getDesc(typeinfo.pubinfounit.favouredpolicy) + "</p></div>";
                    unitinfostr += "</div>";

                    unitinfostr += "</div>";
                }


                //房型
                if (typeinfo.typeinfo.existsroom) {
                    unitinfostr += "<div class='room'>";
                    unitinfostr += "<p>房&nbsp型</p>";
                    unitinfostr += "<ul class='room_one'>";
                    $.each(typeinfo.unitchilds, function (index, typeinfo) {
                        unitinfostr += "<li><div class='row'><div class='left'><img class=''src=\'" + typeinfo.flagurl + "?width=116\'></div>";
                        unitinfostr += "<div class='right'><div class='title'>" + typeinfo.childname + "</div>";
                        // unitinfostr += "<li>房价：" + (typeinfo.price ||'-')+ "元/晚</li>"
                        if (typeinfo.price) {
                            unitinfostr += "<div class='price'>房价：" + typeinfo.price + "元/晚</div>"
                        }
                        unitinfostr += "</div></div>";
                        // unitinfostr += "<div class='row desc'>" + typeinfo.desc + "</div></li>"
                        if (typeinfo.desc) {
                            unitinfostr += "<div class='row desc'>" + typeinfo.desc + "</div></li>"
                        } else {
                            unitinfostr += "<div class='row desc'></div></li>"
                        }

                    });
                    unitinfostr += "</ul>";

                    //子景区
                    unitinfostr += "</div>"
                } else {
                    if (typeinfo.unitchilds.lenght) {
                        unitinfostr += "<div class='spot'>";
                        unitinfostr += "<p>子景区</p>";
                        unitinfostr += "<ul class='spot_ten'>";
                        $.each(typeinfo.unitchilds, function (index, typeinfo) {
                            unitinfostr += "<li class='spot_four'><p class='spot_six'>狐仙园</p>";
                            // unitinfostr += "<img src='' >";
                            unitinfostr += "<a href='ditu.html'><p class='spot_two'>地图</p></a>";
                            unitinfostr += "<img src=\'" + typeinfo.flagurl + "?width=262\'>";
                            // unitinfostr += "<p>门票：" + typeinfo.price + "元/人</p>"
                            if (typeinfo.price) {
                                unitinfostr += "<div class='price'>房价：" + typeinfo.price + "元/晚</li></div>"
                            }
                            unitinfostr += "<p class='spot_five'> " + typeinfo.desc + "</p>";
                            unitinfostr += "</li>";
                        });
                        unitinfostr += "</div>";
                    }
                    // unitinfostr += "<div class='deep'>"
                }
                unitinfostr += "<div class='deep'>"//外面的deep盒子 start

                unitinfostr += "<div id='allmap' style='height: 250px;'></div>";

                unitinfostr += "<img src='images/zhao.png'>";
                unitinfostr += "<h1 id='zb'>周边景点</h1>";
                $.each(typeinfo.arounds, function (index, typeinfo) {
                    //我推测如果typeorder的值为1 则对应为景点信息
                    if (typeinfo.typeorder === 1) {
                        unitinfostr += "<a href='details.html?unitid=" + typeinfo.unitid + "'><div class='deep_two'>";
                        unitinfostr += "<img src=\'" + typeinfo.flagurl + "?width=170\'>";
                        unitinfostr += "<h1>" + typeinfo.unitname + "</h1>";
                        unitinfostr += "<p class='Desc1'>" + getDesc(typeinfo.desc) + "</p>";
                        unitinfostr += "</div></a>"
                    }
                });
                //周边美食
                unitinfostr += "<img src='images/mei.png'>";
                unitinfostr += "<h1 id='zb'>周边美食</h1>";
                $.each(typeinfo.arounds, function (index, typeinfo) {
                    //我推测如果typeorder的值为4或者5 则对应为美食信息
                    if (typeinfo.typeorder === 4 || typeinfo.typeorder === 5) {
                        unitinfostr += "<a href='details.html?unitid=" + typeinfo.unitid + "'><div class='deep_two'>";
                        unitinfostr += "<img src=\'" + typeinfo.flagurl + "?width=169\'>";
                        unitinfostr += "<h1>" + typeinfo.unitname + "</h1>";
                        unitinfostr += "<p class='Desc1'>" + getDesc(typeinfo.desc) + "</p>";
                        unitinfostr += "</div></a>"
                    }
                });

                //周边住宿
                unitinfostr += "<img src='images/zhu.png'>";
                unitinfostr += "<h1 id='zb'>周边住宿</h1>";
                $.each(typeinfo.arounds, function (index, typeinfo) {
                    //我推测如果typeorder的值为2 则对应为住宿信息
                    if (typeinfo.typeorder === 2) {
                        unitinfostr += "<a href='details.html?unitid=" + typeinfo.unitid + "'><div class='deep_two'>";
                        unitinfostr += "<img src=\'" + typeinfo.flagurl + "?width=169\'>";
                        unitinfostr += "<h1>" + typeinfo.unitname + "</h1>";
                        unitinfostr += "<p class='Desc1'>" + getDesc(typeinfo.desc) + "</p>";
                        unitinfostr += "</div></a>"
                    }
                });

                unitinfostr += "</div>";         //外面的deep盒子 end
                unitinfostr += "</div>";          //外面的details盒子 end
            });

            // 将字符串插入到页面
            $("#view").html(unitinfostr);

            $(".J-circle").css("marginLeft", -$(".J-circle").width() / 2 + "px");
            banner();



            // 地图
            if (!data.data[0].pubinfounit.gpsbd) {
                //周边景点
                $("#allmap").hide();
            } else {
                createMap({
                    unitinfo: data.data[0].pubinfounit,
                    unitname: data.data[0].pubinfounit.unitname,
                    gpsbd: data.data[0].pubinfounit.gpsbd,
                    address: data.data[0].pubinfounit.address
                });
            }

            // 创建点击事件  点击后展开省略的文字   每一个调用过getDesc()方法截取文字完成省略操作的， 在渲染凭借字符串时必须添加一个类名Desc1
            var $Desc1 = $(".Desc1")
            for(var i = 0; i < $Desc1.length; i++){
                $Desc1[i].index = i;
                $($Desc1[i]).on("click", function(){
                    var s = this.index
                    var temp = this.innerHTML;
                    this.innerHTML = NumgetDesc[s];
                    NumgetDesc[s] = temp;
                })
            }



        }
    });






};