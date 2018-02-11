import { DbConnection } from '../config/dbConnection';

export class BaseDAO {
    protected connDb = new DbConnection(process.env.DB_NENO_GLOBAL);
}