import express from "express"
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import moment from "moment";
import { type } from "os";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyhabits";
console.log(mongoUrl)
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();
const http = require('http').createServer(app);
// const io = require('socket.io')(http);
const io = require("socket.io")(http, {
  cors: {
    //origin: "https://happyhabits.herokuapp.com/",
    origin: ["https://happyhabits.netlify.app", "https://happyhabits-pwa.netlify.app", "http://localhost:3000"],
    //origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
io.on('connection', (socket) => {
   console.log('a user connected');
   socket.on('user', async (accessToken) => {
    const user = await User.findOne({ accessToken });
    console.log('user: ' + user.name)
    io.emit('user', user);
   })
 });
//io.set('origins', '*:*');

// http.listen(3001, () => {
//   console.log('listening on *:3001');
// });



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
  followedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
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


// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

//Endpoints

app.get('/', (req, res) => {

  res.send('Hello world')
})

//get new activity types

app.get("/activitytypes", authenticateUser);
app.get("/activitytypes", async (req, res) => {
  try {
    const exercises = await ActivityType.find( {category: 'gym'} )
    res.json(exercises);
  } catch (err) {
    res.status(400).json({ error: "could not fetch exercises" });
  }
});

//Follow user
app.post("/followuser", authenticateUser);
app.post("/followuser", async (req, res) => {
  try {
    //console.log(req.user)
    const currentUser = await User.findOne({name: req.user.name})
    console.log(currentUser)
    const followedUser = await User.findOne({name: req.body.name})
    console.log(followedUser)
    await currentUser.followedUsers.push(followedUser)
    currentUser.save()
    const allUsers = await User.find().populate("followedUsers")
    res.status(200).json(currentUser);
  } catch (err) {
    res.status(400).json({ message: "Could follow user", errors: err });
  }
});

app.get("/followuser", authenticateUser);
app.get("/followuser", async (req, res) => {
  try {
    console.log(req.user)
    const currentUser = await User.findOne({name: req.user.name})
    res.status(200).json(currentUser);
  } catch (err) {
    res.status(400).json({ message: "Could follow user", errors: err });
  }
});

//Post new activity types
app.post("/activitytypes", authenticateUser);
app.post("/activitytypes", async (req, res) => {
  try {
    const { name, category, primaryMuscle, secondaryMuscle } = req.body;
    const activityType = await new ActivityType({
      name,
      category,
      primaryMuscle,
      secondaryMuscle,
    }).save();
    const exercises = await ActivityType.find( {category: 'gym'} )
    res.json({ activityType, exercises});
  } catch (err) {
    res.status(400).json({ message: "Could not create user", errors: err });
  }
});

//get workouts
app.get("/workouts", authenticateUser);
app.get("/workouts", async (req, res) => {
  try {
    const workouts = await ExerciseSession.find() //{user: req.user}
      .populate({
        path: "activities",
        populate: {
          path: "type",
          model: "ActivityType",
        },
      })
      .populate({
        path: "user",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .sort("-sessionDate");
    //console.log(workouts);
    res.json(workouts);
  } catch (err) {
    res.status(400).json({ error: "could not fetch workouts" });
  }
});

//get activities

app.get("/activities", authenticateUser);
app.get("/activities", async (req, res) => {
  try {
    const activities = await Activity.find() //{user: req.user}
      .populate("type")
      .populate("user")
      .sort("-activityDate");
    //activities.map(item => console.log(item.activityDate))
    res.json(activities);
  } catch (err) {
    res.status(400).json({ error: "could not fetch activities" });
  }
});

//post new activities

app.post("/activities", authenticateUser);
app.post("/activities", async (req, res) => {
  try {
    const { activityDate, type, sets, reps, weight } = req.body;
    const user = req.user;
    const typeId = await ActivityType.findOne({ name: type });
    const activity = await Activity.create({
      activityDate,
      type: typeId,
      sets,
      reps,
      weight,
      user,
    });
    //const activityDate = moment(activity.createdAt).startOf("day");
    console.log(activityDate);
    const session = await ExerciseSession.findOne({
      sessionDate: { $eq: activityDate },
      user,
    });
    console.log(session);
    if (session) {
      await session.activities.push(activity);
      session.user = user;
      session.save();
    } else
      await ExerciseSession.create({
        sessionDate: activityDate,
        activities: activity,
        user: user,
      });
    const activities = await Activity.find() //{user: req.user}
      .populate("type")
      .populate("user")
      .sort("-activityDate");
    const workouts = await ExerciseSession.find() //{user: req.user}
      .populate({
        path: "activities",
        populate: {
          path: "type",
          model: "ActivityType",
        },
      })
      .populate("user")
      .sort("-sessionDate");
    console.log(workouts);
    //res.json(workouts);
    //res.json(activities);
    res.status(200).json({ workouts, activities });
    //res.status(200).json(activities);
  } catch (err) {
    res.status(400).json({ message: "Could not create user", errors: err });
  }
});

//get users

app.get("/users", authenticateUser);
app.get("/users", async (req, res) => {
  try {
    console.log(req.query.id)
    let users
    if(req.query.id) users = await User.find({_id: req.query.id})
    else users = await User.find()
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: "could not fetch users" });
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
    res.status(200).json({ userId: user._id, accessToken: user.accessToken , followedUsers: user.followedUsers });
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
      res.status(200).json({ userId: user._id, accessToken: user.accessToken, followedUsers: user.followedUsers });
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
http.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
