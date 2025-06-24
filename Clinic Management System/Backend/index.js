import { app } from "./app.js";
import { connectDB } from "./database/db.js";

connectDB().then(() => {
  app.on("Error", () => {
    console.log(`error while connecting to the db through the server`);
  });
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
  });
});
