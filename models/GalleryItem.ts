import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, required: true, enum: ['image', 'video'] },
  src: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  collection: 'gallery',
});

export default mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema);
