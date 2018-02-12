import { BaseEntity } from '../base.model';
import { IToMysqlDbEntity } from '../iToMysqlDbEntity';

export class SchoolConfigurationEntity extends BaseEntity implements IToMysqlDbEntity {
    public schoolId: number;
    public dbName: string;
    public apiPath: string;
    public logo: string;
    public portalUrl: string;

    public static GetInstance(): SchoolConfigurationEntity {
        const instance: SchoolConfigurationEntity = new SchoolConfigurationEntity();
        instance.schoolId = 0;
        instance.dbName = "";
        instance.apiPath = "";
        instance.logo = "";
        instance.portalUrl = "";

        return instance;
    }

    toMysqlDbEntity(isNew: boolean) {
        if (isNew) {
            return {
                SCHOOL_ID: this.schoolId,
                DBNAME: this.dbName,
                APIPATH: this.apiPath,
                LOGO: this.logo,
                PORTAL_URL: this.portalUrl
            }
        } else {
            return {
                DBNAME: this.dbName,
                APIPATH: this.apiPath,
                LOGO: this.logo,
                PORTAL_URL: this.portalUrl
            }
        }
    }
    fromMySqlDbEntity(dbentity: any) {
        this.schoolId = dbentity.SCHOOL_ID;
        this.dbName = dbentity.DBNAME;
        this.apiPath = dbentity.APIPATH;
        this.logo = dbentity.LOGO;
        this.portalUrl = dbentity.PORTAL_URL;
    }
    
}