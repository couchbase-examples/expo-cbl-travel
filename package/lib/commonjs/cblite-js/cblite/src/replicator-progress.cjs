"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReplicatorProgress = void 0;
class ReplicatorProgress {
  constructor(completed, total) {
    this.completed = completed;
    this.total = total;
  }
  getCompleted() {
    return this.completed;
  }
  getTotal() {
    return this.total;
  }
  toString() {
    return `Progress{completed=${this.completed}, total=${this.total}}`;
  }
  copy() {
    return new ReplicatorProgress(this.completed, this.total);
  }
}
exports.ReplicatorProgress = ReplicatorProgress;
//# sourceMappingURL=replicator-progress.cjs.map