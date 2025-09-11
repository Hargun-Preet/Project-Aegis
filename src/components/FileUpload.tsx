import React, { useState, useRef } from 'react';
import { Upload, Lock, FileIcon, Shield } from 'lucide-react';
import { CryptoUtils } from '../lib/crypto';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadProps {
  publicKeyHex: string;
  onUploadComplete: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ publicKeyHex, onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!publicKeyHex) {
      setMessage('Please generate or import a public key first');
      return;
    }

    setUploading(true);
    setMessage('');
    setProgress('Reading file...');

    try {
      // Read file as ArrayBuffer
      const fileBuffer = await file.arrayBuffer();
      setProgress('Calculating file hash...');

      // Calculate SHA-256 hash
      const hashResult = await CryptoUtils.calculateSHA256(fileBuffer);
      if (!hashResult.success) {
        throw new Error(hashResult.error);
      }

      setProgress('Generating encryption key...');

      // Generate AES key
      const aesKeyResult = await CryptoUtils.generateAESKey();
      if (!aesKeyResult.success) {
        throw new Error(aesKeyResult.error);
      }

      setProgress('Importing RSA public key...');

      // Import RSA public key
      const publicKeyResult = await CryptoUtils.importRSAPublicKey(publicKeyHex);
      if (!publicKeyResult.success) {
        throw new Error(publicKeyResult.error);
      }

      setProgress('Encrypting file...');

      // Encrypt file content with hash
      const encryptedFileResult = await CryptoUtils.encryptFileContent(
        fileBuffer,
        hashResult.data,
        aesKeyResult.data
      );
      if (!encryptedFileResult.success) {
        throw new Error(encryptedFileResult.error);
      }

      setProgress('Encrypting AES key...');

      // Encrypt AES key with RSA public key
      const encryptedKeyResult = await CryptoUtils.encryptAESKey(
        aesKeyResult.data,
        publicKeyResult.data
      );
      if (!encryptedKeyResult.success) {
        throw new Error(encryptedKeyResult.error);
      }

      setProgress('Uploading to server...');

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Store encrypted file in database
      const { error } = await supabase
        .from('encrypted_files')
        .insert({
          id: uuidv4(),
          user_id: user.id,
          filename: file.name,
          file_size: file.size,
          encrypted_content: encryptedFileResult.data,
          encrypted_aes_key: encryptedKeyResult.data,
          file_hash: hashResult.data,
        });

      if (error) {
        throw error;
      }

      setMessage('File encrypted and uploaded successfully!');
      setProgress('');
      onUploadComplete();
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      setMessage(`Upload failed: ${error.message}`);
      setProgress('');
    } finally {
      setUploading(false);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-gray-600 hover:border-cyan-400/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          disabled={uploading || !publicKeyHex}
        />

        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full">
            {uploading ? (
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FileIcon className="w-8 h-8 neon-text" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-2">
              {uploading ? 'Encrypting and Uploading...' : 'Choose a file or drag it here'}
            </h3>
            <p className="text-gray-300 text-sm">
              <Shield className="w-4 h-4 inline mr-1" />
              AES-256-GCM encryption with integrity verification
            </p>
          </div>

          {progress && (
            <div className="neon-text text-sm">
              {progress}
            </div>
          )}

          <button
            onClick={onButtonClick}
            disabled={uploading || !publicKeyHex}
            className="glow-button text-black font-bold py-3 px-6 rounded-lg disabled:opacity-50 transition-all duration-200"
          >
            {uploading ? 'Processing...' : 'Select File'}
          </button>

          {!publicKeyHex && (
            <p className="text-yellow-400 text-sm mt-4 flex items-center justify-center">
              ⚠️ Please generate or import a public key first
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-400 justify-center">
        <Lock className="w-4 h-4 mr-2 neon-text" />
        <span>Zero-knowledge encryption • Keys never leave your browser</span>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.includes('successfully')
            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
            : 'bg-red-500/10 text-red-400 border border-red-500/30'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};