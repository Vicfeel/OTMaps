/**
 * @author 张小波
 * @version 1.0
 * @date 2014-08-10
 * @copyright 南京师范大学虚拟地理环境教育部重点实验室，南京慧图信息科技有限公司
 */


define(["esri/tasks/query", "esri/geometry/Polygon", "esri/geometry/Point", "esri/symbols/SimpleFillSymbol", "esri/graphic", "esri/geometry/Extent",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer", "esri/Color", "esri/SpatialReference", "esri/symbols/TextSymbol",
        "app/tool/ThematicMaps/ThematicMap", "app/tool/ThematicMaps/RangeMap", "app/tool/ThematicMaps/Utils/ColorUtil", "app/tool/ThematicMaps/Utils/DrawUtil"],
    function (Query, Polygon, Point, SimpleFillSymbol, Graphic, Extent,
              GraphicsLayer, FeatureLayer, Color, SpatialReference, TextSymbol,
              ThematicMap, RangeMap, ColorUtil, DrawUtil) {
        function HistogramMap(options, callback) {
            ThematicMap.apply(this, arguments);
        }

        HistogramMap.prototype = new ThematicMap();

        HistogramMap.prototype.draw = function (callback) {
            var me = this;
            me.setConfig({
                label: {show: false},
                legend: {show: false}
            });
            //绘制分段渲染底图
            RangeMap.prototype.draw.call(me, drawHistogram);

            function drawHistogram() {
                debugger;
                var layerConfig = me.config.layer;
                var chartWidth = 0.009;
                var chartHeight = 0.08;
                var maxStatValue = 40;

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
                        var statData = DrawUtil.getCorData(layerConfig.statData, feature, layerConfig.corString, layerConfig.statTag[i]);
                        var yEnd = center.y + chartHeight * statData / maxStatValue;
                        var extent = new Extent(x, yStart, xEnd, yEnd, feature.spatialReference);
                        var symbol = new SimpleFillSymbol().setColor(colors[i]);
                        symbol.outline.setWidth(0);
                        me.drawLayer.add(new Graphic(extent, symbol));
                    }
                    var point = new Point(center.x, center.y - 0.01, feature.spatialReference);
                    me.drawLayer.add(new Graphic(point, new TextSymbol(feature.attributes[me.config.label.field])));
                });
                me.drawLayer.redraw();
                if (callback) callback();
            }
        };
        return HistogramMap;
    });

