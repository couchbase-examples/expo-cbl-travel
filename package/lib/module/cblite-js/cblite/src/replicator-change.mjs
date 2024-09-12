export function isReplicatorChange(obj) {
  try {
    const object = obj;
    return object.activityLevel != null && object.progress != null && object.progress.completed != null && object.progress.total != null;
  } catch (e) {
    console.warn('Invalid ReplicatorChange', e);
    return false;
  }
}
//# sourceMappingURL=replicator-change.mjs.map