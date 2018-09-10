import { Dao, Password, User, UserName } from '../dao/Dao';
import { UserDao } from '../dao/UserDao';
import { FakeUserDao } from './FakeUserDao';

export class FakeDao implements Dao {
    getUserDao(user: User): UserDao {
        return new FakeUserDao();
    }

    async verifyUser(username: UserName, password: Password): Promise<User | null> {
        return 'user' as User;
    }
}