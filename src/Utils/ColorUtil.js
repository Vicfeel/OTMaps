/**
 * @author 张伟佩
 * @version 1.0
 * @date 2016-05-08
 * @description 色彩工具
 */
define([], function () {
    function ColorUtil() {
    }

    // 将rgb表示方式转换为hex表示方式("rgb(21,12,150)")或者（[21,12,150])
    ColorUtil.prototype.rgb2hex = function (rgb) {
        var _this = rgb;
        var strHex = "#";
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (Object.prototype.toString.call(_this) === '[object Array]') {
            for (var i = 0; i < _this.length; i++) {
                var hex = Number(_this[i]).toString(16);
                hex = hex < 10 ? 0 + '' + hex : hex;// 保证每个rgb的值为2位
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = _this;
            }
            return strHex;
        }
        else if (/^(rgb|RGB)/.test(_this)) {
            var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, "").split(",");
            strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                hex = hex < 10 ? 0 + '' + hex : hex;// 保证每个rgb的值为2位
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = _this;
            }
            return strHex;
        } else if (reg.test(_this)) {
            var aNum = _this.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return _this;
            } else if (aNum.length === 3) {
                strHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        } else {
            return _this;
        }
    }

    // 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
    ColorUtil.prototype.hex2rgb = function (hex) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var hex = hex.toLowerCase();
        if (hex && reg.test(hex)) {
            if (hex.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += hex.slice(i, i + 1).concat(hex.slice(i, i + 1));
                }
                hex = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + hex.slice(i, i + 2)));
            }
            return sColorChange;
        } else {
            return hex;
        }
    };

    // 获取一组渐变色('#1abc9c','#333fff',5)
    ColorUtil.prototype.getGradientColor = function (startColor, endColor, step) {
        startRGB = this.hex2rgb(startColor);//转换为rgb数组模式
        startR = startRGB[0];
        startG = startRGB[1];
        startB = startRGB[2];

        endRGB = this.hex2rgb(endColor);
        endR = endRGB[0];
        endG = endRGB[1];
        endB = endRGB[2];

        sR = (endR - startR) / step;//总差值
        sG = (endG - startG) / step;
        sB = (endB - startB) / step;

        var colorArr = [];
        for (var i = 0; i < step; i++) {
            //计算每一步的hex值
            var hex = this.rgb2hex([parseInt((sR * i + startR)),parseInt((sG * i + startG)),parseInt((sB * i + startB))]);
            colorArr.push(hex);
        }
        return colorArr;
    }

    return new ColorUtil();
});


