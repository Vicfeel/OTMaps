/**
 * @author 张伟佩
 * @version 1.0
 * @date 2016-05-11
 * @description 图例组件
 */
define(["esri/dijit/Legend"], function (esriLegend) {
    function Legend(options) {
        this._map = options.map;
        this._id = options.id;
        this._title = options.title;
        _content = options.infos;
    }

    var _content = [];

    Legend.prototype.startup = function () {
        var lgdDom = document.createElement('div');
        lgd.id = legendConfig.id;
        var titleDom = document.createElement('div');
        titleDom.className = 'legendTitle';

        document.getElementById(me.map.id).appendChild(lgd);

        _content.forEach(function (item, i) {

        });
    };

    Legend.prototype.destroy = function () {

    };

    return Legend;
})
;


