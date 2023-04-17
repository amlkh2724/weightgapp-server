import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: [true, "Email address already taken"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    gender: { type: String, enum: ["male", "female"] },

    height: { type: Number, required: true },
    
    weight: [{}],

    role: {
      type: String,
      enum: ["user", "publisher"],
      default: "user",
    },
    password: { type: String, required: true },

    weightRecords: [
      {
        date: { type: Date, default: Date.now },
        foodIntake: {
          breakfast: {
            food: { type: String },
            amount: { type: Number, default: 0 },
            calories: { type: Number, default: 0 },
          },
          lunch: {
            food: { type: String },
            amount: { type: Number, default: 0 },
            calories: { type: Number, default: 0 },
          },
          dinner: {
            food: { type: String },
            amount: { type: Number, default: 0 },
            calories: { type: Number, default: 0 },
          },
          snacks: {
            food: { type: String },
            amount: { type: Number, default: 0 },
            calories: { type: Number, default: 0 },
          },
        },
      },
    ],
    weekTracker: [
      {
  
      },
    ],
    weeksHistory:[{
      
    }],
    yourGoal:{type:String}
  },
  {
    toJSON: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};
// Instance method to sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);
