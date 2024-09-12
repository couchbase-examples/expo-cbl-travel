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

export function isReplicatorChange(obj: any): obj is ReplicatorChange {
  try {
    const object: ReplicatorChange = obj;
    return (
      object.activityLevel != null &&
      object.progress != null &&
      object.progress.completed != null &&
      object.progress.total != null
    );
  } catch (e) {
    console.warn('Invalid ReplicatorChange', e);
    return false;
  }
}
