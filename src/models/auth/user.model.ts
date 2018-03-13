import { ProfileEntity } from './../config/profile.model';
import { BaseEntity } from '../base.model';

export class UserEntity extends BaseEntity {
    public code: number = 0;
    public schoolId: number = 0;
    public name: string = "";
    public email: string = "";
    public password: string = "";
    public profile: ProfileEntity;

    public static GetInstance(): UserEntity {
        const instance: UserEntity = new UserEntity();
        instance.profile = ProfileEntity.GetInstance();

        return instance;
    }
}