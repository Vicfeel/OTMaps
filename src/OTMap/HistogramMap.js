/**
 * @author Vicfeel
 * @version 1.0
 * @date 2016-05-10
 * @description 柱状图专题图
 */


define(["OTMap/OTMap", "Utils/DrawUtil"],
    function (OTMap, DrawUtil) {
        function HistogramMap(options, callback) {
            OTMap.apply(this, arguments);
            this.type = "Histogram";
            this.setConfig({
                label: {
                    xoffset: 0,
                    yoffset: -0.02
                }
            });
        }

        HistogramMap.prototype = new OTMap();

        HistogramMap.prototype.draw = function (callback) {
            var me = this;
            me.clear();
            DrawUtil.checkParams(me);
            me.config.layer.simple ? DrawUtil.createSLayer(me, renderBase) : DrawUtil.createMLayer(me, renderBase);

            function renderBase() {
                me.config.layer.baseTag && me.config.layer.baseTag.length > 0 ? DrawUtil.drawRange(me, renderDijit) : DrawUtil.drawUnique(me, renderDijit);
            }

            function renderDijit() {
                DrawUtil.drawHistogram(me);
                me.config.legend.show && DrawUtil.createLegend(me);
                me.config.label.show && DrawUtil.createLabel(me);

                me.drawLayer.redraw();
                me.backupConfig();
                if (callback) callback();
            }

            return me;
        };
        return HistogramMap;
    });

