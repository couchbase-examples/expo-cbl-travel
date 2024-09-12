import { Database } from './database';

// Couchbase Mobile Docs
//https://docs.couchbase.com/couchbase-lite/current/swift/troubleshooting-logs.html#lbl-file-logs

export interface DatabaseFileLoggingConfiguration {
  level: number;
  directory: string;
  maxRotateCount?: number;
  maxSize?: number;
  usePlaintext?: boolean;
}

export class DatabaseLogging {
  constructor(private database: Database) {}

  setFileConfig(config: DatabaseFileLoggingConfiguration): Promise<void> {
    return this.database.getEngine().database_SetFileLoggingConfig({
      name: this.database.getName(),
      config: config,
    });
  }
}
