/**
 * Created by diogoxiang on 2016/5/20.
 * modify  :  2016年7月19日14:18:37
 * version : 0.0.2 版本
 * anthor : diogoxiang
 */

define(['jquery', 'underscore', 'progress', 'domReady', 'layer', 'md5','fullpage'], function ($, _, lod, doc, layer, md5,fp) {

    /**
     * 使用 {{xx}}  模版
     * @type {{interpolate: RegExp}}
     */
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    //接口地址:
    var u = {};
    u.isdebug = true; //PC调试的开关,PC调试要为true


    u.version = "11";
    u.deploy = {
        localhost: 'http://localhost:81/api',//本地反向代理
        forecast: 'http://ttkapi.ttq.com:900',//远程测试环境
        hxpreRelease: 'http://ttc.ttq.com'//预发布地址 的核销权限地址
    };
    u.host = u.deploy.localhost; // 接口地址  上线记得更改  默认是测试环境


    //提共接口外调
    return {
        version: '0.0.2',   //当前工具的版本
        progress: lod,
        layer: layer,
        md5: md5,
        apiurl: u,//把u 外漏
        /**
         * tool 工具初始化
         */
        init: function () {
            console.log("init");
            $('#fullpage').fullpage({
                anchors: ['首页', 'Second page', '3page', '4page', '5page', '6page', '7page', '8page'],
                sectionsColor: ['#C63D0F', '#F1F1F1', '#C63D0F', '#F1F1F1', '#C63D0F', '#F1F1F1', '#C63D0F', '#C63D0F'],
                navigation: true,
                navigationPosition: 'right',
                navigationTooltips: ['首页', 'Second page', '3page', '4page', '5page', '6page', '7page', '8page']
            });
            //检查用户是否登录
            //this.checkLogin();
        },
        /**
         * endProgress
         */
        endProgress: function () {
            lod().end();
        },
        /**
         * 获取用户访问UA
         */
        getUa: function () {
            var ua = window.navigator.userAgent.toLocaleLowerCase(), isApple = !!ua.match(/(ipad|iphone|mac)/i), isAndroid = !!ua.match(/android/i), isWinPhone = !!ua.match(/MSIE/i), ios6 = !!ua.match(/os 6.1/i), isWeixin = !!ua.match(/MicroMessenger/i);
            return {isApple: isApple, isAndroid: isAndroid, isWinPhone: isWinPhone, ios6: ios6, isweixin: isWeixin}
        },


        is_weixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        /**
         * getMode 从URL地址栏中获取model的参数
         * @param name  参数的名称
         * @returns {null} 返回参数的值
         */
        getModel: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        /**
         *
         * @param str
         * @returns {boolean}
         */
        isCellphone: function (str) {
            /**
             *@descrition:手机号码段规则
             * 13段：130、131、132、133、134、135、136、137、138、139
             * 14段：145、147
             * 15段：150、151、152、153、155、156、157、158、159
             * 17段：170、176、177、178
             * 18段：180、181、182、183、184、185、186、187、188、189
             *
             */
            var pattern = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;
            return pattern.test(str);
        },
        /**
         * 简易AJAX封装
         * @param url
         * @param data
         * @param success
         * @param error
         */
        getAjax: function (url, data, success, errorF) {
            var aurl = u.host + url;
            console.log("请求地址是:" + aurl);
            $.ajax({
                type: "POST",
                url: aurl,
                data: data,
                dataType: 'json',
                timeout: 5000,
                success: function (data) {
                    //console.log( "Data Saved: " + data );
                    return success(data);
                },
                error: function (data) {
                    if (_.isFunction(errorF)) {
                        return errorF(url, data);
                    } else {
                        $app.getError(url, data);
                    }

                },
                complete: function (XMLHttpRequest, textStatus) {
                    //console.log(XMLHttpRequest)
                    //console.log(textStatus)
                    //当前方法为.请求返回的详情
                }

            });


        },

        /**
         * 本地ajax 拦截请求
         * @param url 本地json 对像  GET 取值
         * @param callback
         */
        getData: function (url, callback) {
            var xhr;
            try {
                xhr = new ActiveXObject('Msxml2.XMLHTTP');
            }
            catch (e) {
                try {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                } catch (e2) {
                    try {
                        xhr = new XMLHttpRequest();
                    }
                    catch (e3) {
                        xhr = false;
                    }
                }
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {

                    callback && (callback(JSON.parse(xhr.responseText), xhr))
                }
            };
            xhr.open('GET', url, true);
            xhr.send(null);
        },
        /**
         *
         */
        getError: function (url, data) {
            console.log("出错的地址是:" + url + "::::" + "返回值是" + data);
        },
        /**
         * 检验用户是否已经登录
         */
        checkLogin: function () {
            console.log("检验用户是否已经登录")
            if (!ck.get("token")) {
                window.location.href = "index.html?m=login";
            }

        },
        /**
         * 用户退出 清除 cookies
         */
        userOut: function () {
            ck.remove('token');
            ck.remove('userinfo');
            window.location.href = "index.html";
        },
        /**
         * 截取字符串
         * @param e
         * @param num
         * @returns {string}
         */
        getStr: function (e, num) {
            var more = '';
            if (e.length >= 12) {
                more = '...';
            }
            var data = e.substr(0, num) + more;
            return data.toString();
        },

        /**
         * 判断字符串长度
         * @param str
         * @param len
         */
        strLen: function (str, len) {
            if (str.length < len) {
                console.log(str.length + "----" + len);
                return true;
            }
            return false;
        },
        /**
         * 格式化时间
         * @param time   unix时间戳
         * @param e   返回的时间样式 默认返回  "yyyy-mm-dd hh:mm:ss "
         */
        formatDate: function (time, e) {
            time = new Date(time);

            function fixZero(num, length) {
                var str = "" + num;
                var len = str.length;
                var s = "";
                for (var i = length; i-- > len;) {
                    s += "0";
                }
                return s + str;
            }

            return time.getFullYear() + "-" + fixZero(time.getMonth() + 1, 2) + "-" + fixZero(time.getDate(), 2) + " " + fixZero(time.getHours(), 2) + ":" + fixZero(time.getMinutes(), 2) + ":" + fixZero(time.getSeconds(), 2);

        },

        /**
         * 滑动固定
         * @param e 为div   ID
         */
        getFixed: function (eid) {

            window.onscroll = function (e) {
                var e = e || window.event;
                var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
                var headDom = document.getElementById(eid);
                if (scrolltop > 10) {
                    var op = scrolltop / 100;
                    headDom.style.opacity = op + 0.2;
                    headDom.className = "container-full newHeader";

                } else {

                    headDom.style.opacity = 1;
                    headDom.className = "container-full newHeader"
                }
            };

        },
        /**
         * 页面的跳转
         * @param url
         */
        gotoUrl: function (url) {

            window.location.href = url;

            //阻击事件冒泡
            event.stopPropagation();

        },
        /**
         * 重写log 方法 输出指定前缀
         * @param str
         */
        log: function (str) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('(app)');
            console.log.apply(console, args);
        }

    };


});