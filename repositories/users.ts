import Repository from ".";

interface User {
  email: string;
  password: string;
}

const USERS: Map<string, User> = new Map();

class UsersRepository implements Repository<User> {
  public all() {
    return Array.from(USERS.values());
  }

  public find(id: string) {
    return USERS.get(id);
  }

  public create(user: User) {
    USERS.set(user.email, user);
    return USERS.has(user.email);
  }

  // Recebe como parametros
  // - Email do usuario
  // - Campos atualizados do usuario
  public update(id: string, user: Partial<User>) {
    // Pega o usuario do banco de dados (sem atualizar)
    const currentUser = USERS.get(id);

    // Atualiza o usuario
    const updatedUser = Object.assign(currentUser, user);

    USERS.set(id, updatedUser);
    return USERS.has(id);
  }

  public delete(id: string) {
    return USERS.delete(id);
  }
}

export default new UsersRepository();
