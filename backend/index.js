import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://abdullah:abdullah123@cluster0.ozpkr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("db connect"))
  .catch((err) => console.log("error", +err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "user already exist" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully registered, Please login now" });
        }
      });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login successful", user: user });
      } else {
        res.send({ message: "password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});

const port = process.env.PORT || 9002;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
