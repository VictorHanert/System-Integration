import { Router } from "express";

const router = Router();

let nextId = 4;
const users = [
  { id: 1, name: "Nidos" },
  { id: 2, name: "Bobby Charlton" },
  { id: 3, name: "Minho" },
];

/**
 * @openapi
 * /api/users:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:	
 *         description: Returns all users
 */
router.get("/api/users", (req, res) => {
  res.send({ data: users });
});

/**
 * @openapi
 * /api/users:
 *  post:
 *   description: Create a new user
 *   responses:
 *    200:
 *      description: Returns the created user
 */ 
router.post("/api/users", (req, res) => {
  const newUser = req.body;
  newUser.id = nextId++;
  users.push(newUser);

  res.send({ data: newUser });
});

export default router;
