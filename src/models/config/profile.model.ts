import { ScreenEntity } from './screen.model';
import { BaseEntity } from '../base.model';

export class ProfileEntity extends BaseEntity {

    public Id: number = 0;
    public Name: string = "";
    public Description: string = "";
    public ScreenAccess: Array<ScreenEntity>;

    toMysqlDbEntity(isNew: boolean) {
        return {
            NAME: this.Name,
            DESCRIPTION: this.Description
        }
    }
    fromMySqlDbEntity(dbentity: any) {
        this.Id = dbentity.ID;
        this.Name = dbentity.NAME;
        this.Description = dbentity.DESCRIPTION;
    }
}