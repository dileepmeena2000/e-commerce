import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js"

// dot env config
dotenv.config();

//database connection
connectDB();

//port
const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, () => {

  console.log(`Server is running on https://velvety-chebakia-09e19a.netlify.app:${PORT}`);

  console.log(
    `Server Running On PORT ${process.env.PORT} on ${process.env.NODE_ENV} Mode`
      .bgMagenta.white
  );
});
