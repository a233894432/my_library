/**
 * Created by diogoxiang on 2016/6/12.
 */
(function ($, w, d) {

    "use strict";

    /**
     * 生成指定长度的随机数
     * @param length
     * @returns {string}
     */
    $.pseudoUnique = function (length) {
        /// <summary>Returns a pseudo unique alpha-numeric string of the given length.</summary>
        /// <param name="length" type="Number">The length of the string to return. Defaults to 8.</param>
        /// <returns type="String">The pseudo unique alpha-numeric string.</returns>

        var len = length || 8,
            text = "",
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            max = possible.length;

        if (len > max) {
            len = max;
        }

        for (var i = 0; i < len; i += 1) {
            text += possible.charAt(Math.floor(Math.random() * max));
        }

        return text;

    };

    /**
     * 判断HTML 中 dir 值
     */
    $.support.rtl = (function () {
             return $("html[dir=rtl]").length ? true : false;
    }());




} (jQuery, window, document));