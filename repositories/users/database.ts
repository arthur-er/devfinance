import prisma from "../../database";
import Repository from "../types";
import { User } from "./types";

class DatabaseUsersRepository implements Repository<User> {
  public async create(data: Omit<User, "id">): Promise<User> {
    const user = await prisma.user.create({
      data,
      include: { subscriptions: true },
    });
    return user;
  }

  public async all(): Promise<User[]> {
    const users = await prisma.user.findMany({
      include: { subscriptions: true },
    });
    return users;
  }

  public async find(id: number): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { id },
      include: { subscriptions: true },
    });
    return user;
  }

  public async findBy<Key extends keyof User>(
    key: Key,
    value: User[Key]
  ): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { [key]: value },
      include: { subscriptions: true },
    });
    return user;
  }

  public async update(id: number, data: User): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
      include: { subscriptions: true },
    });
    return user;
  }

  public async delete(id: number): Promise<User & { deleted: boolean }> {
    const user = await prisma.user.delete({ where: { id } });
    return { ...user, deleted: true };
  }
}

export default new DatabaseUsersRepository();
