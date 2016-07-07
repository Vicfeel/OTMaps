/**
 * @author Vicfeel
 * @version 1.0
 * @date 2016-05-04
 * @description 专题图父类
 */

define(["OTMap/Utils/DrawUtil"], function (DrawUtil) {
    //默认配置
    var defalutConfig = {
        map: null,
        layer: {
            simple: true,
            id: 'statUnits',
            fieldName: 'STAT_VALUE',
            url: "",
            statData: [],
            baseTag: "",
            statTag: [],
            corString: []
        },
        popup: {
            show: false,
            title: "值为",
            content: "${}"
        },
        style: {
            baseColor: '#27ae60',
            statColor: '#c0392b',
            classicMethod: 'quantile',
            colorStops: [
                {ratio: 0, color: "rgba(39, 174, 96, 0)"},
                {ratio: 0.2, color: "#27AE60"},
                {ratio: 0.3, color: "#f39c12"},
                {ratio: 0.85, color: "#d35400"},
                {ratio: 0.95, color: "#c0392b"}],
            heatPower: 15
        },
        label: {
            show: false,
            field: 'NAME',
            color: '#000',
            size: 9,
            family: 'Microsoft Yahei',
            bold: false,
            xoffset: 0,
            yoffset: 0
        },
        legend: {
            show: false,
            id: 'legendDiv',
            itemTitle: [],
            title: '图例名称'
        }
    };
    //子类共享属性
    var shareProp = {
        map: null,
        legend: null,
        drawLayer: null,
        _binded: null
    };

    function OTMap() {
        this.config = copyObj(defalutConfig);
        this.shareProp = shareProp;
        this._legendInfo = [];
    }

    //参数配置
    OTMap.prototype.setConfig = function (options) {
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
        me.map = me.shareProp.map = me.config.map;
        return me;
    };
    OTMap.prototype.setLayer = function (options) {
        var me = this;
        for (var item in options) {
            if (options.hasOwnProperty(item))
                me.config.layer[item] = options.item;
        }
        return me;
    };
    OTMap.prototype.setStatData = function (data) {
        var me = this;
        me.config.layer.statData = data;
        return me;
    };
    OTMap.prototype.setStyle = function (options) {
        var me = this;
        for (var item in options) {
            if (options.hasOwnProperty(item))
                me.config.style[item] = options.item;
        }
        return me;
    };
    //配置文件的备份与读取
    OTMap.prototype.backupConfig = function (me) {
        this._oconfig = copyObj(this.config);
    };
    OTMap.prototype.restoreConfig = function (me) {
        this.oconfig = copyObj(this._oconfig);
    };

    //专题图方法
    OTMap.prototype.draw = function (callback) {
    };
    OTMap.prototype.fresh = function (callback) {

    };
    OTMap.prototype.clear = function () {
        this.shareProp.drawLayer && this.shareProp.map.removeLayer(this.shareProp.drawLayer);
        this.shareProp.drawLayer = null;

        this.shareProp.legend && this.shareProp.legend.destroy();
        this.shareProp.lenged = null;
        this._legendInfo = [];

        this.shareProp._binded && this.shareProp._binded.remove();
        this.shareProp._binded = null;

        return this;
    };

    //对象复制
    function copyObj(source) {
        var result = {};
        if (isArray(source)) result = source.slice(0);
        else
            for (var key in source) {
                if (key === 'map') {
                    result[key] = source[key];
                    continue;
                }
                result[key] = typeof source[key] === 'object' ? copyObj(source[key]) : source[key];
            }
        return result;
    }

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]'
    }

    return OTMap;
});