import { BaseEntity } from '../base.model';

export class CidEntity extends BaseEntity {
    public idCid: string = "";
    public description: string = "";

    public static GetInstance(): CidEntity {
        const instance: CidEntity = new CidEntity();

        return instance;
    }

    toMysqlDbEntity(isNew) {
        return {
            IDCID: this.idCid,
            DESCRIPTION: this.description
        }
    }

    fromMySqlDbEntity(dbEntity) {
        this.idCid = dbEntity.IDCID;
        this.description = dbEntity.DESCRIPTION;
    }
}