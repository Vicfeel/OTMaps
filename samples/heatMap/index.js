/**
 *
 *  Author: Vicfeel
 *  Date: 16/7/16
 *  Descirption: 绘制热力图
 *
 **/
require(["OTMap/index", "esri/layers/FeatureLayer", "esri/map", "dojo/domReady!"],
    function (OTMap, FeatureLayer, Map) {
        //初始化地图对象
        var map = new Map("map", {
            basemap: "gray",
            zoom: 3,
            center: [-103, 18],
            minZoom: 3,
            maxZoom: 5,
            logo: false,
            showAttribution: false
        });
        //服务地址
        var serviceURL = "//services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Earthquakes_Since_1970/FeatureServer/0";

        //初始化OTMap 热力图对象
        var heatMap = new OTMap('heat');
        //设置参数（详细参数请参见API)
        heatMap.setConfig({
            map: map,
            layer: {
                url: serviceURL
            }
        });
        //绑定时间
        document.getElementById('btnDraw').onclick = function () {
            //绘制热力图
            heatMap.draw(function () {
                //回调函数
                console.log("绘制完成");
            });
        };
        document.getElementById('btnClear').onclick = function () {
            //清除热力图
            heatMap.clear();
        };
    });