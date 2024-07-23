const mongoose = require('mongoose');

const connectDB = (url : String) => mongoose.connect(url);

export default connectDB;