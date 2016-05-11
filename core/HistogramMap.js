/**
 * @author 张伟佩
 * @version 1.0
 * @date 2016-05-10
 * @description 柱状专题图
 */


define(["app/tool/ThematicMaps/ThematicMap", "app/tool/ThematicMaps/Utils/DrawUtil"],
    function (ThematicMap, DrawUtil) {
        function HistogramMap(options, callback) {
            ThematicMap.apply(this, arguments);
            this.type = "Histogram";
            this.setConfig({
                label: {
                    xoffset: 0,
                    yoffset: -0.02
                }
            });
        }

        HistogramMap.prototype = new ThematicMap();

        HistogramMap.prototype.draw = function (callback) {
            var me = this;
            me.clear();
            //构建图层
            me.config.layer.simple ? DrawUtil.createSLayer(me, renderMap) : DrawUtil.createMLayer(me, renderMap);

            function renderMap() {
                if (me.config.layer.baseTag) {
                    DrawUtil.drawRange(me, function () {
                        DrawUtil.drawHistogram(me);
                        me.config.legend.show && DrawUtil.createLegend(me);
                        me.config.label.show && DrawUtil.createLabel(me);

                        me.drawLayer.redraw();
                        me.backupConfig();
                        if (callback) callback();
                    });
                }
                else {
                    DrawUtil.drawUnique(me, function () {
                        DrawUtil.drawHistogram(me);
                        me.config.legend.show && DrawUtil.createLegend(me);
                        me.config.label.show && DrawUtil.createLabel(me);

                        me.drawLayer.redraw();
                        me.backupConfig();
                        if (callback) callback();
                    });
                }
            }

            return me;
        };
        return HistogramMap;
    });

