/**
 * @author Vicfeel
 * @version 1.0
 * @date 2016-05-11
 * @description 图例组件
 */
define(["esri/dijit/Legend"], function (esriLegend) {
    function Legend(options) {
        this.id = options.id ? options.id : null;
        this.map = options.map ? options.map : null;
        this.title = isArray(options.title) ? options.title : [options.title];
        _content = options.info;
        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    }

    var _content = [];
    //创建图例
    Legend.prototype.startup = function () {
        var me = this;
        //创建dom
        var lgdDom = document.getElementById(me.id) ? document.getElementById(me.id) : document.createElement('div');
        lgdDom.id = me.id;
        lgdDom.style.cssText = "position: absolute !important;width: 250px;bottom: 20px;right: 10px;z-index: 1;";
        _content.forEach(function (legendInfo, i) {
            var titleDom = document.createElement('div');
            titleDom.className = 'legendTitle';
            titleDom.innerText = me.title[i] ? me.title[i] : "默认图例名";
            titleDom.style.fontSize = "14px";
            var listDom = document.createElement('ul');
            listDom.className = 'legendContent';
            lgdDom.appendChild(titleDom);

            legendInfo.forEach(function (item, i) {
                var liDom = document.createElement('li');
                liDom.style.cssText = "list-style: none;height: 30px;line-height: 30px;margin: 5px 0px;";
                var symbolDom = document.createElement('span');
                symbolDom.style.cssText = "display: block;float: left;width: 20px;height: 20px;margin: 5px 10px 0px 0px;";
                symbolDom.className = 'symbol';
                symbolDom.style.backgroundColor = item.color;
                var valueDom = document.createTextNode(item.value);
                liDom.appendChild(symbolDom);
                liDom.appendChild(valueDom);
                listDom.appendChild(liDom);
            });
            lgdDom.appendChild(listDom);
        });

        var mapDom = document.getElementById(me.map.id) || document.getElementById(me.map.id + "_root");
        mapDom.appendChild(lgdDom);
    };

    //销毁图例
    Legend.prototype.destroy = function () {
        var me = this;
        var lgdDom = document.getElementById(me.id);
        if (lgdDom) {
            var mapDom = document.getElementById(me.map.id) || document.getElementById(me.map.id + "_root");
            mapDom.removeChild(lgdDom);
        }
        _content = [];
    };

    return Legend;
})
;


