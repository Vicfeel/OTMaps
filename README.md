# ThematicMaps
基于ArcGIS JS API封装的专题图制图类库

使用方法简单，可实现独立统计值与地图图层的专题图绘制。

#使用方法（Usage）
1.引用组件
define(["core/RangeMap""],function (RangeMap) {}
2.初始化对象
var rangeMap = new RangeMap({},callback);
3.绘制专题图
rangeMap.draw();
