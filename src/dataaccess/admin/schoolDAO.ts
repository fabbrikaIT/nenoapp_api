import { Response } from 'express';

import { SchoolEntity } from './../../models/admin/school.model';
import { BaseDAO } from './../baseDAO';

export class SchoolDAO extends BaseDAO {
    // SQL Queries
    private listQuery: string = "SELECT * FROM SCHOOL";
    private getQuery: string = `SELECT S.*, SM.*, SC.* , P.*
                                FROM SCHOOL S, SCHOOL_MANAGER SM, SCHOOL_CONFIGURATIONS SC, PLANS P
                                WHERE S.ID = SM.SCHOOL_ID
                                AND S.ID = SC.SCHOOL_ID
                                AND S.SUBSCRIPTION_PLAN = P.ID
                                AND S.ID = ?`;
    private createSchoolQuery: string = "INSERT INTO SCHOOL SET ?";
    private createSchoolManagerQuery: string = "INSERT INTO SCHOOL_MANAGER SET ?";
    private createSchoolConfigQuery: string = "INSERT INTO SCHOOL_CONFIGURATIONS SET ?";
    private updateSchoolQuery: string = "UPDATE SCHOOL SET ? WHERE ID = ?";
    private updateSchoolConfigQuery: string = "UPDATE SCHOOL_CONFIGURATIONS SET ? WHERE SCHOOL_ID = ?";
    private updateSchoolManagerQuery: string = "UPDATE SCHOOL_MANAGER SET ? WHERE SCHOOL_ID = ?";
    private deleteSchoolQuery: string = "DELETE FROM SCHOOL WHERE ID = ?";

    /**
     * Listagem de planos
     */
    public ListSchools = (res: Response, callback) => {
        this.connDb.Connect(
            connection => {
                connection.query(this.listQuery, (error, results) => {
                    if (!error) {
                        let list: Array<SchoolEntity>;
                        list = results.map(item => {
                            let planItem = new SchoolEntity();
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

    public GetSchool = (id: number, res: Response, callback) => { 
        this.connDb.Connect(
            connection => {

                const query = connection.query(this.getQuery, id, (error, results) => {
                    if (!error && results.length > 0) {
                       
                        let planItem = SchoolEntity.GetInstance();
                        planItem.fromMySqlDbEntity(results[0]);
                        planItem.manager.fromMySqlDbEntity(results[0]);
                        planItem.subscriptionPlan.fromMySqlDbEntity(results[0]);
                        planItem.configurations.fromMySqlDbEntity(results[0]);
                        
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

    /**
     * Insert a new school in db
     */
    public CreateSchool = (school: SchoolEntity, callback) => {
        this.connDb.Connect(
            connection => { 
                const dbEntity = school.toMysqlDbEntity(true);
                
                // Criando nova escola
                const query = connection.query(this.createSchoolQuery, dbEntity, (error, results) => { 
                    if (!error) {
                        const schoolId: number = results.insertId as number;

                        const manager = school.manager.toMysqlDbEntity(true);
                        manager.SCHOOL_ID = results.insertId;

                        connection.query(this.createSchoolManagerQuery, manager, (err, res) => {
                            if (!err) {
                                const config = school.configurations.toMysqlDbEntity(true);
                                config.SCHOOL_ID = results.insertId;

                                connection.query(this.createSchoolConfigQuery, config, (e, ret) => {
                                    if (e) {
                                        //excluir excola
                                        this.DeleteSchool(schoolId, null);
                                    }

                                    connection.release();
                                    return callback(error, results);
                                });
                            } else {
                                //Excluir escola
                                this.DeleteSchool(schoolId, null);
                                
                                connection.release();
                                return callback(error, results);
                            }
                        });
                    } else {
                        connection.release();
                        return callback(error, results);
                    } 
                });
            },
            error => {
                callback(error, null);
            }
        );
    }

    public UpdateSchool = (school: SchoolEntity, callback)  => { 
        this.connDb.Connect(
            connection => { 
                const dbEntity = school.toMysqlDbEntity(false);

                connection.query(this.updateSchoolQuery, [dbEntity, school.id], (error, result) => {
                    if (!error) {
                        const manager = school.manager.toMysqlDbEntity(false);
                        const config = school.configurations.toMysqlDbEntity(false);

                        connection.query(this.updateSchoolManagerQuery, [manager, school.id], (err, ret) => {
                            if (!err) {
                                connection.query(this.updateSchoolConfigQuery, [config, school.id], (e, r) => {
                                    connection.release();
                                    return callback(e, r);
                                });
                            } else {
                                connection.release();
                                return callback(err, ret);
                            }
                        });
                    } else {
                        connection.release();
                        return callback(error, result);
                    }
                })
        });
    }

    public DeleteSchool = (schoolId: number, callback?) => { 
        this.connDb.Connect(
            connection => { 
            
                connection.query(this.deleteSchoolQuery, schoolId, (error, result) => {
                    connection.release();
                    return callback(error, result);
                })
        });
    }
}