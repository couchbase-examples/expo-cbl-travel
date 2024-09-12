import { ReplicatorActivityLevel } from './replicator-activity-level';
import { ReplicatorProgress } from './replicator-progress';
export declare class ReplicatorStatus {
    private activityLevel;
    private progress;
    private error;
    constructor(activityLevel: ReplicatorActivityLevel, progress: ReplicatorProgress, error: String | undefined);
    getActivityLevel(): ReplicatorActivityLevel;
    getProgress(): ReplicatorProgress;
    getError(): String | undefined;
    toString(): string;
    copy(): ReplicatorStatus;
}
//# sourceMappingURL=replicator-status.d.ts.map