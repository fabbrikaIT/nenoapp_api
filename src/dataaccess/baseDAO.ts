import { DbConnection } from '../config/dbConnection';
import { IToMysqlDbEntity } from '../models/iToMysqlDbEntity';

export class BaseDAO implements IToMysqlDbEntity {
    toMysqlDbEntity(isNew: boolean) {
        
    }
    fromMySqlDbEntity(dbentity: any) {
        
    }
    protected connDb = new DbConnection(process.env.DB_NENO_GLOBAL || "");
}