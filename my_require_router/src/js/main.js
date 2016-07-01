/**
 * Created by diogoxiang on 2016/6/29.
 */
define([], function() {
    'use strict';
    var baseUrl="../";
    var config={
        baseUrl:baseUrl,
        paths:{
            zepto: 'lib/zepto.min', // 手机端用 zepto
            jquery:'lib/jquery-1.9.0.min', // PC端用 jquery
            underscore: 'lib/underscore',
            text: 'lib/text',             //用于requirejs导入html类型的依赖
            css: 'lib/css',             //用于requirejs导入html类型的依赖
            router:'lib/router'
        }
    };

    // Configure require.js paths and shims
    require.config(config);

    // Load the router
    require(['router'], function(router) {
        router
            .registerRoutes({
                // matches an exact path
                home: { path: '/home', moduleId: 'html/home/homeView' }

            })
            .on('routeload', function(module, routeArguments) {
                // When a route loads, render the view and attach it to the document
                var body = document.querySelector('body');
                body.innerHTML = '';
                body.appendChild(new module(routeArguments).outerEl);
            })
            .init(); // Set up event handlers and trigger the initial page load
    });
});