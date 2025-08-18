const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"; // fpr populate
//Get all the pending connection request for loggedin USER
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills"
    );
    //or
    // }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({ message: "Data fetched successfully", data: connectionRequest });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // elon => Manish => accepted
    // Manish => pawan => accepted
    //loggedInUser => Manish
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// /feed?page=1&limit=10 like this we can do changes in limit and pageNumber
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    // sanitize limit - limit it to 50 only now
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //user see all the user cards
    // his connections
    //ignored profile
    //already sent the connection request
    // his own card

    //Find all connection requests (sent + received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set(); //it is like array which will have only unique element no duplicate
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUsersFromFeed) },
        },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);

    //api made by me
    // // 1. Find all users who already have a connection request with me in those statuses
    // // const connections = await ConnectionRequest.find({
    // //   $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    // //   status: { $in: ["accepted", "interested"] },
    // // });
    // // // 2. Collect their userIds
    // // const excludedUserIds = connections.map((req) =>
    // //   req.fromUserId.toString() === loggedInUser._id.toString()
    // //     ? req.toUserId
    // //     : req.fromUserId
    // // );
    // // // 3. Add myself also to excluded list
    // // excludedUserIds.push(loggedInUser._id);

    // // // 4. Find users not in excluded list
    // // const feed = await User.find(
    // //   { _id: { $nin: excludedUserIds } },
    // //   USER_SAFE_DATA // only safe fields
    // // );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
