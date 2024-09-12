import { ReplicatorActivityLevel } from './replicator-activity-level';
export interface ReplicatorChange {
    activityLevel: ReplicatorActivityLevel;
    error: {
        message: string;
        domain: string;
        code: number;
    };
    progress: {
        completed: number;
        total: number;
    };
}
export declare function isReplicatorChange(obj: any): obj is ReplicatorChange;
//# sourceMappingURL=replicator-change.d.ts.map