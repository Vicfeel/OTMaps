/**
 * @author 张伟佩
 * @version 1.0
 * @date 2016-05-08
 * @description 核心绘制组件
 */
define(["app/tool/ThematicMaps/Utils/ColorUtil", "esri/Color", "esri/dijit/Legend", "esri/symbols/TextSymbol", "esri/geometry/Polygon", "esri/geometry/Point",
        "esri/layers/LabelClass", "esri/symbols/Font", "esri/InfoTemplate", "esri/layers/FeatureLayer", "esri/tasks/query", "esri/graphic", "esri/geometry/Extent",
        "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/renderers/smartMapping", "esri/renderers/ClassBreaksRenderer"],
    function (ColorUtil, Color, Legend, TextSymbol, Polygon, Point,
              LabelClass, Font, InfoTemplate, FeatureLayer, Query, Graphic, Extent,
              SimpleFillSymbol, SimpleLineSymbol, smartMapping, ClassBreaksRenderer) {
        function DrawUtil() {
        }

        /* 创建方法 */
        //创建普通图层
        DrawUtil.prototype.createSLayer = function (me, callback) {
            var obj = this;
            if (!me.draw || !me.clear) return false;
            var layerConfig = me.config.layer;
            //必要属性检查
            var statTag = me.config.layer.statTag;
            if (typeof statTag === 'string')
                statTag = [statTag];
            if (!me.map)
                throw new Error('ThematicMap Error 1001：[map] is required in config,use [setConfig] method to fix it');
            if (!layerConfig.statTag.length || !layerConfig.url)
                throw new Error('ThematicMap Error 1002：some required params absent in layer config,use [setConfig] or [setLayer] method to fix it');

            var infoTemplate = me.config.popup.show ? new InfoTemplate(me.config.popup) : null;
            var layer = new FeatureLayer(layerConfig.url, {
                "mode": FeatureLayer.MODE_SNAPSHOT,
                "opacity": 1
            });
            var query = new Query();
            query.outFields = ["*"];
            query.where = "1=1";
            layer.queryFeatures(query, function (data) {
                data.fields.push({
                    "name": 'tagForDiffColor',
                    "alias": "区分颜色",
                    "type": "esriFieldTypeDouble"
                });
                var features = [];
                data.features.forEach(function (v, i) {
                    var attr = {};
                    for (var att in v.attributes)
                        attr[att] = v.attributes[att];
                    attr['tagForDiffColor'] = i;
                    var graphic = new Graphic(v.geometry);
                    graphic.setAttributes(attr);
                    features.push(graphic);
                });
                me._features = features;
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
                me.drawLayer = me.shareProp.drawLayer = new FeatureLayer(featureCollection, {
                    id: layerConfig.id,
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    infoTemplate: infoTemplate,
                    opacity: 1
                });

                me._binded && me._binded.remove();
                me._binded = me.map.on("layers-add-result", function () {
                    debugger;
                    me.drawLayer.applyEdits(features, null, null);
                    callback && callback();
                });
                me.map.addLayers([me.drawLayer]);
            });
        };

        //结合统计数据，创建制图图层
        DrawUtil.prototype.createMLayer = function (me, callback) {
            var obj = this;
            if (!me.draw || !me.clear) return false;
            var layerConfig = me.config.layer;
            //必要属性检查
            if (!me.map)
                throw new Error('ThematicMap Error 1001：[map] is required in config,use [setConfig] method to fix it');
            if (!layerConfig.url || !layerConfig.corString.length || (!layerConfig.statTag.length && !layerConfig.baseTag))
                throw new Error('ThematicMap Error 1002：some required params absent in layer config,use [setConfig] or [setLayer] method to fix it');

            var infoTemplate = me.config.popup.show ? new InfoTemplate(me.config.popup) : null;
            var layer = new FeatureLayer(layerConfig.url, {
                "mode": FeatureLayer.MODE_SNAPSHOT,
                "opacity": 1
            });
            var query = new Query();
            query.outFields = ["*"];
            query.where = "1=1";
            layer.queryFeatures(query, function (data) {
                //添加字段
                layerConfig.baseTag && data.fields.push({
                    "name": layerConfig.baseTag,
                    "alias": "底图统计数据",
                    "type": "esriFieldTypeDouble"
                });
                layerConfig.statTag.length && layerConfig.statTag.forEach(function (tag, i) {
                    data.fields.push({
                        "name": tag,
                        "alias": "统计数据" + i,
                        "type": "esriFieldTypeDouble"
                    });
                });
                var features = [];
                //添加数据
                data.features.forEach(function (v) {
                    var attr = {};
                    for (var att in v.attributes)
                        attr[att] = v.attributes[att];
                    if (!obj.getCorData(layerConfig.statData, v, layerConfig.corString, layerConfig.baseTag) === false)
                        attr[layerConfig.baseTag] = obj.getCorData(layerConfig.statData, v, layerConfig.corString, layerConfig.baseTag);
                    layerConfig.statTag.length && layerConfig.statTag.forEach(function (tag) {
                        if (!obj.getCorData(layerConfig.statData, v, layerConfig.corString, tag) === false)
                            attr[tag] = obj.getCorData(layerConfig.statData, v, layerConfig.corString, tag);
                    });
                    var graphic = new Graphic(v.geometry);
                    graphic.setAttributes(attr);
                    features.push(graphic);
                });
                me._features = features;
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
                me.drawLayer = me.shareProp.drawLayer = new FeatureLayer(featureCollection, {
                    id: layerConfig.id,
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    infoTemplate: infoTemplate,
                    opacity: 1
                });

                me._binded && me._binded.remove();
                me._binded = me.shareProp._binded = me.map.on("layers-add-result", function () {
                    me.drawLayer.applyEdits(features, null, null);
                    callback && callback();
                });
                me.map.addLayers([me.drawLayer]);
            });
        };

        //创建标注
        DrawUtil.prototype.createLabel = function (me) {
            if (!me.draw || !me.clear) return false;
            var labelConfig = me.config.label;
            if (!labelConfig.field)
                throw new Error('ThematicMap Error 1003：[field] is required in label config,use [setConfig] method to fix it');
            me._features.forEach(function (feature) {
                    var geometry = feature.geometry;
                    var center = geometry.getCentroid();
                    //标注位置
                    var point = new Point(center.x + labelConfig.xoffset, center.y + labelConfig.yoffset, feature.spatialReference);
                    //标注样式
                    var statesLabel = new TextSymbol(feature.attributes[labelConfig.field]).setColor(labelConfig.color);
                    statesLabel.font.setSize(labelConfig.size + "pt");
                    if (labelConfig.bold)
                        statesLabel.font.setWeight(Font.WEIGHT_BOLD);
                    statesLabel.font.setFamily(labelConfig.family);

                    me.drawLayer.add(new Graphic(point, statesLabel));
                }
            );
        };

        //创建图例
        DrawUtil.prototype.createLegend = function (me) {
            if (!me.draw || !me.clear) return false;
            var legendConfig = me.config.legend;
            if (!legendConfig.id)
                throw new Error('ThematicMap Error 1004：[id] is required in label config,use [setConfig] method to fix it');
            if (me.shareProp.legend)
                me.shareProp.legend.destroy();
            var lgd = document.createElement('div');
            lgd.id = legendConfig.id;
            document.getElementById(me.map.id).appendChild(lgd);
            me.legend = me.shareProp.legend = new Legend({
                map: me.map,
                layerInfos: [{
                    layer: me.drawLayer,
                    title: legendConfig.title
                }]
            }, lgd);
            me.legend.startup();
        };

        /* 绘制方法 */
        //绘制范围分级图
        DrawUtil.prototype.drawRange = function (me, callback) {
            var obj = this;
            var baseTag = me.config.layer.baseTag;
            var styleConfig = me.config.style;
            //创建渲染
            smartMapping.createClassedColorRenderer({
                layer: me.drawLayer,
                field: baseTag,
                basemap: 'topo',
                classificationMethod: styleConfig.classicMethod,
                numClasses: 5
            }).then(function (response) {
                var renderer = new ClassBreaksRenderer(null, baseTag);
                var colors = ColorUtil.getGradientColor('#ddd', styleConfig.baseColor, response.classBreakInfos.length + 1);
                me._classBreakInfos = response.classBreakInfos;
                response.classBreakInfos.forEach(function (v, i) {
                    var symbol = new SimpleFillSymbol();
                    symbol.setColor(new Color(colors[i + 1]));
                    symbol.setOutline(new SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new Color([75, 75, 75, 0.8]), 1));
                    renderer.addBreak(v.minValue, v.maxValue, symbol);
                });
                me.drawLayer.setRenderer(renderer);
                callback && callback();
            });
        };

        DrawUtil.prototype.drawUnique = function (me, callback) {
            var obj = this;
            var fieldName = 'OBJECTID';
            for (var i = 0; i < me.drawLayer.fields.length; i++) {
                if (me.drawLayer.fields[i].name.toUpperCase() == 'OBJECTID') {
                    fieldName = me.drawLayer.fields[i].name;
                    break;
                }
            }
            var styleConfig = me.config.style;
            //创建渲染
            smartMapping.createTypeRenderer({
                layer: me.drawLayer,
                field: fieldName,
                basemap: 'streets',
                numTypes: -1
            }).then(function (response) {
                me.drawLayer.setRenderer(response.renderer);
                callback && callback();
            });
        };

        DrawUtil.prototype.drawHistogram = function (me) {
            var obj = this;
            var layerConfig = me.config.layer;
            var chartWidth = 0.015;
            var chartHeight = 0.07;
            var maxStatValue = getMaxValue();
            var colors = ColorUtil.getGradientColor(me.config.style.statColor, '#ddd', layerConfig.statTag.length + 1).slice(0, layerConfig.statTag.length);
            me._features.forEach(function (feature) {
                for (var i = 0; i < layerConfig.statTag.length; i++) {
                    debugger;
                    var geometry = feature.geometry;
                    var center = geometry.getCentroid();
                    var xStart = center.x - (chartWidth * layerConfig.statTag.length) / 2;
                    var yStart = center.y;
                    var x = xStart + i * (chartWidth);
                    var xEnd = xStart + (i + 1) * (chartWidth);
                    var statData = feature.attributes[layerConfig.statTag[i]];
                    var yEnd = center.y + chartHeight * statData / maxStatValue;
                    var extent = new Extent(x, yStart, xEnd, yEnd, feature.spatialReference);
                    var symbol = new SimpleFillSymbol().setColor(colors[i]);
                    symbol.outline.setWidth(0);
                    me.drawLayer.add(new Graphic(extent, symbol));
                }
            });


            function getMaxValue() {
                //var minValue = Infinity, maxValue = -Infinity;
                var data = [];
                me._features.forEach(function (feature) {
                    for (var i = 0; i < layerConfig.statTag.length; i++) {
                        data.push(feature.attributes[layerConfig.statTag[i]]);
                    }
                });
                data.sort(function (a, b) {
                    return a - b
                });
                return data[data.length - 1];
            }
        }

        /* 辅助方法 */
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
    })
;


