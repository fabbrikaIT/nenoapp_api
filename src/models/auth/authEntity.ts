import { BaseEntity } from '../base.model';
import { UserEntity } from './user.model';

export class AuthEntity extends BaseEntity {
    public loginAccept: boolean;
    public userName: string;
    public authenticationToken: string;
    public user: UserEntity;
}