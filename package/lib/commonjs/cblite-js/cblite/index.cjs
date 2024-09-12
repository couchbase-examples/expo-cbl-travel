"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _coreTypes = require("./core-types.cjs");
Object.keys(_coreTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _coreTypes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _coreTypes[key];
    }
  });
});
var _index = require("./src/index.cjs");
Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index[key];
    }
  });
});
//# sourceMappingURL=index.cjs.map