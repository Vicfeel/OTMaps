/**
 * @author 张伟佩
 * @version 1.0
 * @date 2016-05-04
 * @description 范围值专题图（分层设色图）
 */

define(["app/tool/ThematicMaps/ThematicMap", "app/tool/ThematicMaps/Utils/ColorUtil", "app/tool/ThematicMaps/Utils/DrawUtil",
        "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/renderers/smartMapping", "esri/renderers/ClassBreaksRenderer", "esri/Color"],
    function (ThematicMap, ColorUtil, DrawUtil,
              SimpleFillSymbol, SimpleLineSymbol, smartMapping, ClassBreaksRenderer, Color) {
        function RangeMap(options, callback) {
            ThematicMap.apply(this, arguments);
        }

        RangeMap.prototype = new ThematicMap();

        RangeMap.prototype.draw = function (callback) {
            var me = this;
            var temp = [];
            me._oconfig = temp.push(me.config).slice(0)[0];
            if (me.config.layer.simple)
                DrawUtil.createSLayer.call(me, renderMap);
            else
                DrawUtil.createMLayer.call(me, renderMap);

            function renderMap() {
                var fieldName = me.config.layer.fieldName;
                var styleConfig = me.config.style;
                //创建渲染
                smartMapping.createClassedColorRenderer({
                    layer: me.drawLayer,
                    field: fieldName,
                    basemap: 'topo',
                    classificationMethod: styleConfig.classicMethod
                }).then(function (response) {
                    var renderer = new ClassBreaksRenderer(null, fieldName);
                    var colors = ColorUtil.getGradientColor('#ddd', styleConfig.color, response.classBreakInfos.length + 1);
                    me._classBreakInfos = response.classBreakInfos;
                    response.classBreakInfos.forEach(function (v, i) {
                        var symbol = new SimpleFillSymbol();
                        symbol.setColor(new Color(colors[i + 1]));
                        symbol.setOutline(new SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new Color([75, 75, 75, 0.8]), 1));
                        renderer.addBreak(v.minValue, v.maxValue, symbol);
                    });

                    me.drawLayer.setRenderer(renderer);
                    if (me.config.label.show)
                        DrawUtil.createLabel.call(me, me.config.label);
                    if (me.config.legend.show)
                        DrawUtil.createLegend.call(me, me.config.legend);
                    me.drawLayer.redraw();
                    if (callback) callback();
                });
            }
        };

        RangeMap.prototype.fresh = function(callback){
        };

        return RangeMap;
    }
)
;