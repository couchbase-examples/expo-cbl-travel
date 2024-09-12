"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConcurrencyControl = void 0;
let ConcurrencyControl = exports.ConcurrencyControl = /*#__PURE__*/function (ConcurrencyControl) {
  ConcurrencyControl[ConcurrencyControl["LAST_WRITE_WINS"] = 0] = "LAST_WRITE_WINS";
  ConcurrencyControl[ConcurrencyControl["FAIL_ON_CONFLICT"] = 1] = "FAIL_ON_CONFLICT";
  return ConcurrencyControl;
}({});
//# sourceMappingURL=concurrency-control.cjs.map