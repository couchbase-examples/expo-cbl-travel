"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexType = exports.AbstractIndex = void 0;
let IndexType = exports.IndexType = /*#__PURE__*/function (IndexType) {
  IndexType[IndexType["Value"] = 0] = "Value";
  IndexType[IndexType["FullText"] = 1] = "FullText";
  IndexType[IndexType["Geo"] = 2] = "Geo";
  return IndexType;
}({});
class AbstractIndex {}
exports.AbstractIndex = AbstractIndex;
//# sourceMappingURL=abstract-index.cjs.map