/**
* @author 张小波
* @version 1.0
* @date 2014-08-10
* @copyright 南京师范大学虚拟地理环境教育部重点实验室，南京慧图信息科技有限公司
*/

define(["dojo/_base/lang", "app/core/sidebar", "dojo/text!../templates/mapOnline/Histogram.html", "app/core/application", "esri/tasks/query", "esri/geometry/Polygon", "esri/geometry/Point", "esri/symbols/SimpleFillSymbol", "esri/graphic", "esri/geometry/Extent", "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer", "esri/Color", "dojo/_base/array", "dojo/request", "dijit/ColorPalette", "esri/SpatialReference", "esri/symbols/TextSymbol", "esri/config", "app/util/commonUtil"], function (lang, sidebar, template, application, Query, Polygon, Point, SimpleFillSymbol, Graphic, Extent, GraphicsLayer, FeatureLayer, Color, array, request, ColorPalette, SpatialReference, TextSymbol, esriConfig, commonUtil) {

    // 在线制图——柱状统计地图
    var tool = {

        // -----公有字段（小驼峰）-----
        // 暂无

        // -----私有字段（下划线开头 + 小驼峰）-----
        // 暂无
        _id: "MapOnlineHistogram",


        _allStatUnitsData: null,
        _selectedStatUnitsData: [],

        _statData: [],

        _selectedContent: {},

        _statObjects: [{ name: '耕地', color: '#EEBD54', columnName: '' },
                       { name: '园地', color: '#E7E40D', columnName: '' },
                       { name: '林地', color: '#A7F561', columnName: '' },
                       { name: '草地', color: '#74B130', columnName: ''}],
        _maxColumnValue: 0,


        _chartColors: ['#98FB98', '#90EE90', '#7FFF00', '#32CD32', '#228B22', '#006400', '#DA23F3', '#A9B98F', '#AE0023', '#231133'],


        _statUnitColor: null,
        _chartHeightPercent: 1.0,
        _chartWidthPercent: 1.0,

        _graphicLayersForStatUnit: [],
        _graphicLayersForChart: [],

        _statUnitFeatures: [],

        // -----override或自动调用方法-----
        // 初始化方法
        init: function () {
            var me = this;
            debugger;
            esriConfig.defaults.io.proxyUrl = "proxy.ashx?";
            esriConfig.defaults.io.alwaysUseProxy = true;

            sidebar.createContent(me._id, template, {
                id: me._id
            });

            me._initDataSource();
        },

        _initDataSource: function () {
            var me = this;

            me._statObjects = [];
            //加载目录数据
            var urlDataLayerServer = lang.replace("{0}", [config.url.ProxyUrl + config.url.statUnitsUrl]);

            request(urlDataLayerServer, {
                handleAs: "text"
            }).then(function (text) {
                me._allStatUnitsData = eval(text);

                me._initStatUnitsCombobox(me._allStatUnitsData);

                me._initStatDataSource(commonUtil.allStatObjects);

                me._initStatContents(commonUtil.allStatObjects[0].dataSourceName);

                me._initStatObjects(commonUtil.allStatObjects[0].dataSourceName);

                me._bindEvents();
            }, function (err) {
                alert(me._id + ":加载统计单元失败！");
            });

        },
        //初始化统计内容（统计要素）
        _initStatContents: function (statDataSourceName) {
            var me = tool;
            var innerHTML = "";
            var datas = commonUtil.allStatObjects;
            for (var i = 0; i < datas.length; ++i) {
                if (datas[i].dataSourceName == statDataSourceName) {
                    for (var j = 0; j < datas[i].contentData.length; ++j) {
                        innerHTML += '<label class="checkbox-inline" style="margin-left:0px;"><input class="cCheckboxStatContentsH" name="statContents" type="radio" value="' + datas[i].contentData[j].cc + (j == 0 ? '" checked' : '"') + '/>' + datas[i].contentData[j].name + '</label>';
                    }
                    //me._selectedContent.name = datas[i].contentData[0].name;

                    me._selectedContent.cc = datas[i].contentData[0].cc;
                    break;
                }
            }
            $('#' + me._id + '-statContents').html(innerHTML);
            $('.cCheckboxStatContentsH').unbind('click');
            $('.cCheckboxStatContentsH').bind('click', function (e) {
                if (e.currentTarget.checked) {

                    //me._selectedContent.name = e.currentTarget.text;
                    me._selectedContent.cc = e.currentTarget.value;
                }
            });


        },
        _initStatObjects: function (statDataSourceName) {
            var me = tool;
            var innerHTML = "";
            for (var i = 0; i < commonUtil.allStatObjects.length; ++i) {
                if (commonUtil.allStatObjects[i].dataSourceName == statDataSourceName) {
                    for (var j = 0; j < commonUtil.allStatObjects[i].data.length; ++j) {
                        innerHTML += '<label class="checkbox-inline"><input class="cCheckboxStatObjects" type="checkbox" value="' + commonUtil.allStatObjects[i].data[j].statObjectName + '"/>' + commonUtil.allStatObjects[i].data[j].statObjectName + '</label><div style="position:absolute;float:left;right:24px;top:' + j * 28 + 'px;"><div class="colorIcoHistogram cHistogramStatObjectColor" tag="' + commonUtil.allStatObjects[i].data[j].statObjectName + '" style="cursor:pointer;width:24px;height:24px;background-color:' + me._chartColors[j] + '"></div></div><br />';
                    }
                }
            }
            $('#' + me._id + '-statObjects').html(innerHTML);
            me._bindColorIcon();
            $('.cCheckboxStatObjects').unbind('click');
            $('.cCheckboxStatObjects').bind('click', function (e) {
                if (e.currentTarget.checked)
                    me._statObjects.push({ name: e.currentTarget.value, color: '#00FF00', columnName: me._getColumnName(statDataSourceName, e.currentTarget.value) });
                else {
                    var arr = [];
                    for (var i = 0; i < me._statObjects.length; ++i) {
                        if (me._statObjects[i].name != e.currentTarget.value) arr.push(me._statObjects[i]);
                    }
                    me._statObjects = arr;
                }
            });
        },

        _getColumnName: function (dataSourceName, statObjectName) {
            var me = tool;
            for (var i = 0; i < commonUtil.allStatObjects.length; ++i) {
                if (commonUtil.allStatObjects[i].dataSourceName == dataSourceName) {
                    for (var j = 0; j < commonUtil.allStatObjects[i].data.length; ++j) {
                        if (commonUtil.allStatObjects[i].data[j].statObjectName == statObjectName)
                            return commonUtil.allStatObjects[i].data[j].columnName;
                    }
                }
            }
            return "";
        },
        _initStatDataSource: function (data) {
            var me = tool;
            var innerHTML = "";
            for (var i = 0; i < data.length; ++i) {
                innerHTML += '<option value="' + data[i].dataSourceName + '">' + data[i].dataSourceName + '</option>';
            }
            $('#' + me._id + '-statDataSource').html(innerHTML);
        },
        _initStatUnitsCombobox: function (data) {
            var me = tool;

            var innerHTML = "";
            for (var i = 0; i < data.length; ++i) {
                innerHTML += '<option selected value="' + data[i].Code + '">' + data[i].Name + '</option>';
            }
            $('#' + me._id + '-statUnits').html(innerHTML);

            //me._selectedStatUnitsData = [];
            me._selectedStatUnitsData = data;

        },
        _bindEvents: function () {
            var me = this;

            $("#h-slider").slider({
                orientation: "horizontal",
                range: "min",
                min: 0,
                max: 100,
                value: 50,
                slide: function (event, ui) {
                    me._chartHeightPercent = 1 + 1.0 * (ui.value - 50) / 50;
                }
            });
            //$("#amount").val($("#h-slider").slider("value"));

            $("#w-slider").slider({
                orientation: "horizontal",
                range: "min",
                min: 0,
                max: 100,
                value: 50,
                slide: function (event, ui) {
                    me._chartWidthPercent = 1 + 1.0 * (ui.value - 50) / 50;
                }
            });
            //$("#amount").val($("#h-slider").slider("value"));

            $('#' + me._id + '-statDataSource').change(function (e) {
                var statDataSource = e.currentTarget.value;

                me._statObjects = [];
                me._initStatContents(statDataSource);
                me._initStatObjects(statDataSource);
            });
            $(".histogram-statUnits-chzn-select").chosen().change(function (a, b) {
                if (b.selected) {
                    for (var i = 0; i < me._allStatUnitsData.length; ++i) {
                        if (me._allStatUnitsData[i].Code == b.selected)
                            me._selectedStatUnitsData.push(me._allStatUnitsData[i]);
                    }
                } else if (b.deselected) {
                    var arr = [];
                    for (var i = 0; i < me._selectedStatUnitsData.length; ++i) {
                        if (me._selectedStatUnitsData[i].Code != b.deselected) arr.push(me._selectedStatUnitsData[i]);
                    }
                    me._selectedStatUnitsData = arr;
                }
            }),



            //生成地图
            $("#" + me._id + "-BuildMap").bind("click", function () {
                me._BuildMap();
            });
            //清除地图
            $("#" + me._id + "-ClearMap").bind("click", function () {
                me._ClearMap();
            });
            me._bindColorIcon();
        },
        _bindColorIcon: function () {

            $('.colorIcoHistogram').unbind('click');
            $('.colorIcoHistogram').bind("click", function (evt) {

                curIco = this;

                var id = "ColorPanel";

                if (g_myPalette != null) {
                    if ($("#" + id)[0].style.visibility == "visible")
                        $("#" + id)[0].style.visibility = "hidden";
                    else
                        $("#" + id)[0].style.visibility = "visible";
                }
                else {

                    if (document.getElementById(id)) {
                        document.getElementsByTagName("body")[0].removeChild(document.getElementById(id));
                    }
                    var colorIcon = document.createElement("div");
                    colorIcon.setAttribute("id", id);
                    colorIcon.setAttribute("style", "z-index:9999;position:absolute;float:left;");

                    document.getElementsByTagName("body")[0].appendChild(colorIcon);

                    g_myPalette = new ColorPalette({
                        onChange: function (val) { curIco.style.background = val; $("#" + id)[0].style.visibility = "hidden"; }
                    }, id);

                }
                $('#' + id).css({ left: evt.clientX + "px", top: evt.clientY + "px", zIndex: 9999 }).slideDown("fast");


            });
        },

        // 单击时执行的方法
        onClick: function (target) {
            var me = this;
            sidebar.showContent(me._id);
        },

        _DrawHistogram: function (statUnitName, featureSet, dataTableRecord) {

            var me = tool;
            var maxStatValue = me._maxColumnValue;
            var chartWidthValue = 0.007 * me._chartWidthPercent;
            var chartHeightValue = 0.04 * me._chartHeightPercent;


            if (featureSet.features.length != 1) {
                alert("统计单元服务地址只能对应一个要素！");
                return;
            }

            var graphicsLayer = new GraphicsLayer();
            for (var i = 0; i < me._statObjects.length; ++i) {
                var geometry = featureSet.features[0].geometry;
                var center = geometry.getCentroid();
                var xStart = center.x - (chartWidthValue * me._statObjects.length) / 2;
                var yStart = center.y;

                var x = xStart + i * (chartWidthValue);
                var xEnd = xStart + (i + 1) * (chartWidthValue);

                var yEnd = center.y + chartHeightValue * dataTableRecord[me._statObjects[i].columnName] / maxStatValue;
                var extent = new Extent(x, yStart, xEnd, yEnd, new SpatialReference({ wkid: 4326 }));
                var symbol = new SimpleFillSymbol().setColor(new Color(me._statObjects[i].color));
                symbol.outline.setWidth(0);
                graphicsLayer.add(new Graphic(extent, symbol));

                var point = new Point(center.x, center.y - 0.01, new SpatialReference({ wkid: 4326 }));
                graphicsLayer.add(new Graphic(point, new TextSymbol(statUnitName)));
            }
            me._graphicLayersForChart.push(graphicsLayer);

        },

        _DrawBackgroundArea: function (dataStatUnit, dataTableRecord, index) {
            var me = tool;

            var featureLayer = new FeatureLayer(config.url.GQPC_StatUnitsServerUrl + '/' + dataStatUnit.ServerUrl, {
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"]
            });

            var query = new Query();
            query.outFields = ["*"];
            query.where = "1=1";
            featureLayer.queryFeatures(query, function (featureSet) {
                var bkSimbol = new SimpleFillSymbol();
                bkSimbol.setColor(new Color(commonUtil._chartColors[index]));
                bkSimbol.outline.setColor(new Color("#FFFF00"));


                bkSimbol.outline.setWidth(1.5);
                var graphicsLayer = new GraphicsLayer();
                for (var i = 0; i < featureSet.features.length; ++i) {
                    graphicsLayer.add(new Graphic(featureSet.features[i].geometry, bkSimbol));
                    me._statUnitFeatures.push(featureSet.features[i]);
                }
                if (featureSet.features.length > 0) {
                    application.map.addLayer(graphicsLayer);
                    commonUtil.graphicLayer.push(graphicsLayer);
                    me._graphicLayersForStatUnit.push(graphicsLayer);
                }
                me._DrawHistogram(dataStatUnit.Name, featureSet, dataTableRecord);

                if (me._graphicLayersForStatUnit.length == me._selectedStatUnitsData.length) {
                    for (var i = 0; i < me._graphicLayersForChart.length; ++i) {
                        commonUtil.graphicLayer.push(me._graphicLayersForChart[i]);
                        application.map.addLayer(me._graphicLayersForChart[i]);
                    }
                }

            });


        },

        _DrawLegend: function () {
            var me = tool;
            var legend = document.createElement("div");
            legend.setAttribute("id", "legendID");
            legend.setAttribute("style", "padding:5px;padding-right:20px;position:absolute;right:0px;bottom:20px;z-index:9999;background:#FFFFFF;text-align:center;");

            var txt = document.createTextNode("图例");
            legend.appendChild(txt);

            var innerHTML = '<table cellspacing=10>';
            for (var i = 0; i < me._statObjects.length; ++i) {
                innerHTML += '<tr><td><div style="height:30px;"><div style="padding-bottom:5px;width:32px;height:20px;background:' + me._statObjects[i].color;
                innerHTML += ';float:left"></div><div style="padding-left:5px;float:left">';


                innerHTML += me._statObjects[i].name;
                innerHTML += '</div></div></td></tr>';

            }
            innerHTML += '</table>';
            var divIcon = document.createElement("div")
            divIcon.setAttribute("id", "divICON");
            divIcon.setAttribute("style", "margin-top:10px;");
            divIcon.innerHTML = innerHTML;
            legend.appendChild(divIcon);
            document.getElementById("map-div").appendChild(legend);
        },

        _BuildMap: function () {
            var me = tool;
            me._ClearMap();

            me._statUnitColor = $('.cHistogramStatUnitColor').css('backgroundColor');

            for (var i = 0; i < $('.cHistogramStatObjectColor').length; ++i) {
                for (var j = 0; j < me._statObjects.length; ++j) {
                    if (me._statObjects[j].name == $('.cHistogramStatObjectColor')[i].attributes['tag'].value)
                        me._statObjects[j].color = $('.cHistogramStatObjectColor')[i].style.backgroundColor;
                }
            }


            //获取数据表名
            var dataTableName = null;
            var dataSourceName = $('#' + me._id + '-statDataSource').val();
            for (var i = 0; i < commonUtil.allStatObjects.length; ++i) {
                if (commonUtil.allStatObjects[i].dataSourceName == dataSourceName) {
                    dataTableName = commonUtil.allStatObjects[i].tableName;
                    break;
                }
            }



            var urlDataLayerServer = lang.replace("{0}", [config.url.ProxyUrl + config.url.GQPC_BasicDataServiceUrl + dataTableName]);

            request(urlDataLayerServer, {
                handleAs: "text"
            }).then(function (text) {
                var statData = eval(text);
                //找出数据表中最大值，作为图形高度基准
                me._maxColumnValue = 0;

                for (var i = 0; i < me._selectedStatUnitsData.length; ++i) {
                    for (var j = 0; j < statData.length; ++j) {
                        if (statData[j].UnitCode == me._selectedStatUnitsData[i].Code && statData[j].EleCode == me._selectedContent.cc) {
                            for (var k = 0; k < me._statObjects.length; ++k) {
                                if (me._maxColumnValue < Number(statData[j][me._statObjects[k].columnName]))
                                    me._maxColumnValue = Number(statData[j][me._statObjects[k].columnName]);
                            }
                        }
                    }
                }

                var sizeOffset = me._selectedStatUnitsData.length - commonUtil._chartColors.length;
                if (sizeOffset > 0) {
                    for (var i = 0; i < sizeOffset; ++i)
                        commonUtil._chartColors.push(commonUtil.RandomColor());
                }

                for (var i = 0; i < me._selectedStatUnitsData.length; ++i) {
                    for (var j = 0; j < statData.length; ++j) {
                        if (statData[j].UnitCode == me._selectedStatUnitsData[i].Code && statData[j].EleCode == me._selectedContent.cc) {
                            me._DrawBackgroundArea(me._selectedStatUnitsData[i], statData[j],i);
                            break;
                        }
                    }

                }

                me._statData = statData;
                me._showTable(me._selectedStatUnitsData, statData, false);

            }, function (err) {
                alert(me._id + ":加载统计单元失败！");
            });

            me._DrawLegend();
        },
        _getZhiBiaoName: function (dataSourceName, columnName) {
            var me = tool;
            for (var i = 0; i < commonUtil.allStatObjects.length; ++i) {
                if (commonUtil.allStatObjects[i].dataSourceName == dataSourceName) {
                    var datas = commonUtil.allStatObjects[i].data;
                    for (var j = 0; j < datas.length; ++j) {
                        if (columnName == datas[j].columnName)
                            return datas[j].statObjectName + datas[j].unit;
                    }
                    break;
                }
            }
            return columnName;
        },
        _showTable: function (selectedStatUnitsData, statData, isEmpty) {
            var me = tool;


            debugger;
            //提取与选择的统计单元和统计内容相关联的记录
            var data = [];
            for (var i = 0; i < statData.length; ++i) {
                for (var j = 0; j < selectedStatUnitsData.length; ++j) {
                    if (statData[i].UnitCode == selectedStatUnitsData[j].Code && statData[i].EleCode == me._selectedContent.cc) {
                        data.push(statData[i]);
                        break;
                    }
                }
            }



            if (data.length <= 0)
                return;

            debugger;
            var columnDefs = [];
            var index = 0;
            for (key in data[0]) {
                var temp = { "data": "", "title": "", "targets": index };
                temp.data = key;
                if (key == 'UnitType')
                    temp.title = '统计单元类型';
                else if (key == 'UnitCode')
                    temp.title = '统计单元代码';
                else if (key == 'UnitName')
                    temp.title = '统计单元名称';
                else if (key == 'EleCode')
                    temp.title = '统计对象代码';
                else if (key == 'EleName')
                    temp.title = '统计对象名称';
                else {
                    temp.title = me._getZhiBiaoName($('#' + me._id + '-statDataSource').val(), key);
                    temp.visible = false;
                    for (var i = 0; i < me._statObjects.length; ++i) {
                        if (me._statObjects[i].columnName == key) {
                            temp.visible = true;
                            break;
                        }
                    }
                }

                columnDefs.push(temp);
                index++;
            }





            //定义datatables
            $('#' + me._id + '-resultPanel').css("display", "block");
            $('#' + me._id + '-resultPanel').html('<table class="table table-bordered" cellspacing="0" id="' + me._id + '-queryResultTable"></table>');
            var table = $('#' + me._id + '-queryResultTable').DataTable({
                "data": isEmpty ? [] : data,
                "scrollX": true,
                "columnDefs": columnDefs,
                "oLanguage": {
                    "sProcessing": "处理中...",
                    "sLengthMenu": "_MENU_ 记录/页",
                    "sZeroRecords": "没有匹配的记录",
                    "sInfo": "第 _START_ 至 _END_ 项记录，共 _TOTAL_ 项",
                    "sInfoEmpty": "第 0 至 0 项记录，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项记录过滤)",
                    "sInfoPostFix": "",
                    "sSearch": "过滤:",
                    "sUrl": "",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上页",
                        "sNext": "下页",
                        "sLast": "末页"
                    }
                }
            });
            //选中行变色
            $('#' + me._id + '-queryResultTable tbody').on('click', 'tr', function () {

                table.$('tr.trSelected').removeClass('trSelected');
                $(this).addClass('trSelected');

                debugger;
                var statUnitName = table.row(this).data()['UnitName'];
                var statUnitCode = table.row(this).data()['UnitCode'];
                //var statUnitPAC = me._getStatUnitPAC(statUnitCode);
                me._showDetailInfo(statUnitCode, statUnitName, statUnitCode, data);
            });

        },
        _getStatUnitPAC: function (statUnitCode) {
            var me = tool;
            for (var i = 0; i < me._allStatUnitsData.length; ++i) {
                if (me._allStatUnitsData[i].Code == statUnitCode)
                    return me._allStatUnitsData[i].PAC;
            }
        },
        _showDetailInfo: function (statUnitCode, statUnitName, statUnitPAC, data) {
            var me = tool;


            application.map.infoWindow.setTitle('统计单元名称：' + statUnitName);
            for (var i = 0; i < me._statUnitFeatures.length; ++i) {
                if (me._statUnitFeatures[i].attributes['PAC'] == statUnitPAC) {
                    for (var j = 0; j < data.length; ++j) {
                        if (data[j].UnitCode == statUnitCode) {
                            var content = "";
                            for (var key in data[j]) {
                                var value = data[j][key] || "";
                                var keyText = '';

                                if (key == 'UnitType')
                                    keyText = '统计单元类型';
                                else if (key == 'UnitCode')
                                    keyText = '统计单元代码';
                                else if (key == 'UnitName')
                                    keyText = '统计单元名称';
                                else if (key == 'EleCode')
                                    keyText = '统计对象代码';
                                else if (key == 'EleName')
                                    keyText = '统计对象名称';
                                else
                                    keyText = me._getZhiBiaoName($('#' + me._id + '-statDataSource').val(), key);


                                for (var k = 0; k < me._statObjects.length; ++k) {
                                    if (me._statObjects[k].columnName == key) {
                                        content += "<span>" + keyText + "：</span><span>" + value + "</span><br/>";
                                        break;
                                    }
                                }


                            }

                            application.map.infoWindow.setContent(content);
                            application.map.infoWindow.show(me._statUnitFeatures[i].geometry.getCentroid());
                            break;
                        }
                    }
                    break;

                }
            }

        },
        _ClearMap: function () {
            var me = tool;

            me._statUnitFeatures = [];

            /*
            for (var i = 0; i < me._graphicLayersForChart.length; ++i) {
            application.map.removeLayer(me._graphicLayersForChart[i]);
            }
            for (var i = 0; i < me._graphicLayersForStatUnit.length; ++i) {
            application.map.removeLayer(me._graphicLayersForStatUnit[i]);
            }
            */

            for (var i = 0; i < commonUtil.graphicLayer.length; ++i)
                application.map.removeLayer(commonUtil.graphicLayer[i]);

            me._graphicLayersForChart = [];
            me._graphicLayersForStatUnit = [];



            var legend = document.getElementById("legendID");
            if (legend)
                document.getElementById("map-div").removeChild(legend);

            me._showTable(me._selectedStatUnitsData, me._statData, true);
            application.map.infoWindow.hide();
        }
    };

    tool.init();

    return tool;
});
