export declare enum ReplicatedDocumentFlag {
    DELETED = "DELETED",
    ACCESS_REMOVED = "ACCESS_REMOVED"
}
export declare class ReplicatedDocument {
    protected id: string;
    protected flags: ReplicatedDocumentFlag[];
    protected error: String;
    protected scopeName: String;
    protected collectionName: String;
    constructor(id: string, flags: ReplicatedDocumentFlag[], error: String, scopeName: String, collectionName: String);
    getId(): string;
    getFlags(): ReplicatedDocumentFlag[];
    getError(): String | undefined;
}
export interface ReplicatedDocumentRepresentation {
    id: string;
    flags: string[];
    scopeName: string;
    collectionName: string;
    error: {
        message: string;
    };
}
export declare function isReplicatedDocumentRepresentation(obj: any): obj is ReplicatedDocumentRepresentation;
//# sourceMappingURL=replicated-document.d.ts.map