/**
 * @author 张伟佩
 * @version 1.0
 * @date 2016-05-04
 * @description 范围值专题图（分层设色图）
 */

define(["app/tool/ThematicMaps/ThematicMap", "esri/renderers/smartMapping", "esri/renderers/ClassBreaksRenderer", "esri/Color", "esri/dijit/Legend", "esri/symbols/SimpleFillSymbol"],
    function (ThematicMap, smartMapping, ClassBreaksRenderer, Color, Legend, SimpleFillSymbol) {
        function RangeMap(options, callback) {
            ThematicMap.apply(this, arguments);
        }

        RangeMap.prototype = new ThematicMap();

        RangeMap.prototype.draw = function (options, callback) {
            var me = this;
            //默认属性
            var defaultOpts = {
                style: 'topo',
                classicMethod: 'quantile',
                legendID: null
            };
            for (var item in defaultOpts) {
                options[item] = options[item] || defaultOpts[item];
            }

            if (!me.drawLayer)
                throw new Error('ThematicMap错误1002：使用draw方法前未进行初始化[init]！');
            //创建渲染
            smartMapping.createClassedColorRenderer({
                layer: me.drawLayer,
                field: me.fieldName,
                basemap: options.style,
                classificationMethod: options.classicMethod
            }).then(function (response) {
                debugger;

                var renderer = new ClassBreaksRenderer(null, me.fieldName);
                var colors = [[0, 0, 0], [20, 20, 20], [50, 50, 50], [150, 150, 150], [250, 250, 250]];
                response.classBreakInfos.forEach(function (v, i) {
                    renderer.addBreak(v.minValue, v.maxValue, new SimpleFillSymbol().setColor(new Color(colors[i])));
                });


                me.drawLayer.setRenderer(renderer);
                me.drawLayer.redraw();
                if (callback) callback();
            });
            //创建图例
            if (options.legendID) {
                legend = new Legend({
                    map: me.map,
                    layerInfos: [{
                        layer: me.drawLayer,
                        title: "Census Attribute: " + me.options.fieldName
                    }]
                }, $('#' + me.options.legendID)[0]);
                legend.startup();
            }
        };

        return RangeMap;
    });