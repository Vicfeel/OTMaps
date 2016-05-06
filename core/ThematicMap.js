/**
 * @author 张伟佩
 * @version 1.0
 * @date 2016-05-04
 * @description 专题图父类
 */

define(["esri/InfoTemplate", "esri/layers/FeatureLayer", "esri/tasks/query", "esri/graphic"], function (InfoTemplate, FeatureLayer, Query, Graphic) {
    function ThematicMap(options, callBack) {
        if (arguments.length) {
            //默认属性
            var defaultOpts = {
                /* 必要参数 */
                map: null,
                layerUrl: null,
                statData: [],
                dataTag: "",
                corString: [],
                /* 可选参数 */
                fieldName: 'STAT_VALUE',
                legendID: 'legendDiv'
            };
            for (var item in defaultOpts) {
                options[item] = options[item] || defaultOpts[item];
            }
            //必要属性检查
            if (!options.map || !options.layerUrl || !options.corString || !options.dataTag) {
                throw new Error('初始化错误：缺少必要参数！');
            }
            this.options = options;
            this.map = options.map;
            init(this, callBack);
        }
    }

    //初始化
    function init(me, callBack) {
        var infoTemplate = new InfoTemplate("值为${" + me.options.fieldName + "}", "");
        var layer = new FeatureLayer(me.options.layerUrl, {
            "mode": FeatureLayer.MODE_SNAPSHOT,
            "opacity": 1
        });

        var query = new Query();
        query.outFields = ["*"];
        query.where = "1=1";
        layer.queryFeatures(query, function (data) {
            data.fields.push({
                "name": me.options.fieldName,
                "alias": "统计数据",
                "type": "esriFieldTypeDouble"
            });
            var features = [];
            data.features.forEach(function (v) {
                var attr = {};
                for(var att in v.attributes)
                    attr[att] = v.attributes[att];
                for (var i = 0; i < me.options.statData.length; i++) {
                    var checked = 0;
                    me.options.corString.forEach(function (item) {
                        var fd = item.substring(0,item.indexOf('='));
                        var value = item.substring(item.indexOf('=') + 1);
                        if (fd.indexOf('&') < 0) {
                            if (me.options.statData[i][fd] == v.attributes[value])
                                checked++;
                        }
                        else {
                            fd = fd.substring(1);
                            if (me.options.statData[i][fd] == value)
                                checked++;
                        }
                    });
                    if (checked == me.options.corString.length && checked != 0) {
                        attr[me.options.fieldName] = parseFloat(me.options.statData[i][me.options.dataTag]);
                        break;
                    }
                }
                var graphic = new Graphic(v.geometry);
                graphic.setAttributes(attr);
                features.push(graphic);
            });
            var featureCollection = {
                "layerDefinition": {
                    "geometryType": data.geometryType,
                    "fields": data.fields
                },
                "featureSet": {
                    "features": [],
                    "geometryType": data.geometryType
                }
            };
            me.drawLayer = new FeatureLayer(featureCollection, {
                id: 'statUnits',
                "mode": FeatureLayer.MODE_SNAPSHOT,
                "infoTemplate": infoTemplate,
                "opacity": 1
            });
            me.options.map.on("layers-add-result", function () {
                me.drawLayer.applyEdits(features, null, null);
                callBack();
            });
            me.options.map.addLayers([me.drawLayer]);
        });
    }

    /* 公有方法 */
    //绘制专题图
    ThematicMap.prototype.draw = function (callback, err) {
    };
    //专题图重绘
    ThematicMap.prototype.fresh = function (callback, err) {
    };
    //清除专题图
    ThematicMap.prototype.clear = function () {
        drawLayer.clear();
    };

    return ThematicMap;
});