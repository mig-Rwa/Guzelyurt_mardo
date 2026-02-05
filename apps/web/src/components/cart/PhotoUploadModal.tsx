'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { X, Upload, Camera, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export default function PhotoUploadModal({
  isOpen,
  onClose,
  orderId,
}: PhotoUploadModalProps) {
  const { t, language } = useLanguage();
  const [customerName, setCustomerName] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(language === 'en' ? 'File too large. Maximum size is 5MB.' : 'Dosya çok büyük. Maksimum boyut 5MB.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(language === 'en' ? 'Please select an image file.' : 'Lütfen bir resim dosyası seçin.');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !customerName.trim()) {
      setError(language === 'en' ? 'Please fill in all required fields.' : 'Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('orderId', orderId);
      formData.append('customerName', customerName);
      if (caption.trim()) {
        formData.append('caption', caption);
      }

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setCaption('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mardo-yellow rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-mardo-dark" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-mardo-dark font-serif">
                {language === 'en' ? 'Share Your Moment' : 'Anınızı Paylaşın'}
              </h2>
              <p className="text-sm text-gray-600">
                {language === 'en' 
                  ? 'Upload a photo for a chance to be featured!' 
                  : 'Öne çıkmak için bir fotoğraf yükleyin!'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success State */}
        {success && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {language === 'en' ? 'Photo Uploaded Successfully!' : 'Fotoğraf Başarıyla Yüklendi!'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Thank you for sharing! Your photo will be reviewed and may be featured.' 
                : 'Paylaştığınız için teşekkürler! Fotoğrafınız incelenecek ve öne çıkarılabilir.'}
            </p>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Photo' : 'Fotoğraf'} *
              </label>
              
              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-mardo-yellow transition-colors"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">
                    {language === 'en' ? 'Click to upload a photo' : 'Fotoğraf yüklemek için tıklayın'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'PNG, JPG, WebP up to 5MB' : 'PNG, JPG, WebP max 5MB'}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Your Name' : 'Adınız'} *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={language === 'en' ? 'Enter your name' : 'Adınızı girin'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mardo-yellow focus:border-transparent"
                required
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Caption (Optional)' : 'Açıklama (Opsiyonel)'}
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={language === 'en' ? 'Share your experience...' : 'Deneyiminizi paylaşın...'}
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mardo-yellow focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1 text-right">
                {caption.length}/200
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                {language === 'en' ? 'Skip' : 'Geç'}
              </button>
              <button
                type="submit"
                disabled={uploading || !selectedFile || !customerName.trim()}
                className="flex-1 px-6 py-3 bg-mardo-yellow text-mardo-dark rounded-xl hover:bg-mardo-beige transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading 
                  ? (language === 'en' ? 'Uploading...' : 'Yükleniyor...') 
                  : (language === 'en' ? 'Upload Photo' : 'Fotoğrafı Yükle')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
