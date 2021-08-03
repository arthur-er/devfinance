import prisma from "../../database";
import Repository from "../types";
import { Subscription } from "./types";

class DatabaseSubscriptionsRepository implements Repository<Subscription> {
  public async create(
    data: Omit<Subscription, "id"> & { userId: number }
  ): Promise<Subscription> {
    const subscription = await prisma.subscription.create({ data });
    return subscription;
  }

  public async all(): Promise<Subscription[]> {
    const subscriptions = await prisma.subscription.findMany();
    return subscriptions;
  }

  public async find(id: number): Promise<Subscription | null> {
    const subscription = await prisma.subscription.findFirst({ where: { id } });
    return subscription;
  }

  public async findByUser(userId: number) {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
    });
    return subscriptions;
  }

  public async findBy<Key extends keyof Subscription>(
    key: Key,
    value: Subscription[Key]
  ): Promise<Subscription | null> {
    const subscription = await prisma.subscription.findFirst({
      where: { [key]: value },
    });
    return subscription;
  }

  public async update(id: number, data: Subscription): Promise<Subscription> {
    const subscription = await prisma.subscription.update({
      where: { id },
      data,
    });
    return subscription;
  }

  public async delete(
    id: number
  ): Promise<Subscription & { deleted: boolean }> {
    const subscription = await prisma.subscription.delete({ where: { id } });
    return { ...subscription, deleted: true };
  }
}

export default new DatabaseSubscriptionsRepository();
