"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReplicatorActivityLevel = void 0;
let ReplicatorActivityLevel = exports.ReplicatorActivityLevel = /*#__PURE__*/function (ReplicatorActivityLevel) {
  ReplicatorActivityLevel[ReplicatorActivityLevel["STOPPED"] = 0] = "STOPPED";
  ReplicatorActivityLevel[ReplicatorActivityLevel["OFFLINE"] = 1] = "OFFLINE";
  ReplicatorActivityLevel[ReplicatorActivityLevel["CONNECTING"] = 2] = "CONNECTING";
  ReplicatorActivityLevel[ReplicatorActivityLevel["IDLE"] = 3] = "IDLE";
  ReplicatorActivityLevel[ReplicatorActivityLevel["BUSY"] = 4] = "BUSY";
  return ReplicatorActivityLevel;
}({});
//# sourceMappingURL=replicator-activity-level.cjs.map