/**
 * @author 张伟佩
 * @version 1.0
 * @date 2016-05-08
 * @description 绘制工具
 */
define(["esri/Color", "esri/dijit/Legend", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/TextSymbol",
        "esri/layers/LabelClass", "esri/symbols/Font", "esri/InfoTemplate", "esri/layers/FeatureLayer", "esri/tasks/query", "esri/graphic"],
    function (Color, Legend, SimpleFillSymbol, SimpleLineSymbol, TextSymbol,
              LabelClass, Font, InfoTemplate, FeatureLayer, Query, Graphic) {
        function DrawUtil() {
        }

        //创建普通图层
        DrawUtil.prototype.createSLayer = function (me, callback) {
            if (!me.draw || !me.clear) return false;
            var layerConfig = me.config.layer;
            //必要属性检查
            if (!layerConfig.url)
                throw new Error('ThematicMap Error 1001：some required params absent in config,use [setConfig] to fix it');

            if (me.drawLayer) {
                me.map.removeLayer(me.drawLayer);
                me.drawLayer = null;
            }
            var infoTemplate = me.config.popup.show ? new InfoTemplate(me.config.popup) : null;
            me.drawLayer = new FeatureLayer(layerConfig.url, {
                id: layerConfig.id,
                mode: FeatureLayer.MODE_SNAPSHOT,
                infoTemplate: infoTemplate,
                "opacity": 1
            });
            me._binded && me._binded.remove();
            me._binded = me.map.on("layers-add-result", function () {
                me.drawLayer.applyEdits(features, null, null);
                if (callback) callback();
            });
            me.map.addLayers([me.drawLayer]);
        };

        //结合统计数据，创建制图图层
        DrawUtil.prototype.createMLayer = function (me, callback) {
            var obj = this;
            if (!me.draw || !me.clear) return false;
            var layerConfig = me.config.layer;
            //必要属性检查
            if (!me.map || !layerConfig.url || !layerConfig.corString || !layerConfig.baseTag)
                throw new Error('ThematicMap Error 1001：some required params absent in config,use [setConfig] to fix it');

            if (me.drawLayer) {
                me.map.removeLayer(me.drawLayer);
                me.drawLayer = null;
            }
            var infoTemplate = me.config.popup.show ? new InfoTemplate(me.config.popup) : null;
            var layer = new FeatureLayer(layerConfig.url, {
                "mode": FeatureLayer.MODE_SNAPSHOT,
                "opacity": 1
            });
            var query = new Query();
            query.outFields = ["*"];
            query.where = "1=1";
            layer.queryFeatures(query, function (data) {
                me._features = data.features;
                data.fields.push({
                    "name": layerConfig.fieldName,
                    "alias": "统计数据",
                    "type": "esriFieldTypeDouble"
                });
                var features = [];
                data.features.forEach(function (v) {
                    var attr = {};
                    for (var att in v.attributes)
                        attr[att] = v.attributes[att];
                    //获得对应数据
                    if (!obj.getCorData(layerConfig.statData, v, layerConfig.corString, layerConfig.baseTag) === false)
                        attr[layerConfig.fieldName] = obj.getCorData(layerConfig.statData, v, layerConfig.corString, layerConfig.baseTag);
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
                    id: layerConfig.id,
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    infoTemplate: infoTemplate,
                    opacity: 1
                });

                me._binded && me._binded.remove();
                me._binded = me.map.on("layers-add-result", function () {
                    me.drawLayer.applyEdits(features, null, null);
                    if (callback) callback();
                });
                me.map.addLayers([me.drawLayer]);
            });
        };

        //创建标注
        DrawUtil.prototype.createLabel = function (me, label) {
            if (!me.draw || !me.clear) return false;
            if (!label.field)
                throw new Error('ThematicMap错误1003：未指定标注字段[labelField]!');
            var defaultLabel = {
                color: '#000',
                size: 13,
                family: 'Microsoft Yahei',
                bold: false
            };
            for (var item in defaultLabel)
                label[item] = label[item] || defaultLabel[item];
            //设置标注
            var statesLabel = new TextSymbol().setColor(label.color);
            statesLabel.font.setSize(label.size + "pt");
            if (label.bold)
                statesLabel.font.setWeight(Font.WEIGHT_BOLD);
            statesLabel.font.setFamily(label.family);
            var json = {
                "labelExpressionInfo": {"value": "{" + label.field + "}"}
            };
            var labelClass = new LabelClass(json);
            labelClass.symbol = statesLabel;
            me.drawLayer.setLabelingInfo([labelClass]);
        };

        //创建图例
        DrawUtil.prototype.createLegend = function (me, legend) {
            if (!me.draw || !me.clear) return false;
            if (me.legend)
                me.legend.destroy();
            var lgd = document.createElement('div');
            lgd.id = legend.id;
            document.getElementById(me.map.id).appendChild(lgd);
            me.legend = new Legend({
                map: me.map,
                layerInfos: [{
                    layer: me.drawLayer,
                    title: legend.title
                }]
            }, lgd);
            me.legend.startup();
        };

        //获取对应统计数据
        DrawUtil.prototype.getCorData = function (statData, feature, corString, dataTag) {
            for (var i = 0; i < statData.length; i++) {
                var checked = 0;
                corString.forEach(function (item) {
                    var fd = item.substring(0, item.indexOf('='));
                    var value = item.substring(item.indexOf('=') + 1);
                    if (fd.indexOf('&') < 0) {
                        if (statData[i][fd] == feature.attributes[value])
                            checked++;
                    }
                    else {
                        fd = fd.substring(1);
                        if (statData[i][fd] == value)
                            checked++;
                    }
                });
                if (checked == corString.length && checked != 0) {
                    return parseFloat(statData[i][dataTag]);
                }
            }
            return false;
        };

        return new DrawUtil();
    });


