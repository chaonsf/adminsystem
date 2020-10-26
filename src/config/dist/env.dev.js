"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.env = exports.codeUrl = exports.iconfontVersion = exports.iconfontUrl = exports.baseUrl = void 0;
// 配置编译环境和线上环境之间的切换
var baseUrl = '';
exports.baseUrl = baseUrl;
var iconfontVersion = ['567566_pwc3oottzol', '1066523_v8rsbcusj5q', '1960509_rp2979sonh', '1961214_darzej1obi'];
exports.iconfontVersion = iconfontVersion;
var iconfontUrl = "//at.alicdn.com/t/font_$key.css";
exports.iconfontUrl = iconfontUrl;
var codeUrl = "".concat(baseUrl, "/code");
exports.codeUrl = codeUrl;
var env = process.env;
exports.env = env;

if (env.NODE_ENV == 'development') {
  exports.baseUrl = baseUrl = ""; // 开发环境地址
} else if (env.NODE_ENV == 'production') {
  exports.baseUrl = baseUrl = ""; //生产环境地址
} else if (env.NODE_ENV == 'test') {
  exports.baseUrl = baseUrl = ""; //测试环境地址
}