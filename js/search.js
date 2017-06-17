window.onload = function () {
    
    var pageindex = 1;
    var pagesize = 10;
    
    var currbdlnt;
    var currbdlat;
    
    function GetCurrbdgps() {
        // debugger;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
        
    }
    
    function showPosition(position) {
        //debugger;
        
        currbdlat = position.coords.latitude;
        currbdlnt = position.coords.longitude;
        GetAreaCode();
    }
    
    var createMap = function (data) {
        // 百度地图API功能
        var zjwMap = new BMap.Map("allmap");    // 创建Map实例
        zjwMap.centerAndZoom(new BMap.Point(currbdlnt, currbdlat), 12);  // 初始化地图,设置中心点坐标和地图级别
        zjwMap.addControl(new BMap.MapTypeControl());   //添加地图类型控件
        zjwMap.setCurrentCity("杭州");          // 设置地图显示的城市 此项是必须设置的
        zjwMap.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        // //向地图中添加缩放控件
        var ctrlNav = new window.BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_LEFT,
            type: BMAP_NAVIGATION_CONTROL_LARGE
        });
        zjwMap.addControl(ctrlNav);
        
        
        var point = new Array(); //存放标注点经纬信息的数组
        var marker = new Array(); //存放标注点对象的数组
        var info = new Array(); //存放提示信息窗口对象的数组
        
        point = new window.BMap.Point(currbdlat, currbdlnt); //生成新的地图点
        marker = new window.BMap.Marker(point); //按照地图点坐标生成标记
        zjwMap.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        zjwMap.panTo(point);
        
        var markerArr = [];
        data.forEach(function (key, index) {
            markerArr.push({
                title: key.unitname,
                point: key.gpsbd.split(",")[1] + "," + key.gpsbd.split(",")[0],
                address: key.address
            })
        });
        
        console.log(markerArr);
        
        
        for (var i = 0; i < markerArr.length; i++) {
            var p0 = markerArr[i].point.split(",")[0]; //
            var p1 = markerArr[i].point.split(",")[1]; //按照原数组的point格式将地图点坐标的经纬度分别提出来
            point[i] = new window.BMap.Point(p0, p1); //循环生成新的地图点
            marker[i] = new window.BMap.Marker(point[i]); //按照地图点坐标生成标记
            zjwMap.addOverlay(marker[i]);
            marker[i].setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            var label = new window.BMap.Label(markerArr[i].title, {offset: new window.BMap.Size(20, -10)});
            marker[i].setLabel(label);
            info[i] = new window.BMap.InfoWindow("<p style=’font-size:12px;lineheight:1.8em;’>" + markerArr[i].title + "</br>地址：" + markerArr[i].address + "</br> 电话：" + markerArr[i].tel + "</br></p>"); // 创建信息窗口对象
        }
    }
    
    var pid = GetQueryString("pid");
    var typeid = GetQueryString("typeid");
    
    function GetAreaCode() {
        
        $.getJSON("https://rapi.zjwist.com/WapDisplay/areacodelist", {pid: pid}, function (data) {
            if (data.code == 0) {
                
                var typeinfostr = "";
                
                $.each(data.data, function (index, typeinfo) {
                    typeinfostr += "<option value='" + typeinfo.areacode + "'>" + typeinfo.areaname + "</option>";
                });
                $(".area").html(typeinfostr);
                getList($.getUrlParam('typeid'));
            }
        });
    }
    
    // 为jquery扩展了一个getUrlParam()方法  来获取url参数
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
    // 首次渲染页面
    var zjwMap;
    
    function buildBDMap() {
        // 百度地图API功能
        zjwMap = new BMap.Map("allmap", {mapType: BMAP_HYBRID_MAP});    // 创建Map实例
        var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_HYBRID_MAP, BMAP_NORMAL_MAP]});
        zjwMap.centerAndZoom(new BMap.Point(currbdlnt, currbdlat), 10);
        zjwMap.addControl(mapType1);
        zjwMap.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
        zjwMap.enableScrollWheelZoom();
        // zjwMap.addEventListener("moveend", movemap);
        // zjwMap.addEventListener("zoomend", zoommap);
        
        
        if (currbdlat != "" && currbdlnt != "") {
            var sContent = "您当前位置";
            zjwMap.centerAndZoom(new BMap.Point(currbdlnt, currbdlat), 10);  //初始化时，即可设置中心点和地图缩放级别。
            var marker1 = new BMap.Marker(new BMap.Point(currbdlnt, currbdlat));  // 创建标注
            zjwMap.addOverlay(marker1);
            var point = new BMap.Point(currbdlnt, currbdlat);
            var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
            marker1.addEventListener("click", function () {
                this.openInfoWindow(infoWindow);
            });
            zjwMap.openInfoWindow(infoWindow, point);
        }
    }
    
    function addMapLayer(results) {
        //console.log(item);var myIcon;
        
        !zjwMap && buildBDMap();
        
        var url;
        var index = 0;
        var typename;
        var domain = "";
        
        // debugger;
        $.each(results, function (i, item) {
            var lal = [];
            if (item.gpsbd != null) {
                lal = item.gpsbd.split(",");
            } else {
                lal = "0,0".split(",");
            }
            item.typeid = typeid;
            
            switch (item.typeorderno) {
                case "1":
                    url = "http://" + domain + "/SiteInfo.aspx?type=audit&UnitID=" + item.unitid;
                    typename = "景区";
                    if (domain == "rapi.zjwist.com") {
                        url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
                    }
                    myIcon = new BMap.Icon("http://dt.zbta.net/images/scenic_icon.Png", new BMap.Size(30, 48));
                    break;
                case "2":
                    url = "http://" + domain + "/hotelinfo.aspx?type=audit&UnitID=" + item.unitid;
                    typename = "酒店";
                    if (domain == "rapi.zjwist.com") {
                        url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
                    }
                    myIcon = new BMap.Icon("http://dt.zbta.net/images/hotel_icon.png", new BMap.Size(30, 48));
                    break;
                case "3":
                    url = "http://" + domain + "/Travelinfo.aspx?type=audit&UnitID=" + item.unitid;
                    typename = "旅行社";
                    if (domain == "rapi.zjwist.com") {
                        url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
                    }
                    myIcon = new BMap.Icon("http://dt.zbta.net/images/travel_icon.png", new BMap.Size(30, 48));
                    break;
                case "4":
                    url = "http://" + domain + "/VillageInfo.aspx?type=audit&UnitID=" + item.unitid;
                    typename = "乡村旅游";
                    if (domain == "rapi.zjwist.com") {
                        url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
                    }
                    myIcon = new BMap.Icon("http://dt.zbta.net/images/form_icon.png", new BMap.Size(30, 48));
                    break;
                case "5":
                    url = "http://" + domain + "/ResInfo.aspx?type=audit&UnitID=" + item.unitid;
                    typename = "餐饮";
                    if (domain == "rapi.zjwist.com") {
                        url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
                    }
                    myIcon = new BMap.Icon("http://dt.zbta.net/images/res_icon.png", new BMap.Size(30, 48));
                    break;
                case "6":
                    url = "http://" + domain + "/Shopinfo.aspx?type=audit&UnitID=" + item.unitid;
                    typename = "购物";
                    if (domain == "rapi.zjwist.com") {
                        url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
                    }
                    myIcon = new BMap.Icon("http://dt.zbta.net/images/shop_icon.png", new BMap.Size(30, 48));
                    break;
                case "7":
                    url = "http://" + domain + "/Playinfo.aspx?type=audit&UnitID=" + item.unitid;
                    typename = "娱乐";
                    if (domain == "rapi.zjwist.com") {
                        url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
                    }
                    myIcon = new BMap.Icon("http://dt.zbta.net/images/enter_icon.png", new BMap.Size(30, 48));
                    break;
                default:
                    url = "details.html?unitid=" + item.unitid;
                    typename = "公共服务";
                    if (item.poitypetag == "超市") {
                        myIcon = new BMap.Icon("http://dt.zbta.net/images/consult_icon.png", new BMap.Size(30, 48));
                    }
                    else if (item.poitypetag == "长途汽车站") {
                        myIcon = new BMap.Icon("http://dt.zbta.net/images/gather_icon.png", new BMap.Size(30, 48));
                    }
                    else if (item.poitypetag == "加油加气站") {
                        myIcon = new BMap.Icon("http://dt.zbta.net/images/gas_icon.png", new BMap.Size(30, 48));
                    }
                    else if (item.poitypetag == "汽车维修") {
                        myIcon = new BMap.Icon("http://dt.zbta.net/images/repair_icon.png", new BMap.Size(30, 48));
                    }
                    else if (item.poitypetag == "公共厕所") {
                        myIcon = new BMap.Icon("http://dt.zbta.net/images/toilet_icon.png", new BMap.Size(30, 48));
                    }
                    else {
                        myIcon = new BMap.Icon("http://dt.zbta.net/images/consult_icon.png", new BMap.Size(30, 48));
                    }
                
                
            }
            
            
            // if (item.typeid == "311") {
            //     url = "http://" + domain + "/SiteInfo.aspx?type=audit&UnitID=" + item.unitid;
            //     typename = "景区";
            //     if (domain == "rapi.zjwist.com") {
            //         url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
            //     }
            //     myIcon = new BMap.Icon("http://dt.zbta.net/images/scenic_icon.Png", new BMap.Size(30, 48));
            // }
            // else if (item.typeid == "312") {
            //     url = "http://" + domain + "/hotelinfo.aspx?type=audit&UnitID=" + item.unitid;
            //     typename = "酒店";
            //     if (domain == "rapi.zjwist.com") {
            //         url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
            //     }
            //     myIcon = new BMap.Icon("http://dt.zbta.net/images/hotel_icon.png", new BMap.Size(30, 48));
            // }
            // else if (item.typeid == "314") {
            //     url = "http://" + domain + "/VillageInfo.aspx?type=audit&UnitID=" + item.unitid;
            //     typename = "乡村旅游";
            //     if (domain == "rapi.zjwist.com") {
            //         url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
            //     }
            //     myIcon = new BMap.Icon("http://dt.zbta.net/images/form_icon.png", new BMap.Size(30, 48));
            // }
            // else if (item.typeid == "313") {
            //     url = "http://" + domain + "/Travelinfo.aspx?type=audit&UnitID=" + item.unitid;
            //     typename = "旅行社";
            //     if (domain == "rapi.zjwist.com") {
            //         url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
            //     }
            //     myIcon = new BMap.Icon("http://dt.zbta.net/images/travel_icon.png", new BMap.Size(30, 48));
            // }
            // else if (item.typeid == "315") {
            //     url = "http://" + domain + "/ResInfo.aspx?type=audit&UnitID=" + item.unitid;
            //     typename = "餐饮";
            //     if (domain == "rapi.zjwist.com") {
            //         url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
            //     }
            //     myIcon = new BMap.Icon("http://dt.zbta.net/images/res_icon.png", new BMap.Size(30, 48));
            // }
            // else if (item.typeid == "317") {
            //     url = "http://" + domain + "/Playinfo.aspx?type=audit&UnitID=" + item.unitid;
            //     typename = "娱乐";
            //     if (domain == "rapi.zjwist.com") {
            //         url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
            //     }
            //     myIcon = new BMap.Icon("http://dt.zbta.net/images/enter_icon.png", new BMap.Size(30, 48));
            // }
            // else if (item.typeid == "316") {
            //     url = "http://" + domain + "/Shopinfo.aspx?type=audit&UnitID=" + item.unitid;
            //     typename = "购物";
            //     if (domain == "rapi.zjwist.com") {
            //         url = "http://dt.zbta.net/details/#/mainpage/" + item.unitid;
            //     }
            //     myIcon = new BMap.Icon("http://dt.zbta.net/images/shop_icon.png", new BMap.Size(30, 48));
            // }
            // else {
            //     //return false;
            //     url = "details.html?unitid=" + item.unitid;
            //     typename = "公共服务";
            //     if (item.poitypetag == "超市") {
            //         myIcon = new BMap.Icon("http://dt.zbta.net/images/consult_icon.png", new BMap.Size(30, 48));
            //     }
            //     else if (item.poitypetag == "长途汽车站") {
            //         myIcon = new BMap.Icon("http://dt.zbta.net/images/gather_icon.png", new BMap.Size(30, 48));
            //     }
            //     else if (item.poitypetag == "加油加气站") {
            //         myIcon = new BMap.Icon("http://dt.zbta.net/images/gas_icon.png", new BMap.Size(30, 48));
            //     }
            //     else if (item.poitypetag == "汽车维修") {
            //         myIcon = new BMap.Icon("http://dt.zbta.net/images/repair_icon.png", new BMap.Size(30, 48));
            //     }
            //     else if (item.poitypetag == "公共厕所") {
            //         myIcon = new BMap.Icon("http://dt.zbta.net/images/toilet_icon.png", new BMap.Size(30, 48));
            //     }
            //     else {
            //         myIcon = new BMap.Icon("http://dt.zbta.net/images/consult_icon.png", new BMap.Size(30, 48));
            //     }
            // }
            
            var points = new BMap.Point(lal[1], lal[0]);
            var marker = new BMap.Marker(points, {icon: myIcon});
            var result = BMapLib.GeoUtils.isPointInRect(points, zjwMap.getBounds());
            
            
            // console.log(result);
            // debugger;
            if (result == true) {
                zjwMap.addOverlay(marker);
                var content = '<div style="margin:0;line-height:20px;padding:2px;">';
                if (item.FlagPic != "") {
                    if (item.typeid == "318") {
                        content += '';
                    } else {
                        content += '<img src=' + item.flagpic + ' style="float:right;zoom:1;overflow:hidden;width:120px;height:90px;margin-left:3px;"/>';
                    }
                }
                if (!item.Address) {
                    content += "地址：" + item.address;
                }
                if (item.telephone != "") {
                    content += "<br/>电话：" + item.zonecode + "-" + item.telephone;
                }
                content += '</div>';
                var titleBar = "";
                if (item.typeid != "318") {
                    titleBar = "<span style='font-size:14px'>" + "(" + typename + ")" + item.unitname + "</span>&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "<a href='" + url + "' target='_blank' style='font-size:12px; color: #666;'>详情</a>"
                } else {
                    titleBar = "<span style='font-size:14px'>" + "(" + typename + ")" + item.unitname + "</span>"
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
                marker.addEventListener("click", function (e) {
                    isopen = true;
                    searchInfoWindow.open(marker);
                });
                marker.addEventListener("mouseover", function (e) {
                    this.setTitle(item.unitname);
                });
            }
            index++;
            
        });
    }
    
    var getDesc = function (desc, len) {
        len = len || 15;
        if (!desc) {
            return "";
        }
        if (desc.length > len) {
            return desc.substr(0, len) + "...";
        }
        
        return desc;
    }
    // 渲染函数
    function getList(_typeid) {
        var key = $(".search").val();
        var areacode = $("#selectareacode").val();
        var sort = $("#sort").val();
        var typeid = _typeid; //$.getUrlParam('typeid');
        var pid = $.getUrlParam('pid');
        // var currgpsbd = $.getUrlParam('currgpsbd');
        
        $.getJSON("https://rapi.zjwist.com/wapdisplay/GetUnitList", {
            areacode: areacode, // 这个参数应该是从上一个页面来的
            pid: pid, // 这个参数应该是从上一个页面来的
            typeid: typeid, // 这个参数应该是从上一个页面来的
            currbdlnt: currbdlnt,//经度,
            currbdlat: currbdlat,//纬度
            pageindex: pageindex, // 这个参数是无限加载的, 加载一次就+1
            pagesize: pagesize,
            key: key,
            sort: sort
        }, function (data) {
            if (data.code == 0) {
                // 在这里面, 去渲染数据, 把数据组装起来
                var unitinfostr = "";
                var star = "AAAAA";
                var start = "☆☆☆☆☆";
                $.each(data.data, function (index, unitinfo) {
                    unitinfostr += "<a href='details.html?unitid=" + unitinfo.unitid + "'><div class='details_one'>";
                    unitinfostr += "<img src='" + unitinfo.flagpic + "?width=130'>";
                    unitinfostr += "<h1>" + unitinfo.unitname + "</h1>";
                    if (unitinfo.address) {
                        unitinfostr += "<p>" + getDesc(unitinfo.address) + "</p>";
                    } else {
                        unitinfostr += "<p> </p>";
                    }
                    unitinfostr += "<div class='details_four_two'>";
                    if (unitinfo.level > 0 && unitinfo.level < 6) {
                        
                        unitinfostr += "<div class='details_four'>";
                        
                        if (unitinfo.typeorderno == 2) {
                            unitinfostr += "<p>" + start.substr(0, unitinfo.level) + "</p>";
                        } else {
                            unitinfostr += "<p>" + star.substr(0, unitinfo.level) + "</p>";
                        }
                        
                        unitinfostr += "</div>";
                    }
                    
                    unitinfostr += "<div class='details_four_one'>";
                    unitinfostr += "<p>距离" + parseInt(unitinfo.distance * 100, 10) / 100 + "km</p>";
                    unitinfostr += "</div>";
                    unitinfostr += "</div>";
                    unitinfostr += "</div>";
                });
                
                $("#view").append(unitinfostr);
                
                if ((pageindex * pagesize) > data.totalcount) {
                    $(".bttom").html("没有更多数据哦！");
                }
                addMapLayer(data.data);
            }
        });
    }
    
    $(".J-load-more").on("click", function (ev) {
        ev.stopPropagation();
        pageindex++;
        getList($.getUrlParam('typeid'));
    });
    // 搜索事件
    $("#search").on("keyup", function () {
        getList($.getUrlParam('typeid'));
    })
    // 切换地区事件
    $("#selectareacode").change(function () {
        getList($.getUrlParam('typeid'));
    })
    // 切换排序方式事件
    $("#sort").change(function () {
        $("#view").empty();
        pageindex = 1;
        getList($.getUrlParam('typeid'));
    })
    //获取当前百度经纬度
    GetCurrbdgps();
    var GetTypeInfo = function () {
        $.getJSON("https://rapi.zjwist.com/wapdisplay/indexpage", {pid: pid}, function (data) {
            if (data.code == 0) {
                var typeinfostr = "";
                typeinfostr += " <div class='backSearch'>返回</div>"
                typeinfostr += " <ul>";
                $.each(data.data.typeinfos, function (index, typeinfo) {
                    
                    typeinfostr += " <li class='j-jq' typeid='" + typeinfo.typeid + "'>" + typeinfo.mobilememo + "</li>";
                    
                });
                typeinfostr += "</ul>";
                $(".topNavMap").append(typeinfostr);
            }
        })
    }
    
    GetTypeInfo();
    $(document).on("click", ".j-jq", function () {
        getList($(this).attr("typeid"));
        console.log(123);
    });
    
}

// GetAreaCode();
        
    

