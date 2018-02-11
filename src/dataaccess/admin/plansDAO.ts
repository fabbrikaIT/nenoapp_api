import { Response } from 'express';

import { BaseDAO } from './../baseDAO';
import { PlansEntity } from './../../models/admin/plans.model';

export class PlansDAO extends BaseDAO {
    // SQL de Acesso a Base
    private listQuery: string = "SELECT * FROM PLANS";
    private getQuery: string = "SELECT * FROM PLANS WHERE ID = ?";
    private createQuery: string = "INSERT INTO PLANS SET ?";
    private updateQuery: string = "UPDATE PLANS SET ? WHERE ID = ?";
    private deleteQuery : string = "DELETE FROM PLANS WHERE ID = ?";

    /**
     * Listagem de planos
     */
    public ListPlans(res: Response, callback) {
        this.connDb.Connect(
            connection => {
                connection.query(this.listQuery, (error, results) => {
                    if (!error) {
                        let list: Array<PlansEntity>;
                        list = results.map(item => {
                            let planItem = new PlansEntity();
                            planItem.fromMySqlDbEntity(item);

                            return planItem;
                        });

                        connection.release();
                        return callback(res, error, list);
                    }

                    connection.release();
                    return callback(res, error, results);
                });
            }, 
            error => {
                callback(null, error);
            }
        );
    }

    public GetPlan = (id: number, res: Response,  callback) => {
        this.connDb.Connect(
            connection => {

                const query = connection.query(this.getQuery, id, (error, results) => {
                    if (!error && results.length > 0) {
                       
                        let planItem = new PlansEntity();
                        planItem.fromMySqlDbEntity(results[0]);
                        
                        connection.release();
                        return callback(res, error, planItem);
                        
                    } else {
                        connection.release();
                        return callback(res, error, results);
                    }
                });
            }, 
            error => {
                return callback(res, error, null);
            }
        );
    }

    public Create = (plan: PlansEntity, callback)  => { 
        this.connDb.Connect(
            connection => { 
                const dbEntity = plan.toMysqlDbEntity(true);

                const query = connection.query(this.createQuery, dbEntity, (error, results) => { 
                    connection.release();
                    return callback(error, results);
                });
            },
            error => {
                callback(error, null);
            }
        );
    }

    public Update = (plan: PlansEntity, callback)  => { 
        this.connDb.Connect(
            connection => { 
                const dbEntity = plan.toMysqlDbEntity(true);

                const query = connection.query(this.updateQuery, [dbEntity, plan.id], (error, results) => { 
                    connection.release();
                    return callback(error, results);
                });
            },
            error => {
                callback(error, null);
            }
        );
    }

    public DeletePlan = (id: number, callback, res?: Response) => {
        this.connDb.Connect(
            connection => {

                const query = connection.query(this.deleteQuery, id, (error, results) => {
                    if (!error) {
                        connection.release();
                        if (callback)
                            return callback(error, results);
                    } else {
                        connection.release();
                        if (callback)
                            return callback(error, null);
                    }
                });

            }, 
            error => {
                callback(error, null);
            }
        );
    }
}