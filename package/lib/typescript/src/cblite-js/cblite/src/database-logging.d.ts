import { Database } from './database';
export interface DatabaseFileLoggingConfiguration {
    level: number;
    directory: string;
    maxRotateCount?: number;
    maxSize?: number;
    usePlaintext?: boolean;
}
export declare class DatabaseLogging {
    private database;
    constructor(database: Database);
    setFileConfig(config: DatabaseFileLoggingConfiguration): Promise<void>;
}
//# sourceMappingURL=database-logging.d.ts.map