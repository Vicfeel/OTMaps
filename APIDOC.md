OTMaps API Document
===
#类索引

* [HistogramMap(柱状图专题图)](#histogrammap)   构造类型`histogram`    

* [PieMap(饼状图专题图)](#piemap)         构造类型`pie`

* [RangeMap(范围值专题图)](#rangemap)     构造类型`range`

* [HeatMap(热力专题图)](#heatmap)         构造类型`heat`

###HistogramMap
* 方法

| 方法名 | 描述 | 参数 |
| :----------: | :----------- | :----------- |
| setConfig(options)  | 设置制图参数   | options [Object] 详细请看`制图参数` |
| draw(callback)  | 绘制专题图   | callback [function] 回调函数,可选 |
| clear()  | 清除专题图   |  |

* 制图参数

| 参数名  | 子参数  | 可/必选   | 类型        | 描述  |
| :-----: | :-----: |---------| :---------: |-------|
| map     |           |required   |Esri/map     | 地图对象 |
| layer   |           |           |             |图层相关参数 |
|         |   id      |optional   | String      |指定绘图图层的id,默认是`OTMapDrawLayer` |
|         | url      |required   | String      |统计单元地图服务地址，应包含多个Polygon |
|         | statTag      |required   |String or Array of string  |统计字段，若对同时对多个指标制图，需传入一个数组 |
|         | simple      |optional   | Bool      |统计对象是否为地图服务中某字段,默认是`true` |
|         | statData      |required when simple is false| Array of Object |存放统计数据的数组 |
|         | baseTag      |optional| String | 生成范围图所需字段名 |
|         | corString    |required when simple is false | Array of String | 包含统计数据与图层字段的对应关系，也可对统计添加`&`标志对统计数据`statData`进行过滤。示例：``` corString:["ID=PAC","&type=1" ```],该语句指定了`statData`中ID与地图服务中PAC字段的对应关系,另外仅对`statData`中type为1的行进行统计制图|
| style   |           |           |             |样式相关参数 |
|         |   statColor      |optional   | String      | 统计指标柱子颜色，系统根据该颜色自动生成渐变色填充其它指标，`"#1abc9c"` `"rgb(39,174,96)"`两种格式均支持，默认是"#c0392b" |
|         |   baseColor      |optional   | String      | 仅在指定`basetag`后生效，该参数为范围值底图颜色，`"#1abc9c"` `"rgb(39,174,96)"`两种格式均支持，默认是`"#27ae60"` |
|         |   classicMethod      |optional   | String | 仅在指定`basetag`后生效，该参数为范围值底图分级方式，当前支持`equal-interval`相等间隔, `natural-breaks`自然分隔和`quantile`分位数分割,默认是`quantile` |
| label   |           |           |             |标注相关参数 |
|         |   show      |optional   | Bool      |是否显示标注,默认是`false` |
|         |   field      |required   | String      |标注字段 |
|         |   color      |optional   | String      |标注颜色，`"#1abc9c"` `"rgb(39,174,96)"`两种格式均支持，默认是`"#000"` |
|         |   size      |optional   | Number      |标注大小，默认是`9` |
|         |   family      |optional   | String      |标注字体，默认是`Microsoft Yahei` |
|         |   bold      |optional   | Bool      |标注是否加粗，默认是`false` |
|         |   xoffset      |optional   | Number      |标注相对统计单元中心x方向偏移量，默认是`0` |
|         |   yoffset      |optional   | Number      |标注相对统计单元中心y方向偏移量，默认是`0` |
| legend   |           |           |             |图例相关参数 |
|         |   show      |optional   | Bool      |是否显示图例,默认是`false` |
|         |   id      |optional   | String      |用于创建图例容器的id，方便在css进行样式调整,默认是`legendDiv` |
|         |   title      |optional   |Array or  String |图例标题,若指定了`basetag`,需传入一个数组,第一个为底部范围值图例名称，第二个为统计图图例名称,默认是`图例名称` |
|         |   itemTitle      |optional   |Array |图例子项的标题, 分别对应`statTag`中的统计指标 |           

###PieMap
* 方法

| 方法名 | 描述 | 参数 |
| :----------: | :----------- | :----------- |
| setConfig(options)  | 设置制图参数   | options [Object] 详细请看`制图参数` |
| draw(callback)  | 绘制专题图   | callback [function] 回调函数,可选 |
| clear()  | 清除专题图   |  |

* 制图参数

| 参数名  | 子参数  | 可/必选   | 类型        | 描述  |
| :-----: | :-----: |---------| :---------: |-------|
| map     |           |required   |Esri/map     | 地图对象 |
| layer   |           |           |             |图层相关参数 |
|         |   id      |optional   | String      |指定绘图图层的id,默认是`OTMapDrawLayer` |
|         | url      |required   | String      |统计单元地图服务地址，应包含多个Polygon |
|         | statTag      |required   |String or Array of string  |统计字段，若对同时对多个指标制图，需传入一个数组 |
|         | simple      |optional   | Bool      |统计对象是否为地图服务中某字段,默认是`true`,当数据来自外部统计数据，设为false |
|         | statData      |required when simple is false| Array of Object |存放统计数据的数组 |
|         | baseTag      |optional| String | 生成范围图所需字段名 |
|         | corString    |required when simple is false | Array of String | 包含统计数据与图层字段的对应关系，也可对统计添加`&`标志对统计数据`statData`进行过滤。示例：``` corString:["ID=PAC","&type=1" ```],该语句指定了`statData`中ID与地图服务中PAC字段的对应关系,另外仅对`statData`中type为1的行进行统计制图|
| style   |           |           |             |样式相关参数 |
|         |   statColor      |optional   | String      | 统计指标柱子颜色，系统根据该颜色自动生成渐变色填充其它指标，`"#1abc9c"` `"rgb(39,174,96)"`两种格式均支持，默认是"#c0392b" |
|         |   baseColor      |optional   | String      | 仅在指定`basetag`后生效，该参数为范围值底图颜色，`"#1abc9c"` `"rgb(39,174,96)"`两种格式均支持，默认是`"#27ae60"` |
|         |   classicMethod      |optional   | String | 仅在指定`basetag`后生效，该参数为范围值底图分级方式，当前支持`equal-interval`相等间隔, `natural-breaks`自然分隔和`quantile`分位数分割,默认是`quantile` |
| label   |           |           |             |标注相关参数 |
|         |   show      |optional   | Bool      |是否显示标注,默认是`false` |
|         |   field      |required   | String      |标注字段 |
|         |   color      |optional   | String      |标注颜色，`"#1abc9c"` `"rgb(39,174,96)"`两种格式均支持，默认是`"#000"` |
|         |   size      |optional   | Number      |标注大小，默认是`9` |
|         |   family      |optional   | String      |标注字体，默认是`Microsoft Yahei` |
|         |   bold      |optional   | Bool      |标注是否加粗，默认是`false` |
|         |   xoffset      |optional   | Number      |标注相对统计单元中心x方向偏移量，默认是`0` |
|         |   yoffset      |optional   | Number      |标注相对统计单元中心y方向偏移量，默认是`0` |
| legend   |           |           |             |图例相关参数 |
|         |   show      |optional   | Bool      |是否显示图例,默认是`false` |
|         |   id      |optional   | String      |用于创建图例容器的id，方便在css进行样式调整,默认是`legendDiv` |
|         |   title      |optional   |Array or  String |图例标题,若指定了`basetag`,需传入一个数组,第一个为底部范围值图例名称，第二个为统计图图例名称,默认是`图例名称` |
|         |   itemTitle      |optional   |Array |图例子项的标题, 分别对应`statTag`中的统计指标 |           

###RangeMap
* 方法

| 方法名 | 描述 | 参数 |
| :----------: | :----------- | :----------- |
| setConfig(options)  | 设置制图参数   | options [Object] 详细请看`制图参数` |
| draw(callback)  | 绘制专题图   | callback [function] 回调函数,可选 |
| clear()  | 清除专题图   |  |

* 制图参数

| 参数名  | 子参数  | 可/必选   | 类型        | 描述  |
| :-----: | :-----: |---------| :---------: |-------|
| map     |           |required   |Esri/map     | 地图对象 |
| layer   |           |           |             |图层相关参数 |
|         |   id      |optional   | String      |指定绘图图层的id,默认是`OTMapDrawLayer` |
|         | url      |required   | String      |统计单元地图服务地址，应包含多个Polygon |
|         | simple      |optional   | Bool      |统计对象是否为地图服务中某字段,默认是`true` |
|         | statData      |required when simple is false| Array of Object |存放统计数据的数组 |
|         | baseTag      |required| String | 生成范围图所需字段名 |
|         | corString    |required when simple is false | Array of String | 包含统计数据与图层字段的对应关系，也可对统计添加`&`标志对统计数据`statData`进行过滤。示例：``` corString:["ID=PAC","&type=1" ```],该语句指定了`statData`中ID与地图服务中PAC字段的对应关系,另外仅对`statData`中type为1的行进行统计制图|
| style   |           |           |             |样式相关参数 |
|         |   baseColor      |optional   | String      | 范围值底图颜色，`"#1abc9c"` `"rgb(39,174,96)"`两种格式均支持，默认是`"#27ae60"` |
|         |   classicMethod      |optional   | String | 仅在指定`basetag`后生效，该参数为范围值底图分级方式，当前支持`equal-interval`相等间隔, `natural-breaks`自然分隔和`quantile`分位数分割,默认是`quantile` |
| label   |           |           |             |标注相关参数 |
|         |   show      |optional   | Bool      |是否显示标注,默认是`false` |
|         |   field      |required   | String      |标注字段 |
|         |   color      |optional   | String      |标注颜色，`"#1abc9c"` `"rgb(39,174,96)"`两种格式均支持，默认是`"#000"` |
|         |   size      |optional   | Number      |标注大小，默认是`9` |
|         |   family      |optional   | String      |标注字体，默认是`Microsoft Yahei` |
|         |   bold      |optional   | Bool      |标注是否加粗，默认是`false` |
|         |   xoffset      |optional   | Number      |标注相对统计单元中心x方向偏移量，默认是`0` |
|         |   yoffset      |optional   | Number      |标注相对统计单元中心y方向偏移量，默认是`0` |
| legend   |           |           |             |图例相关参数 |
|         |   show      |optional   | Bool      |是否显示图例,默认是`false` |
|         |   id      |optional   | String      |用于创建图例容器的id，方便在css进行样式调整,默认是`legendDiv` |
|         |   title      |optional   |String |图例标题,默认是`图例名称` |

###HeatMap
* 方法

| 方法名 | 描述 | 参数 |
| :----------: | :----------- | :----------- |
| setConfig(options)  | 设置制图参数   | options [Object] 详细请看`制图参数` |
| draw(callback)  | 绘制专题图   | callback [function] 回调函数,可选 |
| clear()  | 清除专题图   |  |

* 制图参数

| 参数名  | 子参数  | 可/必选   | 类型        | 描述  |
| :-----: | :-----: |---------| :---------: |-------|
| map     |           |required   |Esri/map     | 地图对象 |
| layer   |           |           |             |图层相关参数 |
|         |   id      |optional   | String      |指定绘图图层的id,默认是`OTMapDrawLayer` |
|         | url      |required   | String      |地图服务地址，热力图要求图层类型为`Point` |
| style   |           |           |             |样式相关参数 |
|         |   colorStops      |optional   | Array      |热力图绘制色带,默认为```[ {ratio: 0, color: "rgba(39, 174, 96, 0)"},{ratio: 0.2, color: "#27AE60"},{ratio: 0.3, color: "#f39c12"},{ratio: 0.85, color: "#d35400"},{ratio: 0.95, color: "#c0392b"}] ```|
|         |   heatPower      |optional   | Number      |热力图强度,默认是`15` |
