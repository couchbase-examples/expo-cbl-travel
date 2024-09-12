"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReplicatorStatus = void 0;
class ReplicatorStatus {
  constructor(activityLevel, progress, error) {
    this.activityLevel = activityLevel;
    this.progress = progress;
    this.error = error;
  }
  getActivityLevel() {
    return this.activityLevel;
  }
  getProgress() {
    return this.progress;
  }
  getError() {
    return this.error;
  }
  toString() {
    if (this.error !== undefined) {
      return `Status{activityLevel=${this.activityLevel}, progress=${this.progress}}, error=${this.error}`;
    } else {
      return `Status{activityLevel=${this.activityLevel}, progress=${this.progress}}`;
    }
  }
  copy() {
    return new ReplicatorStatus(this.activityLevel, this.progress, this.error);
  }
}
exports.ReplicatorStatus = ReplicatorStatus;
//# sourceMappingURL=replicator-status.cjs.map