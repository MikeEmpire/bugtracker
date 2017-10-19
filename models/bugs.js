import mongoose from 'mongoose';

const BugsSchema = new mongoose.Schema({
  priority: String,
  status: String,
  owner: String,
  title: String
});

export default mongoose.model('Bugs', BugsSchema);
