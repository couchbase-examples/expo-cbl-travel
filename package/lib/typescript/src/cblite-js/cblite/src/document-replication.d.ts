import { ReplicatedDocument, ReplicatedDocumentRepresentation } from './replicated-document';
export declare class DocumentReplication {
    protected isPush: boolean;
    protected documents: ReplicatedDocument[];
    constructor(isPush: boolean, documents: ReplicatedDocument[]);
    getIsPush(): boolean;
    getDocuments(): ReplicatedDocument[];
}
export interface DocumentReplicationRepresentation {
    isPush: boolean;
    documents: ReplicatedDocumentRepresentation[];
}
export declare function isDocumentReplicationRepresentation(obj: any): obj is DocumentReplicationRepresentation;
//# sourceMappingURL=document-replication.d.ts.map