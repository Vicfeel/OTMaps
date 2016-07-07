/**
 * @author Vicfeel
 * @version 1.0
 * @date 2016-05-08
 * @description 核心绘制组件
 */
define(["OTMap/Utils/ColorUtil", "esri/Color", "OTMap/components/Legend", "esri/symbols/TextSymbol", "esri/geometry/Polygon", "esri/geometry/Point", "esri/geometry/Circle",
        "esri/layers/LabelClass", "esri/symbols/Font", "esri/InfoTemplate", "esri/layers/FeatureLayer", "esri/tasks/query", "esri/graphic", "esri/geometry/Extent",
        "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol",
        "esri/renderers/smartMapping", "esri/renderers/ClassBreaksRenderer", "esri/renderers/HeatmapRenderer"],
    function (ColorUtil, Color, Legend, TextSymbol, Polygon, Point, Circle,
              LabelClass, Font, InfoTemplate, FeatureLayer, Query, Graphic, Extent,
              SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,
              smartMapping, ClassBreaksRenderer, HeatmapRenderer) {
        function DrawUtil() {
        }

        var diffField = "tagForDiffColor";
        /* 创建方法 */
        //创建普通统计图层
        DrawUtil.prototype.createSLayer = function (me, callback) {
            var obj = this;
            if (!me.draw || !me.clear) return false;

            var layerConfig = me.config.layer;
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
                    "name": diffField,
                    "alias": "区分颜色",
                    "type": "esriFieldTypeDouble"
                });
                var features = [];
                data.features.forEach(function (v, i) {
                    var attr = {};
                    for (var att in v.attributes)
                        attr[att] = v.attributes[att];
                    attr[diffField] = i;
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

                me.shareProp._binded && me.shareProp._binded.remove();
                me.shareProp._binded = me.shareProp.map.on("layers-add-result", function () {
                    me.drawLayer.applyEdits(features, null, null);
                    callback && callback();
                });
                me.map.addLayers([me.drawLayer]);
            });
            return obj;
        };
        //结合统计数据，创建统计图层
        DrawUtil.prototype.createMLayer = function (me, callback) {
            var obj = this;
            if (!me.draw || !me.clear) return false;
            var layerConfig = me.config.layer;
            //必要属性检查
            if (typeof me.config.layer.statTag === 'string')
                me.config.layer.statTag = [me.config.layer.statTag];
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
                data.fields.push({
                    "name": diffField,
                    "alias": "区分颜色",
                    "type": "esriFieldTypeDouble"
                });
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
                data.features.forEach(function (v, i) {
                    var attr = {};
                    attr[diffField] = i;
                    for (var att in v.attributes)
                        attr[att] = v.attributes[att];
                    if (!(obj.getCorData(layerConfig.statData, v, layerConfig.corString, layerConfig.baseTag) === false))
                        attr[layerConfig.baseTag] = obj.getCorData(layerConfig.statData, v, layerConfig.corString, layerConfig.baseTag);
                    layerConfig.statTag.length && layerConfig.statTag.forEach(function (tag) {
                        if (!(obj.getCorData(layerConfig.statData, v, layerConfig.corString, tag) === false))
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

                me.shareProp._binded && me.shareProp._binded.remove();
                me.shareProp._binded = me.shareProp._binded = me.map.on("layers-add-result", function () {
                    me.drawLayer.applyEdits(features, null, null);
                    callback && callback();
                });
                me.map.addLayers([me.drawLayer]);
            });
            return obj;
        };
        //创建标注
        DrawUtil.prototype.createLabel = function (me) {
            var obj = this;
            if (!me.draw || !me.clear) return false;
            var labelConfig = me.config.label;
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
            return obj;
        };
        //创建图例
        DrawUtil.prototype.createLegend = function (me) {
            var obj = this;
            if (!me.draw || !me.clear) return false;
            var legendConfig = me.config.legend;
            if (me.shareProp.legend)
                me.shareProp.legend.destroy();

            me.legend = me.shareProp.legend = new Legend({
                map: me.map,
                id: legendConfig.id,
                title: legendConfig.title,
                info: me._legendInfo
            });

            me.legend.startup();
            return obj;
        };

        /* 绘制方法 */
        //绘制范围值
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
                var legendItems = [];
                response.classBreakInfos.forEach(function (v, i) {
                    //构造图例
                    legendItems.push({
                        color: colors[i + 1],
                        value: v.minValue + '-' + v.maxValue
                    });

                    var symbol = new SimpleFillSymbol();
                    symbol.setColor(new Color(colors[i + 1]));
                    symbol.setOutline(new SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new Color([75, 75, 75, 0.8]), 1));
                    renderer.addBreak(v.minValue, v.maxValue, symbol);
                });
                me._legendInfo.push(legendItems);
                me.drawLayer.setRenderer(renderer);
                callback && callback();
            });
            return obj;
        };
        //绘制唯一值
        DrawUtil.prototype.drawUnique = function (me, callback) {
            var obj = this;
            var styleConfig = me.config.style;
            //创建渲染
            smartMapping.createTypeRenderer({
                layer: me.drawLayer,
                field: diffField,
                basemap: 'streets',
                numTypes: -1
            }).then(function (response) {
                me.drawLayer.setRenderer(response.renderer);
                callback && callback();
            });
            return obj;
        };
        //绘制柱状图
        DrawUtil.prototype.drawHistogram = function (me) {
            var obj = this;
            var layerConfig = me.config.layer;

            var ave = getAverageUnit();
            var chartHeight = ave / 2;
            var chartWidth = chartHeight / 5;
            var maxStatValue = getMaxValue();
            var colors = ColorUtil.getGradientColor(me.config.style.statColor, '#ddd', layerConfig.statTag.length + 1).slice(0, layerConfig.statTag.length);
            me._features.forEach(function (feature) {
                for (var i = 0; i < layerConfig.statTag.length; i++) {
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
                    symbol.setOutline(new SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new Color([75, 75, 75, 0.5]), 0.5));
                    me.drawLayer.add(new Graphic(extent, symbol));
                }
            });
            saveLegend();

            //获取平均统计单元大小
            function getAverageUnit() {
                var min = me._features[0]._extent.ymax - me._features[0]._extent.ymin;
                var max = me._features[0]._extent.ymax - me._features[0]._extent.ymin;
                me._features.forEach(function (f) {
                    min = (f._extent.ymax - f._extent.ymin) < min ? (f._extent.ymax - f._extent.ymin) : min;
                    max = (f._extent.ymax - f._extent.ymin) > max ? (f._extent.ymax - f._extent.ymin) : max;
                });
                return (min + max) / 2;
            }

            //获取最大值
            function getMaxValue() {
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

            //存储图例信息
            function saveLegend() {
                var legendItems = [];
                layerConfig.statTag.forEach(function (tag, i) {
                    legendItems.push({
                        color: colors[i],
                        value: me.config.legend.itemTitle[i] || "默认指标名"
                    })
                });
                me._legendInfo.push(legendItems);
            }

            return obj;
        };
        //绘制饼状图
        DrawUtil.prototype.drawPie = function (me) {
            var obj = this;
            var layerConfig = me.config.layer;
            var colors = ColorUtil.getGradientColor(me.config.style.statColor, '#ddd', layerConfig.statTag.length + 1).slice(0, layerConfig.statTag.length);
            //计算全部值中的最大最小值，用于显示饼的相对大小
            var maxTotalValue = 0, minTotalValue = 0;
            me._features.forEach(function (feature) {
                feature.attributes['totalValue'] = 0;
                //计算总和
                layerConfig.statTag.forEach(function (tag) {
                    feature.attributes['totalValue'] += feature.attributes[tag];
                });
                maxTotalValue = feature.attributes['totalValue'] > maxTotalValue ? feature.attributes['totalValue'] : maxTotalValue;
                minTotalValue = feature.attributes['totalValue'] < minTotalValue ? feature.attributes['totalValue'] : minTotalValue;
            });
            //绘制每个饼
            me._features.forEach(function (feature) {
                var geometry = feature.geometry;
                var center = geometry.getCentroid();
                var startDegree = 0, endDegree = 0;
                var standRadius = (me._features[0]._extent.ymax - me._features[0]._extent.ymin) / 6;
                var pieRadius = maxTotalValue == 0 ? standRadius : standRadius * feature.attributes['totalValue'] / maxTotalValue;
                layerConfig.statTag.forEach(function (tag, i) {
                    var curValue = feature.attributes[tag];
                    endDegree = feature.attributes['totalValue'] == 0 ? 0 : startDegree + Math.PI * 2 * curValue / feature.attributes['totalValue'];
                    var symbol = new SimpleFillSymbol().setColor(colors[i]);
                    symbol.setOutline(new SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new Color([60, 60, 60, 0.6]), 1));
                    //0和全部的情况
                    if (curValue == 0) {
                        return;
                    }
                    else if (curValue === feature.attributes['totalValue']) {
                        var polygon = new Circle(center, {radius: pieRadius});
                    }
                    else {
                        var rings = [];
                        rings.push([center.x, center.y]);
                        getRings(center, rings, startDegree, endDegree, pieRadius);
                        rings.push([center.x, center.y]);
                        polygon = new Polygon(rings);
                    }
                    me.drawLayer.add(new Graphic(polygon, symbol));
                    startDegree = endDegree;
                });
            });
            saveLegend();

            //存储图例信息
            function saveLegend() {
                var legendItems = [];
                layerConfig.statTag.forEach(function (tag, i) {
                    legendItems.push({
                        color: colors[i],
                        value: me.config.legend.itemTitle[i] || "默认指标名"
                    })
                });
                me._legendInfo.push(legendItems);
            }

            function getRingsForHalf(center, rings, startDegree, endDegree, r) {
                var maxDecimal = 0.000001;
                var num = 50;
                var centerX = center.x;
                var centerY = center.y;

                if (startDegree < Math.PI / 2 && endDegree <= Math.PI / 2) {
                    var xSizeBegin = centerX + Math.cos(endDegree) * r;
                    var xSizeEnd = centerX + Math.cos(startDegree) * r;
                    var xSize = xSizeEnd - xSizeBegin;
                    for (var i = num - 1; i >= 0; --i) {
                        var x = xSizeBegin + xSize * (i * 1.0 / (num - 1));
                        var square = r * r - (x - centerX) * (x - centerX);
                        var y = centerY + Math.sqrt(square < 0.0 ? 0.0 : square);
                        rings[rings.length] = [x, y];
                    }
                }
                else if (startDegree >= Math.PI / 2 && endDegree <= Math.PI) {
                    var xSizeBegin = centerX + Math.cos(endDegree) * r;
                    var xSizeEnd = centerX + Math.cos(startDegree) * r;
                    var xSize = xSizeEnd - xSizeBegin;
                    for (var i = num - 1; i >= 0; --i) {
                        var x = xSizeBegin + xSize * (i * 1.0 / (num - 1));
                        var square = r * r - (x - centerX) * (x - centerX);
                        var y = centerY + Math.sqrt(square < 0.0 ? 0.0 : square);
                        rings[rings.length] = [x, y];
                    }
                }
                else if (startDegree >= Math.PI && endDegree <= Math.PI * 3 / 2) {
                    var xSizeBegin = centerX + Math.cos(endDegree) * r;
                    var xSizeEnd = centerX + Math.cos(startDegree) * r;
                    var xSize = xSizeEnd - xSizeBegin;
                    for (var i = num - 1; i >= 0; --i) {
                        var x = xSizeBegin + xSize * (i * 1.0 / (num - 1));
                        var square = r * r - (x - centerX) * (x - centerX);
                        var y = centerY - Math.sqrt(square < 0.0 ? 0.0 : square);
                        rings[rings.length] = [x, y];
                    }
                }
                else if (startDegree >= (Math.PI * 3 / 2 - maxDecimal) && endDegree <= (Math.PI * 2 + maxDecimal)) {
                    var xSizeBegin = centerX + Math.cos(endDegree) * r;
                    var xSizeEnd = centerX + Math.cos(startDegree) * r;
                    var xSize = xSizeEnd - xSizeBegin;
                    for (var i = num - 1; i >= 0; --i) {
                        var x = xSizeBegin + xSize * (i * 1.0 / (num - 1));
                        var square = r * r - (x - centerX) * (x - centerX);
                        var y = centerY - Math.sqrt(square < 0.0 ? 0.0 : square);
                        rings[rings.length] = [x, y];
                    }
                }

            }

            function getRings(center, rings, startDegree, endDegree, r) {
                if (startDegree < Math.PI / 2 && endDegree > Math.PI / 2 && endDegree <= Math.PI) {
                    getRingsForHalf(center, rings, startDegree, Math.PI / 2, r);
                    getRingsForHalf(center, rings, Math.PI / 2, endDegree, r);
                }
                else if (startDegree < Math.PI / 2 && endDegree > Math.PI && endDegree <= Math.PI * 3 / 2) {
                    getRingsForHalf(center, rings, startDegree, Math.PI / 2, r);
                    getRingsForHalf(center, rings, Math.PI / 2, Math.PI, r);
                    getRingsForHalf(center, rings, Math.PI, endDegree, r);

                }
                else if (startDegree < Math.PI / 2 && endDegree > Math.PI * 3 / 2 && endDegree <= Math.PI * 2) {
                    getRingsForHalf(center, rings, startDegree, Math.PI / 2, r);
                    getRingsForHalf(center, rings, Math.PI / 2, Math.PI, r);
                    getRingsForHalf(center, rings, Math.PI, Math.PI * 3 / 2, r);
                    getRingsForHalf(center, rings, Math.PI * 3 / 2, endDegree, r);

                }
                else if (startDegree >= Math.PI / 2 && startDegree < Math.PI && endDegree > Math.PI && endDegree <= Math.PI * 3 / 2) {
                    getRingsForHalf(center, rings, startDegree, Math.PI, r);
                    getRingsForHalf(center, rings, Math.PI, endDegree, r);
                }
                else if (startDegree >= Math.PI / 2 && startDegree < Math.PI && endDegree > Math.PI * 3 / 2) {
                    getRingsForHalf(center, rings, startDegree, Math.PI, r);
                    getRingsForHalf(center, rings, Math.PI, Math.PI * 3 / 2, r);
                    getRingsForHalf(center, rings, Math.PI * 3 / 2, endDegree);
                }
                else if (startDegree >= Math.PI && startDegree < Math.PI * 3 / 2 && endDegree > Math.PI * 3 / 2) {
                    getRingsForHalf(center, rings, startDegree, Math.PI * 3 / 2, r);
                    getRingsForHalf(center, rings, Math.PI * 3 / 2, endDegree, r);
                } else {
                    getRingsForHalf(center, rings, startDegree, endDegree, r);
                }
            }

            return obj;
        };
        //绘制热力图
        DrawUtil.prototype.drawHeat = function (me) {
            var obj = this;
            var colorStops = Array.prototype.slice.call(me.config.style.colorStops, 0);
            var heatmapRenderer = new HeatmapRenderer({
                colorStops: colorStops,
                blurRadius: me.config.style.heatPower,
                maxPixelIntensity: 150,
                minPixelIntensity: 0
            });
            me.drawLayer.setRenderer(heatmapRenderer);
            return obj;
        };

        /* 辅助方法 */
        DrawUtil.prototype.checkParams = function (me) {
            var obj = this;
            var layerConfig = me.config.layer;
            var legendConfig = me.config.legend;
            var labelConfig = me.config.label;
            if (!me.map)
                throw new Error('OTMap Error：[map] is required in config,use [setConfig] method to fix it');
            if (!layerConfig.url)
                throw new Error('OTMap Error：[url] is required in layer config,use [setConfig] or [setLayer] method to fix it');
            if (legendConfig.show && !legendConfig.id)
                throw new Error('OTMap Error：[id] is required in label config,use [setConfig] method to fix it');
            if (labelConfig.show && !labelConfig.field)
                throw new Error('OTMap Error：[field] is required in label config,use [setConfig] method to fix it');

            switch (me.type) {
                case 'Range' :
                {
                    //if (layer.geometryType === "esriGeometryPolygon")
                    //    throw new Error("OTMap Error:[url] must be [esriGeometryPolygon] type when use " + me.type + "Map");
                    if (!layerConfig.baseTag)
                        throw new Error('OTMap Error：some required params absent in layer config,use [setConfig] or [setLayer] method to fix it');
                    break;
                }
                case 'Histogram':
                case 'Pie':
                {
                    //if (layer.geometryType === "esriGeometryPolygon")
                    //    throw new Error("OTMap Error:[url] must be [esriGeometryPolygon] type when use " + me.type + "Map");
                    if (!layerConfig.statTag.length)
                        throw new Error('OTMap Error：some required params absent in layer config,use [setConfig] or [setLayer] method to fix it');
                    if (!me.config.layer.simple && !layerConfig.corString.length)
                        throw new Error('OTMap Error：if [simple] is false,[corString] is required,use [setConfig] or [setLayer] method to fix it');
                    break;
                }
                case 'Heat' :
                {
                    //if (layer.geometryType === "esriGeometryPoint")
                    //    throw new Error("OTMap Error:[url] must be [esriGeometryPolygon] type when use " + me.type + "Map");
                    break;
                }
            }

            return obj;
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
                    var result = parseFloat(statData[i][dataTag]);
                    result = isNaN(result) ? 0 : result;
                    return result;
                }
            }
            return false;
        };

        return new DrawUtil();
    })
;


