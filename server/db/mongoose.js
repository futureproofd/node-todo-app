var mongoose = require("mongoose");

//Configure mongoose to use JS Promises
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose
};
