import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  price: Number,
  image: String, // Add image field
  },
  {
    collection: 'plan', // 👈 match Atlas collection name exactly
  }
);    

export default mongoose.models.Plan || mongoose.model('Plan', PlanSchema);
