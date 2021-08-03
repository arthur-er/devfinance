import { User } from "./types";
import Repository from "../types";

const USERS: Map<number, User> = new Map();

class UsersRepository implements Repository<User> {
  public async all() {
    return Array.from(USERS.values());
  }

  public async find(id: number) {
    return USERS.get(id);
  }

  public async findBy(key, value) {
    //throw new Error("Unable to find by in memory repository");
    return USERS.get(1);
  }

  public async create(user: User) {
    USERS.set(user.id, user);
    return USERS.get(user.id);
  }

  // Recebe como parametros
  // - Email do usuario
  // - Campos atualizados do usuario
  public async update(id: number, user: Partial<User>) {
    // Pega o usuario do banco de dados (sem atualizar)
    const currentUser = USERS.get(id);

    // Atualiza o usuario
    const updatedUser = Object.assign(currentUser, user);

    USERS.set(id, updatedUser);
    return USERS.get(id);
  }

  public async delete(id: number) {
    const user = USERS.get(id);
    const deleted = USERS.delete(id);
    return { ...user, deleted };
  }
}

export default new UsersRepository();
