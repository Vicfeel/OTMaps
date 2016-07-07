/**
 * @author Vicfeel
 * @version 1.0
 * @date 2016-05-04
 * @description 范围值专题图（分层设色图）
 */


define(["OTMap", "OTMap/Utils/DrawUtil"],
    function (OTMap, DrawUtil) {
        function RangeMap(options, callback) {
            OTMap.apply(this, arguments);
            this.type = 'Range';
        }

        RangeMap.prototype = new OTMap();

        RangeMap.prototype.draw = function (callback) {
            var me = this;
            me.clear();
            DrawUtil.checkParams(me);
            me.config.layer.simple ? DrawUtil.createSLayer(me, renderMap) : DrawUtil.createMLayer(me, renderMap);
            function renderMap() {
                DrawUtil.drawRange(me, function () {
                    me.config.legend.show && DrawUtil.createLegend(me);
                    me.config.label.show && DrawUtil.createLabel(me);
                    me.drawLayer.redraw();
                    me.backupConfig();
                    callback && callback();
                });
            }
        };

        RangeMap.prototype.fresh = function (callback) {
        };

        return RangeMap;
    });