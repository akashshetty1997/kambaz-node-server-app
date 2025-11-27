import UsersDao from "./dao.js";

export default function UserRoutes(app) {
  const dao = UsersDao();

  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  const findAllUsers = async (req, res) => {
    console.log("=== FIND ALL USERS ROUTE HIT ===");
    console.log("Query params:", req.query);

    try {
      const { role, name } = req.query;
      console.log("Role filter:", role);
      console.log("Name filter:", name);

      if (role) {
        console.log("Searching for users with role:", role);
        const users = await dao.findUsersByRole(role);
        console.log("Found users with role:", users.length);
        console.log("Users:", users);
        res.json(users);
        return;
      }

      if (name) {
        console.log("Searching for users with name:", name);
        const users = await dao.findUsersByPartialName(name);
        console.log("Found users with name:", users.length);
        res.json(users);
        return;
      }

      console.log("Fetching all users");
      const users = await dao.findAllUsers();
      console.log("Found all users:", users.length);
      res.json(users);
    } catch (error) {
      console.error("Error finding users:", error);
      res.status(500).json({ message: error.message });
    }
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);

    // Update session if it's the current
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }

    const updatedUser = await dao.findUserById(userId);
    res.json(updatedUser);
  };

  const signup = async (req, res) => {
    const existingUser = await dao.findUserByUsername(req.body.username);
    console.log("Existing User: ", existingUser);

    if (existingUser) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const signout = (req, res) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
