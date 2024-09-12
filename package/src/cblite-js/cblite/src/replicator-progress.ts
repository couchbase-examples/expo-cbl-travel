export class ReplicatorProgress {
  constructor(
    private completed: number,
    private total: number
  ) {}

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
