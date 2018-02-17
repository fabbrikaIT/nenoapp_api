import { Response } from 'express';

import { ApplicationLog, ELogType } from './../../shared/log/app-log.model';
import { BaseDAO } from '../baseDAO';

export class LogsDAO extends BaseDAO {
    private listApplicationLogsQuery: string = `SELECT * FROM APPLICATION_LOG ORDER BY DATE DESC LIMIT 30`;
    private listNetworkLogsQuery: string = `SELECT * FROM NETWORK_LOGS ORDER BY DATE DESC LIMIT 30`;
    private listApplicationLogsByStatusQuery: string = `SELECT * FROM APPLICATION_LOG WHERE TYPE = ? ORDER BY DATE DESC LIMIT 30`;

    constructor() {
        super()
    }

    public ListApplicationLogs = (res: Response, callback) => {
        this.connDb.Connect(
            connection => {
                connection.query(this.listApplicationLogsQuery, (error, results) => {
                    if (!error) {
                        let list: Array<ApplicationLog>;
                        list = results.map(item => {
                            let planItem = new ApplicationLog();
                            planItem.fromMySqlDbEntity(item);

                            return planItem;
                        });

                        connection.release();
                        return callback(res, error, list);
                    }

                    connection.release();
                    return callback(res, error, null);
                });
            }, 
            error => {
                callback(null, error);
            }
        );
    }

    public ListApplicationByTypeLogs = (type: ELogType, res: Response, callback) => {
        this.connDb.Connect(
            connection => {
                connection.query(this.listApplicationLogsByStatusQuery, type, (error, results) => {
                    if (!error) {
                        let list: Array<ApplicationLog>;
                        list = results.map(item => {
                            let planItem = new ApplicationLog();
                            planItem.fromMySqlDbEntity(item);

                            return planItem;
                        });

                        connection.release();
                        return callback(res, error, list);
                    }

                    connection.release();
                    return callback(res, error, null);
                });
            }, 
            error => {
                callback(null, error);
            }
        );
    }
}