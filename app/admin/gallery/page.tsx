'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Play, Image as ImageIcon, Video, Loader2, AlertCircle } from 'lucide-react';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface GalleryItem {
  _id: string;
  type: 'image' | 'video';
  src: string;
  title: string;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'image' as 'image' | 'video',
    src: ''
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gallery');
      if (!res.ok) throw new Error('Failed to fetch gallery items');
      const data = await res.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUploadSuccess = (result: any) => {
    if (result?.info?.secure_url) {
      setFormData((prev) => ({
        ...prev,
        src: result.info.secure_url,
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.src) return;

    try {
      setIsSaving(true);
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create gallery item');
      
      setShowAddModal(false);
      setFormData({ title: '', type: 'image', src: '' });
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/gallery?id=${itemToDelete}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gallery Items ({items.length})</h2>
          <p className="text-sm text-gray-500">Upload and manage homepage & dedicated gallery works</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-900 text-white hover:bg-red-800 rounded-lg px-4 py-2"
        >
          <Plus size={18} />
          Add Item
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2 mb-6">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-red-900" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden relative group">
              <div className="aspect-[9/16] relative bg-[#4A2E20] flex items-center justify-center">
                {item.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <video src={item.src} className="w-full h-full object-cover" controls muted />
                    <div className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-[#4A2E20]/80 backdrop-blur-sm flex items-center justify-center text-white">
                      <Play size={16} className="fill-white ml-0.5" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-[#4A2E20]/80 backdrop-blur-sm flex items-center justify-center text-white">
                      <ImageIcon size={16} />
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Delete button */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="truncate">
                  <h4 className="font-semibold text-gray-800 truncate text-sm">{item.title}</h4>
                  <span className="text-[10px] text-gray-500 capitalize">{item.type}</span>
                </div>
                <button
                  onClick={() => triggerDelete(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500">
              No gallery items found. Click 'Add Item' to upload your first design!
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-150 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg">Add New Gallery Item</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="e.g. Stunning Bridal Mehandi"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    options={{
                      sources: ['local'],
                      multiple: false,
                      resourceType: 'auto',
                      maxFileSize: 100000000,
                      clientAllowedFormats: formData.type === 'video' ? ['mp4', 'mov', 'm4v'] : ['jpg', 'jpeg', 'png', 'webp']
                    }}
                    onSuccess={handleUploadSuccess}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex flex-col items-center justify-center gap-1.5 transition-colors"
                      >
                        {formData.type === 'video' ? <Video size={24} /> : <ImageIcon size={24} />}
                        <span>Click to Upload {formData.type === 'video' ? 'Video' : 'Image'}</span>
                      </button>
                    )}
                  </CldUploadWidget>

                  {formData.src && (
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-500 font-medium truncate mb-2">Uploaded URL: {formData.src}</p>
                      <div className="aspect-[9/16] max-h-48 overflow-hidden rounded-md relative bg-black flex items-center justify-center mx-auto">
                        {formData.type === 'video' ? (
                          <video src={formData.src} className="w-full h-full object-contain" controls muted />
                        ) : (
                          <img src={formData.src} className="w-full h-full object-contain" alt="Uploaded preview" />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-150 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving || !formData.src}
                    className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 flex items-center gap-1.5"
                  >
                    {isSaving && <Loader2 className="animate-spin" size={16} />}
                    Save Item
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-150 flex justify-between items-center bg-red-50">
                <h3 className="font-bold text-red-800 text-base">Confirm Deletion</h3>
                <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete this gallery item? This action cannot be undone.
                </p>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 flex items-center gap-1.5 font-medium rounded-md text-sm"
                >
                  {isDeleting && <Loader2 className="animate-spin" size={16} />}
                  Delete Item
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
