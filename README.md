# ThematicMaps
基于ArcGIS JS API封装的专题图制图类库
【使用方法简单】 【制图种类丰富】 【可结合ajax获取统计值动态绘制】

##使用方法（Usage）
——以范围值统计图为例
* **引用组件:**
```js
define(["core/RangeMap"],function (RangeMap) { });
```
* **初始化对象:**
```js
var rangeMap = new RangeMap();
```
* **制图参数设置:**
```js
rangeMap.setConfig({
  map: myMap,
  layer: {}
  ... ...
});
```
* **绘制与清除:**
```js
rangeMap.draw();
rangeMap.clear();
```
##接口说明（API）
持续更新中...
