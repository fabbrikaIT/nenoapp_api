import { SchoolConfigurationEntity } from './schoolConfig.model';
import { BaseEntity } from '../base.model';
import { IToMysqlDbEntity } from '../iToMysqlDbEntity';
import { PlansEntity } from './plans.model';
import { SchoolManagerEntity } from './schoolManager.model';

export class SchoolEntity extends BaseEntity implements IToMysqlDbEntity {
    public id: number;
    public name: string;
    public cnpj: string;
    public legalName: string;
    public email: string;
    public phone: string;
    public street: string;
    public number: number;
    public complement: string;
    public postcode: number;
    public district: string;
    public city: string;
    public state: string;
    public registerDate: Date;
    public subscriptionPlanId: number;
    public subscriptionPlan: PlansEntity;
    public configurations: SchoolConfigurationEntity;
    public manager: SchoolManagerEntity;

    public static GetInstance(): SchoolEntity {
        const instance: SchoolEntity = new SchoolEntity();
        instance.id = 0;
        instance.name = "";
        instance.email = "";
        instance.phone = "";
        instance.cnpj = "";
        instance.registerDate = new Date();
        instance.subscriptionPlan = PlansEntity.GetInstance();
        instance.configurations = SchoolConfigurationEntity.GetInstance();
        instance.manager = SchoolManagerEntity.GetInstance();

        return instance;
    }

    toMysqlDbEntity(isNew: boolean) {
        if (isNew) {
            return {                
                NAME: this.name,
                EMAIL: this.email,
                CNPJ: this.cnpj,
                LEGAL_NAME: this.legalName,
                PHONE: this.phone,
                STREET: this.street,
                NUMBER: this.number,
                COMPLEMENT: this.complement,
                POSTCODE: this.postcode,
                DISTRICT: this.district,
                CITY: this.city,
                STATE: this.state,
                REGISTER_DATE: this.registerDate,
                SUBSCRIPTION_PLAN: this.subscriptionPlanId
            }
        } else {
            return {
                NAME: this.name,
                EMAIL: this.email,
                CNPJ: this.cnpj,
                LEGAL_NAME: this.legalName,
                PHONE: this.phone,
                STREET: this.street,
                NUMBER: this.number,
                COMPLEMENT: this.complement,
                POSTCODE: this.postcode,
                DISTRICT: this.district,
                CITY: this.city,
                STATE: this.state,
                REGISTER_DATE: this.registerDate,
                SUBSCRIPTION_PLAN: this.subscriptionPlanId
            }
        }
    }
    fromMySqlDbEntity(dbentity: any) {
        this.id = dbentity.ID;
        this.name = dbentity.NAME;
        this.email = dbentity.EMAIL;
        this.phone = dbentity.PHONE;
        this.cnpj = dbentity.CNPJ;
        this.legalName = dbentity.LEGAL_NAME;
        this.street = dbentity.STREET;
        this.number = dbentity.NUMBER;
        this.complement = dbentity.COMPLEMENT;
        this.postcode = dbentity.POSTCODE;
        this.district = dbentity.DISTRICT;
        this.city = dbentity.CITY;
        this.state = dbentity.STATE;
        this.registerDate = dbentity.REGISTER_DATE;
        this.subscriptionPlanId = dbentity.SUBSCRIPTION_PLAN;
    }
    
}