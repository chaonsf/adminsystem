"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _store = require("@/util/store");

var _website = _interopRequireDefault(require("@/config/website"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var common = {
  state: {
    language: (0, _store.getStore)({
      name: 'language'
    }) || 'zh',
    isCollapse: false,
    isFullScren: false,
    isShade: false,
    screen: -1,
    isLock: (0, _store.getStore)({
      name: 'isLock'
    }) || false,
    showTag: true,
    showDebug: true,
    showCollapse: true,
    showSearch: false,
    showLock: true,
    showFullScren: true,
    showTheme: true,
    showMenu: true,
    showColor: true,
    colorName: (0, _store.getStore)({
      name: 'colorName'
    }) || '#409EFF',
    themeName: (0, _store.getStore)({
      name: 'themeName'
    }) || 'theme-white',
    //theme-white/theme-default
    lockPasswd: (0, _store.getStore)({
      name: 'lockPasswd'
    }) || '',
    website: _website["default"]
  },
  mutations: {
    SET_LANGUAGE: function SET_LANGUAGE(state, language) {
      state.language = language;
      (0, _store.setStore)({
        name: 'language',
        content: state.language
      });
    },
    SET_SHADE: function SET_SHADE(state, active) {
      state.isShade = active;
    },
    SET_COLLAPSE: function SET_COLLAPSE(state) {
      state.isCollapse = !state.isCollapse;
    },
    SET_FULLSCREN: function SET_FULLSCREN(state) {
      state.isFullScren = !state.isFullScren;
    },
    SET_LOCK: function SET_LOCK(state) {
      state.isLock = true;
      (0, _store.setStore)({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      });
    },
    SET_SCREEN: function SET_SCREEN(state, screen) {
      state.screen = screen;
    },
    SET_COLOR_NAME: function SET_COLOR_NAME(state, colorName) {
      state.colorName = colorName;
      (0, _store.setStore)({
        name: 'colorName',
        content: state.colorName
      });
    },
    SET_THEME_NAME: function SET_THEME_NAME(state, themeName) {
      state.themeName = themeName;
      (0, _store.setStore)({
        name: 'themeName',
        content: state.themeName
      });
    },
    SET_LOCK_PASSWD: function SET_LOCK_PASSWD(state, lockPasswd) {
      state.lockPasswd = lockPasswd;
      (0, _store.setStore)({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      });
    },
    CLEAR_LOCK: function CLEAR_LOCK(state) {
      state.isLock = false;
      state.lockPasswd = '';
      (0, _store.removeStore)({
        name: 'lockPasswd',
        type: 'session'
      });
      (0, _store.removeStore)({
        name: 'isLock',
        type: 'session'
      });
    }
  }
};
var _default = common;
exports["default"] = _default;