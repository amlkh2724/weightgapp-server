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
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        startingWeight: { type: Number, required: true },
        endingWeight: { type: Number },
        caloriesConsumed: { type: Number, default: 0 },
      },
    ],
    lastWeightAddedDate: [{}],

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

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const App = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [weight, setWeight] = useState("");
//   const [food, setFood] = useState("");
//   const [data, setData] = useState([]);

//   const userId = "your-user-id";

//   const handleModal = () => setShowModal(!showModal);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     axios.post(`/users/${userId}/data`, { weight, food }).then(() => {
//       setWeight("");
//       setFood("");
//       setShowModal(false);
//       fetchData();
//     });
//   };

//   const fetchData = () => {
//     axios.get(`/users/${userId}/data`).then((response) => {
//       setData(response.data);
//     });
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div>
//       <button onClick={handleModal}>Enter Weight and Food</button>
//       <div>
//         {data.map((item) => (
//           <div key={item.date}>
//             <div>Date: {item.date}</div>
//             <div>Weight: {item.weight}</div>
//             <div>Calories: {item.calories}</div>
//           </div>
//         ))}
//       </div>
//       {showModal && (
//         <div>
//           <form onSubmit={handleSubmit}>
//             <div>
//               <label>Weight:</label>
//               <input
//                 type="text"
//                 value={weight}
//                 onChange={(event) => setWeight(event.target.value)}
//               />
//             </div>
//             <div>
//               <label>Food:</label>
//               <input
//                 type="text"
//                 value={food}
//                 onChange={(event) => setFood(event.target.value)}
//               />
//             </div>
//             <button type="submit">Submit</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

// do for me in front end a log in page the have username and password with connection in server and register that have username password email gender whieght height
