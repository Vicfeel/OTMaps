/**
 * @author 张伟佩
 * @version 1.0
 * @date 2016-05-04
 * @description 专题图父类
 */

define(["app/tool/ThematicMaps/Utils/DrawUtil"], function (DrawUtil) {
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
            classicMethod: 'quantile'
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
            title: '图例名称'
        }
    };
    //子类共享属性
    var shareProp = {
        map: null,
        legend: null,
        drawLayer: null
    };

    function ThematicMap() {
        this.config = copyObj(defalutConfig);
        this.shareProp = shareProp;
    }

    //参数配置
    ThematicMap.prototype.setConfig = function (options) {
        var me = this;
        debugger;
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
    //配置文件的备份与读取
    ThematicMap.prototype.backupConfig = function (me) {
        this._oconfig = copyObj(this.config);
    };
    ThematicMap.prototype.restoreConfig = function (me) {
        this.oconfig = copyObj(this._oconfig);
    };

    //专题图方法
    ThematicMap.prototype.draw = function (callback) {
    };
    ThematicMap.prototype.fresh = function (callback) {

    };
    ThematicMap.prototype.clear = function () {
        debugger;
        this.shareProp.drawLayer && this.shareProp.map.removeLayer(this.shareProp.drawLayer);
        this.shareProp.drawLayer = null;
        this.shareProp.legend && this.shareProp.legend.destroy();
        this.shareProp.lenged = null;
        this._binded && this._binded.remove();
        this._binded = null;
        return this;
    };

    //对象复制
    function copyObj(source) {
        var result = {};
        for (var key in source) {
            if (key === 'map') {
                result[key] = source[key];
                continue;
            }
            result[key] = typeof source[key] === 'object' ? copyObj(source[key]) : source[key];
        }
        return result;
    }

    return ThematicMap;
});