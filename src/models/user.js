//learn from - https://mongoosejs.com/docs/guide.html

const mongoose = require("mongoose");

//user schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true, // extra spaces will be removed and same id with space can't be considered unique
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      //custom validatin function
      //by default - it will work when we create new use
      //In update api i will have to use runValidator: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAYFBMVEX///8AAADl5eVsbGzq6uri4uI4ODj7+/tMTEzw8PDz8/MXFxeenp5/f3/S0tJjY2ONjY0jIyN5eXnFxcXY2NiVlZWqqqooKCi8vLxAQEAuLi4ODg6kpKSzs7NVVVVycnIcNWV3AAADdElEQVR4nO3biZaiMBAFUAMBBEVAwKWF4f//crDRGVeStJCq9Hn3C/JOkiIbiwUAAAAAAAAAAAAAAAAAAAAAAMwllp4nY+pWTCAomzrtfL9L66YMqFvzifiQZ6H4J8zyQ0Ldph+KWv8mySWP30bU7fqJKts/RjnbZxV1y8ztVq+inK121G0z5b+LcuZTt87Mn7EsQmQOTZyoG88iROdMmig/qcKcclfStC/L2L19S91KPdVSnUWI5Ya6nTqSXCeLELkLi4FNoRemcKBrdDvGia6pNGb/YM9+XRPtdLMIseNenuPRdcw9n/uGzdOc/meFR91ahY1+FiG417PWJAzzVUC0Ngmz5l0BIu2vzBnz1Wa0NQmzZR5GuZO5xXxX86uG2aIxCdNQt1bhYBLmQN1ahV/10ZRPh5jvhZK6tQpJqh8mZb+hMZg03KfMYhEcdbMc+d9w6K/OmK/Mvm00u+bIvZZ9q/XC1NTt1BJkOlky/jPmW6nxrQlL6lbqat5eNF2tuC/LbiinjRsT5kKRxqks/UgbOdjcOzTGBoe3NS3jv4x5EjQvi1rYOFKT70VV/fUY5WtdObCIeSmSh7sDju4gXY1yEbR12nVp3To5vAAAAGxKZNCT7E/8FGRZZ2GxuijCrC65n8i+Jts3e4CsdStQErSjz7SWO8+VQSdLjYvNrRMDzns3vJ6HG/cHGrFulCEO68czpdFlc79b43sUGNcG12aDsGY6dUqDEfZfxrJzdsbdcukcfr8GmL1muMftsaY0eAD4zGc1cTzFjwwqfxh9cgKtN+ZjlmzOoeTHWfo0TEaa/FFJfpSxSGPyJmMMh/cakeblslpNfw7dGjxkHleQP6bdTDD5r6h/qYknmjCDlHZLYPAbgw7SZVql/YRJz5HwL5TpKtkVYUXbKH9hNHUiqwHRpLN/kFJ1TTV9FiGoZo3Ru39dW5osco4sQtAsOCcvZQOaR0KTLcruFRRZZpn+ZxQlYIa6PEgJwjw98pnKl/0s1UxTpp809sfZevKlzNVpbT3MJKcYr2W2s0QT7jAfLW2vz6beydyyvqspZytmfTmzfcvRzFbM+nJm+6nwBzcYarnlMLMs/69sbwMMb2LNdJbDfHS5pOLbrc3JjN/M/qtp9ww9qf0Z1ZYvBKQ3IxZXNQAAAAAAAAAAAAAAAAAAAAAADvkLUu4sfgrQtDAAAAAASUVORK5CYII=",
    },
    about: {
      type: String,
      default: "This is a default about of user",
    },
    skills: {
      type: [String],
      // trim: true,
    },

  },
      //timestamps
  {
    timestamps: true,
  }
);

//mongoose model
module.exports = mongoose.model("User", userSchema); // User will always start with capital, since we will create new instances of it as we do with class
