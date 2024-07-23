"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const connectDB = (url) => mongoose.connect(url);
exports.default = connectDB;
