const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the user collection
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // needed this for user/connections API 
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{value} is incorrect status type`,
      }, //can read more about this in mongoose
    },
  },
  { timestamps: true }
);

//conpound index - making query fast
//connectionRequest.find({fromUserId :23u48923728973092, toUserId : 3209u49032403})
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); //1 means ascending order

//using pre - to solve the problem that sender can't send reuest to himself
// before saving this function will be called
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if the from userId IS SAME AS toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
