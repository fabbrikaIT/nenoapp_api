import { BaseEntity } from '../base.model';
import { IToMysqlDbEntity } from '../iToMysqlDbEntity';

export class SchoolManagerEntity extends BaseEntity implements IToMysqlDbEntity {
    public schoolId: number;
    public name: string;
    public email: string;
    public cellphone: string;
    public document: number;
    public birthdate: Date;

    public static GetInstance(): SchoolManagerEntity {
        const instance: SchoolManagerEntity = new SchoolManagerEntity();
        instance.schoolId = 0;
        instance.name = "";
        instance.email = "";
        instance.cellphone = "";
        instance.document = 0;        

        return instance;
    }

    toMysqlDbEntity(isNew: boolean) {
        if (isNew) {
            return {
                SCHOOL_ID: this.schoolId,
                NAME: this.name,
                E_MAIL: this.email,
                CELLPHONE: this.cellphone,
                DOCUMENT: this.document,
                BIRTHDATE: this.birthdate
            }
        } else {
            return {
                NAME: this.name,
                E_MAIL: this.email,
                CELLPHONE: this.cellphone,
                DOCUMENT: this.document,
                BIRTHDATE: this.birthdate
            }
        }
    }
    fromMySqlDbEntity(dbentity: any) {
        this.schoolId = dbentity.SCHOOL_ID;
        this.name = dbentity.MANAGERNAME;
        this.email = dbentity.E_MAIL;
        this.cellphone = dbentity.CELLPHONE;
        this.document = dbentity.DOCUMENT;
        this.birthdate = dbentity.BIRTHDATE;
    }
    
}