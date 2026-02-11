import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['c', 'cpp', 'java', 'python'],
  },
  sourceCode: {
    type: String,
    required: [true, 'Source code is required'],
  },
  stdin: {
    type: String,
    default: '',
  },
  output: {
    type: String,
    default: '',
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

snippetSchema.index({ userId: 1, createdAt: -1 });
snippetSchema.index({ visibility: 1 });

snippetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Snippet', snippetSchema);