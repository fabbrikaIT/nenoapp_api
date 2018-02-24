import { BaseDAO } from '../baseDAO';
import { CrudDAO } from '../crudDAO';
import { ScreenEntity } from '../../models/config/screen.model';
import { ProfileEntity } from '../../models/config/profile.model';

export class ConfigDAO extends BaseDAO {
    public Screens: CrudDAO<ScreenEntity> = new CrudDAO<ScreenEntity>(process.env.DB_NENO_GLOBAL || '', "SCREENS", ["ID"], ScreenEntity);
    public Profile: CrudDAO<ProfileEntity> = new CrudDAO<ProfileEntity>(process.env.DB_NENO_GLOBAL || '', "PROFILES", ["ID"], ProfileEntity);

    //Queries
    
    constructor() {
        super();
    }
}