/**
 *
 *  Author: Vicfeel
 *  Date: 16/7/19
 *  Descirption: 绘制范围值专题图
 *
 **/
require(["OTMap/index", "esri/layers/FeatureLayer", "esri/map", "esri/renderers/smartMapping", "esri/layers/ArcGISDynamicMapServiceLayer", "dojo/domReady!"],
    function (OTMap, FeatureLayer, Map, smartMapping, ArcGISDynamicMapServiceLayer) {
        //初始化地图对象
        var map = new Map("map", {
            logo: false,
            showAttribution: false
        });
        //解决跨域请求
        esriConfig.defaults.io.corsDetection = false;
        //加载动态地图服务
        var layer = new ArcGISDynamicMapServiceLayer("//sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/SuperTuesdaySample/MapServer", {
            "mode": FeatureLayer.MODE_SNAPSHOT,
            "opacity": 1
        });
        map.addLayer(layer);
        //待服务加载完成后，设置视野范围到全图范围
        layer.on('load', function () {
            var extent = map.getLayer(map.layerIds[0]).fullExtent;
            extent.spatialReference = map.spatialReference;
            map.setExtent(extent);
        });
        debugger;
        //专题制图统计单元服务地址（以ESRI在线免费服务为例）
        var serviceURL = "//sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/SuperTuesdaySample/MapServer/1";
        //初始化OTMap对象
        var rangeMap = new OTMap('range');
        //独立统计数据
        var statData = [{
            'id': 1,
            'people': 15000
        }, {
            'id': 2,
            'people': 20000
        }, {
            'id': 3,
            'people': 21000
        }, {
            'id': 4,
            'people': 10000
        }, {
            'id': 5,
            'people': 21000
        }, {
            'id': 6,
            'people': 12000
        }, {
            'id': 7,
            'people': 11000
        }, {
            'id': 8,
            'people': 30000
        }, {
            'id': 9,
            'people': 40000
        }, {
            'id': 10,
            'people': 31000
        }, {
            'id': 11,
            'people': 24000
        }, {
            'id': 12,
            'people': 41000
        }, {
            'id': 13,
            'people': 15000
        }, {
            'id': 14,
            'people': 13000
        }, {
            'id': 15,
            'people': 32000
        }, {
            'id': 16,
            'people': 34000
        }, {
            'id': 17,
            'people': 30000
        }, {
            'id': 18,
            'people': 23000
        }, {
            'id': 19,
            'people': 22000
        }, {
            'id': 20,
            'people': 14000
        }, {
            'id': 21,
            'people': 17000
        }, {
            'id': 22,
            'people': 18000
        }, {
            'id': 23,
            'people': 22000
        }, {
            'id': 24,
            'people': 24000
        }];
        //设置参数（详细参数请参见API)
        rangeMap.setConfig({
            map: map,
            layer: {
                url: serviceURL, //服务地址
                baseTag: "people", //统计字段
                simple: false,   //统计数据来自外部统计数据时，选择false
                statData: statData, //对应外部统计数据
                corString: ["id=OBJECTID"]  //声明外部统计数据与地图服务中要素的对应关系
            },
            style: {
                baseColor: "#27ae60" //范围颜色
            },
            label: {
                show: true,
                field: 'NAME'
            },
            legend: {
                show: true,
                title: "州人数（万）"
            }
        });
        //绑定事件
        document.getElementById('btnDraw').onclick = function () {
            //绘制专题图
            rangeMap.draw(function () {
                //回调函数
                console.log("绘制完成");
            });
        };
        document.getElementById('btnClear').onclick = function () {
            //清除专题图
            rangeMap.clear();
        };
    });