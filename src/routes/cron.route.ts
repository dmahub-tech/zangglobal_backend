import { Router, Request, Response } from 'express';
const cronRouter = Router();

cronRouter.get("/", (req: Request, res: Response) => {
  console.log("wake up server");
  res.send("Server is awake and job ran successfully.");
});

export default cronRouter;
