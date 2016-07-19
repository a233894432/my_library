/**
 * Created by diogoxiang on 2016/7/19.
 */
(function(win){
    //配置BaseUrl
    var baseUrl="./";
    var mod,containerDiv;
    containerDiv=document.getElementById('container');
    function getUa() {
        var ua = window.navigator.userAgent.toLocaleLowerCase(), isApple = !!ua.match(/(ipad|iphone|mac)/i), isAndroid = !!ua.match(/android/i), isWinPhone = !!ua.match(/MSIE/i), ios6 = !!ua.match(/os 6.1/i),isWeixin=!!ua.match(/MicroMessenger/i);
        return { isApple: isApple, isAndroid: isAndroid, isWinPhone: isWinPhone, ios6: ios6,isWeixin:isWeixin }
    }
    //如果是手机端的话用另一种的样式
    win.isMoblie=false;
    win.isWeixin=false;
    /**
     * 取URL上面的参数
     * @param name
     * @returns {null}
     */
    var getMode= function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    };
    /*
     * 文件依赖
     */
    var config = {
        baseUrl: baseUrl,           //依赖相对路径
        paths: {                    //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出

            zepto: 'libs/zepto.min', // 手机端用 zepto
            jquery:'libs/jquery.min', // PC端用 jquery
            underscore: 'libs/underscore',
            text: 'libs/text',             //用于requirejs导入html类型的依赖
            css: 'libs/css',             //用于requirejs导入html类型的依赖
            domReady:'libs/domReady',       //页面加载事件及DOM Ready
            layer:'libs/layer.min',         //弹窗
            progress:'libs/progress', //页面加载动画
            tool:'js/vendor/tool',  //工具箱
            cookies:'libs/Cookies',
            md5:'libs/md5_require',//MD5加密
            //fullpage
            fullpage:'libs/jquery.fullpage.min'

        },
        shim: {                     //引入没有使用requirejs模块写法的类库。
            underscore: {
                exports: '_'
            },
            zepto: {
                exports: '$'
            },
            layer:{
                deps: ['jquery']
            },
            cookies:{
                deps: ['jquery']
            },
            fullpage:{
                deps:['jquery']
            }
        }
    };

    require.config(config);
    require(['jquery', 'underscore','tool'], function($, _, tool){
        win.appView = $('#container');      //用于各个模块控制视图变化
        win.$ = $;                          //暴露必要的全局变量，没必要拘泥于requirejs的强制模块化
        win._ = _;                          //暴露必要的全局变量，
        win.$app=tool;

        $app.init();


    //    关闭载入动画
        $app.endProgress();

    });
})(window);