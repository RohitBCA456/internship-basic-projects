import { app } from "./app.js";
import { connectDB } from "./database/db.js";

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
