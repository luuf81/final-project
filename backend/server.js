import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import moment from "moment";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyhabits";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//activity session model

const ExerciseSessionSchema = mongoose.Schema(
  {
    name: String,
    sessionDate: {
       type: Date,
       default: () => new Date(),
     },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

const ExerciseSession = mongoose.model(
  "ExerciseSession",
  ExerciseSessionSchema
);

//activity type model

const ActivityType = mongoose.model("ActivityType", {
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  primaryMuscle: {
    type: String,
    required: false,
  },
  secondaryMuscle: {
    type: String,
    required: false,
  },
});

//activity model

const ActivitySchema = new mongoose.Schema(
  {
    activityDate: {
         type: Date,
         default: () => new Date(),
       },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActivityType",
    },
    ExerciseSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExerciseSession",
    },
    sets: Number,
    reps: Number,
    weight: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", ActivitySchema);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
    unique: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = bcrypt.genSaltSync();
  console.log(`PRE- password before hash: ${user.password}`);
  user.password = bcrypt.hashSync(user.password, salt);
  console.log(`PRE- password after  hash: ${user.password}`);

  // Continue with the save
  next();
});

const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.header("Authorization");
    const user = await User.findOne({ accessToken });
    if (!user) {
      throw "User not found";
    }
    req.user = user;
    next();
  } catch (err) {
    const errorMessage = "Please try logging in again";
    console.log(errorMessage);
    res.status(401).json({ error: errorMessage });
  }
};

const User = mongoose.model("User", userSchema);

//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

//Endpoints

//Post new activity types

app.post("/activitytypes", async (req, res) => {
  try {
    const { name, category, primaryMuscle, secondaryMuscle } = req.body;
    const activityType = await new ActivityType({
      name,
      category,
      primaryMuscle,
      secondaryMuscle,
    }).save();
    res.status(200).json({ name: name });
  } catch (err) {
    res.status(400).json({ message: "Could not create user", errors: err });
  }
});

//Post new activities

app.post('/activities', authenticateUser)
app.post("/activities", async (req, res) => {
  try {
    const { activityDate, type, sets, reps, weight } = req.body;
    const user = req.user
    const typeId = await ActivityType.findOne({ name: type });
    const activity = await Activity.create({
      activityDate,
      type: typeId,
      sets,
      reps,
      weight,
      user
    });
    //const activityDate = moment(activity.createdAt).startOf("day");
    console.log(activityDate);
    const session = await ExerciseSession.findOne({
      sessionDate: { $eq: activityDate },
    });
    //{$gte: new Date(activity.createdAt)}
    // const session = await ExerciseSession.findOne({
    //   _id: "600699b577b8415342b75e5b",
    // });
    console.log(session);
    if (session) {
      await session.activities.push(activity);
      session.user = user
      session.save();
    } else await ExerciseSession.create({ sessionDate: activityDate, activities: activity, user: user });
    res.status(200).json({ type: type });
  } catch (err) {
    res.status(400).json({ message: "Could not create user", errors: err });
  }
});

// Sign-up
app.post("/users", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await new User({
      name,
      password,
    }).save();
    res.status(200).json({ userId: user._id, accessToken: user.accessToken });
  } catch (err) {
    res.status(400).json({ message: "Could not create user", errors: err });
  }
});

// Login
app.post("/sessions", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({ userId: user._id, accessToken: user.accessToken });
    } else {
      throw "User not found";
    }
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
});

app.get("/secret", authenticateUser);
app.get("/secret", async (req, res) => {
  console.log(`User from authenticateUser: ${req.user}`);
  const secretMessage = `We can modify this secret message for ${req.user.name}`;
  res.status(200).json({ secretMessage });
});

// Get user specific information
app.get("/users/:id/profile", authenticateUser);
app.get("/users/:id/profile", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  const publicProfileMessage = `This is a public profile message for ${user.name}`;
  const privateProfileMessage = `This is a private profile message for ${user.name}`;

  console.log(`Authenticated req.user._id: '${req.user._id.$oid}'`);
  console.log(`Requested     user._id    : '${user._id}'`);
  console.log(`Equal   : ${req.user_id == user._id}`);

  // Decide private or public here
  if (req.user._id.$oid === user._id.$oid) {
    // Private
    res.status(200).json({ profileMessage: privateProfileMessage });
  } else {
    // Public information or Forbidden (403) because the users don't match
    res.status(200).json({ profileMessage: publicProfileMessage });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
