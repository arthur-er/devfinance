import { Router } from "express";
import { SubscriptionsRepository, UsersRepository } from "./repositories";
import { celebrate, Joi, Segments } from "celebrate";
import jwt, { JwtPayload } from "jsonwebtoken";
const routes = Router();

const userValidationSchema = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email(),
    password: Joi.string().min(8),
  },
});

const subscriptionValidationSchema = celebrate({
  [Segments.BODY]: {
    name: Joi.string().min(2),
  },
});

routes.post("/users", userValidationSchema, async (request, response) => {
  const userData = request.body;
  const user = await UsersRepository.create(userData);
  return response.json(user);
});

routes.get("/users", async (request, response) => {
  const users = await UsersRepository.all();
  return response.json(users);
});

routes.get("/users/:id", async (request, response) => {
  const id = request.params.id;
  const idAsNumber = Number(id);
  const user = await UsersRepository.find(idAsNumber);
  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }
  return response.json(user);
});

routes.put("/users/:id", userValidationSchema, async (request, response) => {
  const userData = request.body;
  const id = request.params.id;
  const idAsNumber = Number(id);
  const user = await UsersRepository.update(idAsNumber, userData);
  return response.json(user);
});

routes.delete("/users/:id", async (request, response) => {
  const id = request.params.id;
  const idAsNumber = Number(id);
  const deleted = await UsersRepository.delete(idAsNumber);
  return response.json(deleted);
});

routes.post(
  "/users/:id/subscriptions",
  subscriptionValidationSchema,
  async (request, response) => {
    const subscriptionData = request.body;
    const userId = request.params.id;
    const userIdAsNumber = Number(userId);
    const subscription = await SubscriptionsRepository.create({
      ...subscriptionData,
      userId: userIdAsNumber,
    });
    return response.json(subscription);
  }
);

routes.get("/users/:id/subscriptions", async (request, response) => {
  const userId = request.params.id;
  const userIdAsNumber = Number(userId);
  const subscriptions = await SubscriptionsRepository.findByUser(
    userIdAsNumber
  );
  return response.json(subscriptions);
});

routes.get("/subscriptions/:id", async (request, response) => {
  const id = request.params.id;
  const idAsNumber = Number(id);
  const subscription = await SubscriptionsRepository.find(idAsNumber);
  if (!subscription) {
    return response.status(404).json({ error: "Subscription not found" });
  }
  return response.json(subscription);
});

routes.put(
  "/subscriptions/:id",
  subscriptionValidationSchema,
  async (request, response) => {
    const subscriptionData = request.body;
    const id = request.params.id;
    const idAsNumber = Number(id);
    const subscription = await SubscriptionsRepository.update(
      idAsNumber,
      subscriptionData
    );
    return response.json(subscription);
  }
);

routes.delete("/subscriptions/:id", async (request, response) => {
  const id = request.params.id;
  const idAsNumber = Number(id);
  const deleted = await SubscriptionsRepository.delete(idAsNumber);
  return response.json(deleted);
});

routes.post("/login", userValidationSchema, async (request, response) => {
  const user = await UsersRepository.findBy("email", request.body.email);
  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }
  if (user.password !== request.body.password) {
    return response.status(403).json({ error: "Invalid password" });
  }
  const token = jwt.sign({ id: user.id }, "JONAS");
  return response.json({ token });
});

routes.get("/me", async (request, response) => {
  const hasAuthorization = request.headers.authorization !== undefined;
  if (!hasAuthorization) {
    return response.status(403).json({ error: "Token not provided" });
  }
  const [, token] = request.headers.authorization!.split(" ");
  if (!token) {
    return response.status(403).json({ error: "Token not provided" });
  }
  try {
    const { id } = jwt.verify(token, "JONAS") as JwtPayload;
    const user = await UsersRepository.find(id);
    return response.json(user);
  } catch (error) {
    return response.status(403).json({ error: "Invalid token" });
  }
});

export { routes };
