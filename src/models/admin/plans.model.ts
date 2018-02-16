import { BaseEntity } from '../base.model';
import { IToMysqlDbEntity } from '../iToMysqlDbEntity';

export enum EContractType {
    Monthly = 1,
    Yearly = 2,
    Aquisition = 3
}

export class PlansEntity extends BaseEntity {
    public id: number = 0;
    public name: string = "";
    public description: string = "";
    public contractType: EContractType = EContractType.Monthly;
    public cost: number = 0;

    public static GetInstance(): PlansEntity {
        const instance: PlansEntity = new PlansEntity();

        instance.contractType = EContractType.Monthly;
        instance.id = 0;
        instance.name = "";
        instance.cost = 0;
        instance.description = "";

        return instance;
    }
    
    toMysqlDbEntity(isNew: boolean) {
        if (isNew) {
            return {
                NAME: this.name,
                DESCRIPTION: this.description,
                CONTRACT_TYPE: this.contractType,
                COST: this.cost
            }
        } else {
            return {
                NAME: this.name,
                DESCRIPTION: this.description,
                CONTRACT_TYPE: this.contractType,
                COST: this.cost
            }
        }
    }
    fromMySqlDbEntity(dbentity: any) {
        this.id = dbentity.ID;
        this.name = dbentity.NAME;
        this.description = dbentity.DESCRIPTION;
        this.contractType = dbentity.CONTRACT_TYPE;
        this.cost = dbentity.COST;
    }
    
}