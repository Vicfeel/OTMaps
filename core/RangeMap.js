/**
 * @author 张伟佩
 * @version 1.0
 * @date 2016-05-04
 * @description 范围值专题图（分层设色图）
 */

define(["app/tool/ThematicMaps/ThematicMap", "esri/renderers/smartMapping", "esri/dijit/Legend"], function (ThematicMap, smartMapping, Legend) {
    function RangeMap(options,callback) {
        //默认属性
        var defaultOpts = {
            style: 'topo',
            classicMethod: 'quantile'
        };
        for (var item in defaultOpts) {
            options[item] = options[item] || defaultOpts[item];
        }
        ThematicMap.apply(this, arguments);
    }

    RangeMap.prototype = new ThematicMap();

    RangeMap.prototype.draw = function (callback) {
        var me = this;
        //创建渲染
        smartMapping.createClassedColorRenderer({
            layer: me.drawLayer,
            field: me.options.fieldName,
            basemap: me.options.style,
            classificationMethod: me.options.classicMethod
        }).then(function (response) {
            me.drawLayer.setRenderer(response.renderer);
            me.drawLayer.redraw();
            if (callback) callback();
        });
        //创建图例
        legend = new Legend({
            map: me.map,
            layerInfos: [{
                layer: me.drawLayer,
                title: "Census Attribute: " + me.options.fieldName
            }]
        }, $('#' + me.options.legendID)[0]);
        legend.startup();
    };

    return RangeMap;
});