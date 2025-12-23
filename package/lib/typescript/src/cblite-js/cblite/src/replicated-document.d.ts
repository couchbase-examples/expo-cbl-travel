export declare enum ReplicatedDocumentFlag {
    DELETED = "DELETED",
    ACCESS_REMOVED = "ACCESS_REMOVED"
}
export declare class ReplicatedDocument {
    protected id: string;
    protected flags: ReplicatedDocumentFlag[];
    protected error: string;
    protected scopeName: string;
    protected collectionName: string;
    constructor(id: string, flags: ReplicatedDocumentFlag[], error: string, scopeName: string, collectionName: string);
    getId(): string;
    getFlags(): ReplicatedDocumentFlag[];
    getError(): string | undefined;
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