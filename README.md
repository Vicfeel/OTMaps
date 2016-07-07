OTMaps
====
基于`ArcGIS API for Javascript`封装的专题图制图类库，要求版本`3.13+`

##类库特点(Advantage)

* **使用方法简单:**

  简单几步完成专题图绘制，[使用方法](#使用方法usage)
* **制图种类丰富:**

  当前支持`柱状图专题图` `饼状图专题图` `范围值专题图` `热力专题图`以及`柱状+范围值组合图` `饼状+范围值组合图`,并不断丰富中
* **支持独立统计数据:**

  统计数据不依赖地图服务，支持基于`独立统计数据`的专题图开发
* **支持链式调用:**

  ```js
  histogramMap.setConfig(options).setStatData(data).draw(callback);
  ```

##使用方法(Usage)
* **路径配置**
  在index.html中添加OTMap路径，**注意dojoConfig的配置要在arcgisJsApi引用之前**

  ```js
      var package_path = window.location.pathname.substring(0,window.location.pathname.lastIndexOf(''));
      var dojoConfg = {
        packages:[{
          name:'OTMap',
          location:package_path + '/OTMap'  //OTMap所处的位置，相对于index.html
        }]
    };
  ```
  
——以柱状图专题图为例
* **引用及构建对象:**

  ```js
  define(["OTMap"],function (OTMap) {
    var histogramMap = new OTMap('histogram');
    
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
  [详细开发API](https://github.com/Vicfeel/OTMaps/blob/master/APIDOC.md)
* **专题图绘制:**

  ```js
  histogramMap.draw();
 ```

## 问题反馈(Questions)

  如何有任何疑问或更好的建议，请通过 [New Issue](https://github.com/Vicfeel/OTMaps/issues/new) 来向我反馈。


## 项目许可(License)

  OTMaps is available under the terms of the [MIT License](https://github.com/Vicfeel/OTMaps/blob/master/LICENSE.md).

