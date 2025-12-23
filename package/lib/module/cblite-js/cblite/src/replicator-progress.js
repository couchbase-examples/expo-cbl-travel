"use strict";

export class ReplicatorProgress {
  // eslint-disable-next-line
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
//# sourceMappingURL=replicator-progress.js.map