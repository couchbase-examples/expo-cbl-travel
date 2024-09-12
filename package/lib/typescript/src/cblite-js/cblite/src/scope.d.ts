import { Collection } from './collection';
import { Database } from './database';
export declare class Scope {
    private _engine;
    /**
     * Scope's name.
     *
     * @property
     */
    name: string;
    /**
     * Scope's Database.
     *
     * @property
     */
    database: Database;
    constructor(name: string | undefined, database: Database);
    collections(): Promise<Collection[]>;
    collection(collectionName: string): Promise<Collection | null>;
}
//# sourceMappingURL=scope.d.ts.map