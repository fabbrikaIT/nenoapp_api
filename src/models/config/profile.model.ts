import { ScreenEntity } from './screen.model';
import { BaseEntity } from '../base.model';

export class ProfileEntity extends BaseEntity {

    public id: number = 0;
    public name: string = "";
    public description: string = "";
    public isAdmin: boolean = false;
    public screenAccess: Array<ScreenEntity>;

    public static GetInstance(): ProfileEntity {
        const instance: ProfileEntity = new ProfileEntity();
        instance.screenAccess = new Array<ScreenEntity>();

        return instance;
    }

    toMysqlDbEntity(isNew: boolean) {
        return {
            NAME: this.name,
            DESCRIPTION: this.description,
            IS_ADMIN: this.isAdmin ? 1 : 0
        }
    }
    fromMySqlDbEntity(dbentity: any) {
        this.id = dbentity.ID;
        this.name = dbentity.NAME;
        this.description = dbentity.DESCRIPTION;
        this.isAdmin = dbentity.IS_ADMIN;
    }
}