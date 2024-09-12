import { ReplicatorActivityLevel } from './replicator-activity-level';
import { ReplicatorProgress } from './replicator-progress';

export class ReplicatorStatus {
  constructor(
    private activityLevel: ReplicatorActivityLevel,
    private progress: ReplicatorProgress,
    private error: String | undefined
  ) {}

  getActivityLevel() {
    return this.activityLevel;
  }

  getProgress() {
    return this.progress;
  }

  getError(): String | undefined {
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
