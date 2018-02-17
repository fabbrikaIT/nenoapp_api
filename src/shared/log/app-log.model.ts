import { BaseEntity } from '../../models/base.model';

export enum ELogType {
    Debug = 1,
    Information = 2,
    Warning = 3,
    Error = 4,
    Fatal = 5
}

export class ApplicationLog extends BaseEntity {
    public id: number;
    public date: Date;
    public source: string;
    public message: string;
    public type: ELogType;
    public arguments: string;    

    fromMySqlDbEntity(dbEntity) {
        this.id = dbEntity.ID;
        this.date = dbEntity.DATE;
        this.source = dbEntity.SOURCE;
        this.message = dbEntity.MESSAGE;
        this.type = dbEntity.TYPE;
        this.arguments = dbEntity.ARGUMENTS;
    }
}