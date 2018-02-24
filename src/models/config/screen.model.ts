import { BaseEntity } from '../base.model';

export class ScreenEntity extends BaseEntity {
    public id: number = 0;
    public parentId: number = undefined;
    public code: string = "";
    public name: string = "";
    public path: string = "";
    public icon: string = "";
    public children: Array<ScreenEntity>;

    public static GetInstance(): ScreenEntity {
        const instance: ScreenEntity = new ScreenEntity();
        instance.children = new Array<ScreenEntity>();

        return instance;
    }

    toMysqlDbEntity(isNew: boolean) {
        if (isNew) {
            return {
                CODE: this.code,
                NAME: this.name,
                PATH: this.path,
                ICON: this.icon,
                PARENT_ID: this.parentId
            }
        } else {
            return {
                NAME: this.name,
                PATH: this.path,
                ICON: this.icon,
                PARENT_ID: this.parentId
            }
        }
    }
    fromMySqlDbEntity(dbentity: any) {
        this.id = dbentity.ID;
        this.name = dbentity.NAME;
        this.parentId = dbentity.PARENT_ID;
        this.code = dbentity.CODE;
        this.icon = dbentity.ICON;
        this.path = dbentity.PATH;
    }
}