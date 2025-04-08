const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//? secure the password with the bcrypt
userSchema.pre("save", async function () {
  const user = this;
  console.log("actual data ", this);

  if (!user.isModified) {
    return next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, saltRound);
    user.password = hashedPassword;
  } catch (error) {
    return next(error);
  }
});

  userSchema.methods.generateToken = async function () {
    try{
      return jwt.sign(
        { userid: this._id.toString(),
          email:this.email,
          isAdmin: this.isAdmin
        }, 
        process.env.JWT_SECRET, 
        {
        expiresIn: "3year",
      }
    );
    }
    catch(error){
      console.error("Token Error: ",error);
    }

  };

  // comparePassword
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// define the model or the collection name
const User = new mongoose.model("User", userSchema);
// Export the User model
module.exports = User;