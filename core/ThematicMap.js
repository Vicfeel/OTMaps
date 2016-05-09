/**
 * @author 张伟佩
 * @version 1.0
 * @date 2016-05-04
 * @description 专题图父类
 */

define(["app/tool/ThematicMaps/Utils/DrawUtil"], function (DrawUtil) {
    function ThematicMap() {
        this.config = {
            map: null,
            layer: {
                simple: true,
                id: 'statUnits',
                fieldName: 'STAT_VALUE',
                url: "",
                statData: [],
                dataTag: "",
                corString: []
            },
            popup: {
                show: true,
                title: "值为",
                content: "${STAT_VALUE}"
            },
            style: {
                color: '#27ae60',
                classicMethod: 'quantile'
            },
            label: {
                show: false,
                field: 'NAME',
                size: 13
            },
            legend: {
                show: false,
                id: 'vlegend',
                title: '耕地面积（平方千米)'
            }
        };
    }

    //参数配置
    ThematicMap.prototype.setConfig = function (options) {
        var me = this;
        for (var obj in options) {
            if (obj == 'map')
                me.config.map = options.map;
            else if (options.hasOwnProperty(obj))
                for (var item in options[obj]) {
                    if (options[obj].hasOwnProperty(item))
                        me.config[obj][item] = options[obj][item];
                }
        }
        me.map = me.config.map;
        return me;
    };
    ThematicMap.prototype.setLayer = function (options) {
        var me = this;
        for (var item in options) {
            if (options.hasOwnProperty(item))
                me.config.layer[item] = options.item;
        }
        return me;
    };
    ThematicMap.prototype.setStatData = function (data) {
        var me = this;
        me.config.layer.statData = data;
        return me;
    };
    ThematicMap.prototype.setStyle = function (options) {
        var me = this;
        for (var item in options) {
            if (options.hasOwnProperty(item))
                me.config.style[item] = options.item;
        }
        return me;
    };

    //绘制专题图
    ThematicMap.prototype.draw = function (callback) {
    };

    ThematicMap.prototype.fresh = function (callback) {

    };

    //清除专题图
    ThematicMap.prototype.clear = function () {
        this.map.removeLayer(this.drawLayer);
        if (this.legend) {
            this.legend.destroy();
            this.lenged = null;
        }
        return this;
    };

    return ThematicMap;
});