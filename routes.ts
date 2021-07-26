import { Router } from "express";
import UsersRepository from "./repositories/users";

const routes = Router();

// Listar todos usuários
routes.get("/users", (request, response) => {
  const users = UsersRepository.all();
  return response.json(users);
});

// Listar um usuario
routes.get("/users/:id", (request, response) => {
  const id = request.params.id;
  const user = UsersRepository.find(id);
  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }
  return response.json(user);
});

// Criar um usuário
routes.post("/users", (request, response) => {
  const userData = request.body;
  const user = UsersRepository.create(userData);
  return response.json(user);
});

// Atualizar um usuário
routes.put("/users/:id", (request, response) => {
  const userData = request.body;
  console.log(userData);
  const id = request.params.id;
  const user = UsersRepository.update(id, userData);
  return response.json(user);
});

// Deletar um usuário
routes.delete("/users/:id", (request, response) => {
  const id = request.params.id;
  const deleted = UsersRepository.delete(id);
  return response.json(deleted);
});

export { routes };
