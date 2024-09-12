export class ReplicatorStatus {
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
//# sourceMappingURL=replicator-status.mjs.map