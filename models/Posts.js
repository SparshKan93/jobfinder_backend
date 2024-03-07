const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    image:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    companyName:{
        type: String,
        required: true
    },
    skillsRequired:{
        type: String,
        required: true
    },
    stipend:{
        type: Number,
        required: true,
        min: 0
    },
    location:{
        type: String,
        required: true
    },
    endingTime:{
        type: String,
        default: null
    },
    date:{
        type: Date,
        default: Date.now
    }
  });

  const Post = mongoose.model('Post', PostSchema);
  module.exports = Post;