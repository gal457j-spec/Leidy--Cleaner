"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Camera, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  currentPhoto,
  onPhotoChange,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showError, showSuccess } = useNotification();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        showError(`Arquivo muito grande. Máximo: ${maxSize}MB`);
      } else if (error.code === 'file-invalid-type') {
        showError('Tipo de arquivo não suportado. Use JPG, PNG ou WebP');
      } else {
        showError('Erro ao fazer upload do arquivo');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simular upload com progresso
      const reader = new FileReader();
      reader.onloadstart = () => setUploadProgress(10);
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(10 + (e.loaded / e.total) * 70);
        }
      };
      reader.onload = (e) => {
        setUploadProgress(90);
        const result = e.target?.result as string;
        setPreview(result);
        setTimeout(() => {
          setUploadProgress(100);
          setTimeout(() => {
            onPhotoChange(result);
            setIsUploading(false);
            setUploadProgress(0);
            showSuccess('Foto atualizada com sucesso!');
          }, 300);
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  }, [maxSize, onPhotoChange, showError, showSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize * 1024 * 1024,
    multiple: false
  });

  const removePhoto = () => {
    setPreview(null);
    onPhotoChange('');
    showSuccess('Foto removida com sucesso');
  };

  const displayPhoto = preview || currentPhoto;

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full mb-4">
          <Camera className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Foto do Perfil</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Personalize seu perfil com uma foto incrível
        </p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Photo Display */}
        <div className="relative group">
          <motion.div
            className="relative w-40 h-40 rounded-2xl border-4 border-gray-200 dark:border-gray-700 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt="Foto do perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {/* Upload Progress Overlay */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-3"
                  >
                    <Upload className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="w-20 h-2 bg-gray-600 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-primary rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="text-white text-sm mt-2 font-medium">
                    {Math.round(uploadProgress)}%
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Checkmark */}
            <AnimatePresence>
              {uploadProgress === 100 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute inset-0 bg-green-500/90 flex items-center justify-center"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Remove Button */}
          {displayPhoto && !isUploading && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={removePhoto}
              className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Upload Area */}
        <div {...getRootProps()}>
          <motion.div
            className={`w-full max-w-md p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-primary bg-primary/10 shadow-lg scale-105'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-md'
            }`}
            whileHover={{ scale: isDragActive ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
          <input {...getInputProps()} />
          <div className="text-center">
            <motion.div
              animate={isDragActive ? { scale: 1.2, y: -5 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mb-4"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {isDragActive ? 'Solte a imagem aqui' : 'Faça upload de uma foto'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {isDragActive
                ? 'Perfeito! Solte para fazer upload'
                : 'Clique para selecionar ou arraste uma imagem para cá'
              }
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>JPG, PNG ou WebP</span>
              <span>•</span>
              <span>Máx. {maxSize}MB</span>
            </div>
          </div>
          </motion.div>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 max-w-md"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Dicas para melhor qualidade
              </h5>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Use uma imagem quadrada de pelo menos 400x400 pixels. Fotos bem iluminadas e nítidas ficam incríveis no seu perfil.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PhotoUpload;
