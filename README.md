# ThematicMaps
基于ArcGIS JS API封装的专题图制图类库

使用方法简单，可实现独立统计值与地图图层的专题图绘制。

##使用方法（Usage）
* **引用组件:**
```js
define(["core/RangeMap"],function (RangeMap) { });
```
* **初始化对象:**
```js
var rangeMap = new RangeMap({ },callback);
```
* **使用:**
```js
rangeMap.draw();
```
##接口说明（API）
