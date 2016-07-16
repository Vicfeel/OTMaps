/**
 *
 *  Author: Vicfeel
 *  Date: 16/7/16
 *  Descirption: 绘制范围值专题图
 *
 **/
require(["OTMap/index", "esri/layers/FeatureLayer", "esri/map", "dojo/domReady!"],
    function (OTMap, FeatureLayer, Map) {
        //初始化地图对象
        var map = new Map("map", {
            basemap: "streets",
            center: [-98.215, 38.382],
            zoom: 7,
            logo: false,
            showAttribution: false
        });
        //服务地址
        var serviceURL = "//sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/3";

        //初始化OTMap对象
        var rangeMap = new OTMap('range');
        //设置参数（详细参数请参见API)
        rangeMap.setConfig({
            map: map,
            layer: {
                url: serviceURL, //服务地址
                baseTag: "POP07_SQMI" //统计字段
            },
            style: {
                baseColor: "#27ae60" //范围颜色
            },
            label: {
                show: false,
                field: "STATE_NAME"//标注字段
            }
        });
        //绑定时间
        document.getElementById('btnDraw').onclick = function () {
            //绘制热力图
            rangeMap.draw(function () {
                //回调函数
                console.log("绘制完成");
            });
        };
        document.getElementById('btnClear').onclick = function () {
            //清除热力图
            rangeMap.clear();
        };
    });