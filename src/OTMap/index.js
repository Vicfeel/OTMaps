/**
 * @author Vicfeel
 * @version 1.0
 * @date 2016-07-07
 * @description 入口函数
 */

define(["OTMap/Utils/DrawUtil", "OTMap/HistogramMap", "OTMap/PieMap", "OTMap/RangeMap", "OTMap/HeatMap"], function (DrawUtil, HistogramMap, PieMap, RangeMap, HeatMap) {

    //工厂模式
    function factory(type, config) {
        var otmap;
        switch (type) {
            case 'range':
                otmap = new RangeMap();
                break;
            case 'histogram':
                otmap = new HistogramMap();
                break;
            case 'pie':
                otmap = new PieMap();
                break;
            case 'heat':
                otmap = new HeatMap();
                break;
            default :
                throw new Error('OTMap Error：wrong thematic Map type');
        }
        return otmap;
    }

    return factory;
});