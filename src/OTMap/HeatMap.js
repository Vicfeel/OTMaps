/**
 * @author Vicfeel
 * @version 1.0
 * @date 2016-05-12
 * @description 热力专题图
 */

define(["OTMap/OTMap", "Utils/DrawUtil"],
    function (OTMap, DrawUtil) {
        function HeatMap(options, callback) {
            OTMap.apply(this, arguments);
            this.type = "Heat";
        }

        HeatMap.prototype = new OTMap();

        HeatMap.prototype.draw = function (callback) {
            var me = this;
            me.clear();
            DrawUtil.checkParams(me).createSLayer(me, function () {
                DrawUtil.drawHeat(me);
                me.drawLayer.redraw();
                me.backupConfig();
                if (callback) callback();
            });

            return me;
        };
        return HeatMap;
    });

