ThematicMaps
===

基于`ArcGIS JS API`封装的专题图制图类库

##类库特点（Advantage）
* **使用方法简单:**
   三步完成类库使用，[使用方法](#使用方法（Usage）)
* **制图接口丰富:**
   当前支持`柱状图专题图`、`饼状图专题图`、`范围值专题图`、`热力专题图`以及组合如`饼状图+范围值专题图`、`柱状图+范围值专题图`，详细[配置参数](https://github.com/Vicfeel/ThematicMaps/blob/master/APIDoc.md)
* **支持独立数据:**
   支持对Ajax获取的统计数据进行专题图绘制
##使用方法（Usage）
——以柱状专题图为例
* **引用与初始化:**
```js
define(["core/HistogramMap"],function (HistogramMap) {
   var histogramMap = new HistogramMap();
});
```
* **制图参数设置:**
```js
histogramMap.setConfig({
  map: myMap,
  layer: {}
  ... ...
});
```
* **绘制专题图:**
```js
histogramMap.draw();
```
## 问题反馈（Questions）
如果有任何问题或建议请在这里反馈 [New Issue](https://github.com/Vicfeel/ThematicMaps/issues/new).
## 许可（License）
ThematicMaps is available under the terms of the [MIT License](https://github.com/Vicfeel/ThematicMaps/blob/master/LICENSE.md).


