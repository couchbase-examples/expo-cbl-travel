export class ReplicatorProgress {
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
//# sourceMappingURL=replicator-progress.mjs.map