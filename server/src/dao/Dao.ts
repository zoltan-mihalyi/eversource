import { UserDao } from './UserDao';
import { Opaque } from '../../../common/util/Opaque';

export type User = Opaque<string, 'User'>;
export type UserName = Opaque<string, 'UserName'>;
export type Password = Opaque<string, 'Password'>;

export interface Dao {
    verifyUser(username: UserName, password: Password): Promise<User | null>;

    getUserDao(user: User): UserDao;
}