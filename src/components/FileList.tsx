import React, { useState, useEffect } from 'react';
import { File, Download, Trash2, Lock, Key, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CryptoUtils } from '../lib/crypto';
import type { EncryptedFile } from '../types';

interface FileListProps {
  refreshTrigger: number;
}

interface DecryptModalProps {
  file: EncryptedFile;
  onClose: () => void;
  onDecrypt: (file: EncryptedFile, privateKeyHex: string) => void;
}

const DecryptModal: React.FC<DecryptModalProps> = ({ file, onClose, onDecrypt }) => {
  const [privateKey, setPrivateKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (privateKey.trim()) {
      onDecrypt(file, privateKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center mb-6">
          <Key className="w-6 h-6 text-blue-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Enter Private Key</h3>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">
            File: <span className="font-medium text-white">{file.filename}</span>
          </p>
          <p className="text-gray-400 text-xs">
            Paste your RSA private key in HEX format to decrypt this file
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Paste your RSA private key (HEX format) here..."
            className="w-full h-32 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Decrypt & Download
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 flex items-center text-xs text-yellow-400">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>Private keys are never stored or transmitted to the server</span>
        </div>
      </div>
    </div>
  );
};

export const FileList: React.FC<FileListProps> = ({ refreshTrigger }) => {
  const [files, setFiles] = useState<EncryptedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<EncryptedFile | null>(null);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('encrypted_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      setMessage(`Failed to fetch files: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (file: EncryptedFile, privateKeyHex: string) => {
    setProcessing(file.id);
    setMessage('');

    try {
      // Import private key
      const privateKeyResult = await CryptoUtils.importRSAPrivateKey(privateKeyHex);
      if (!privateKeyResult.success) {
        throw new Error(privateKeyResult.error);
      }

      // Decrypt AES key
      const aesKeyResult = await CryptoUtils.decryptAESKey(
        file.encrypted_aes_key,
        privateKeyResult.data
      );
      if (!aesKeyResult.success) {
        throw new Error(aesKeyResult.error);
      }

      // Decrypt file content
      const decryptedResult = await CryptoUtils.decryptFileContent(
        file.encrypted_content,
        aesKeyResult.data
      );
      if (!decryptedResult.success) {
        throw new Error(decryptedResult.error);
      }

      // Verify hash
      const currentHashResult = await CryptoUtils.calculateSHA256(
        decryptedResult.data.fileContent
      );
      if (!currentHashResult.success) {
        throw new Error('Failed to calculate file hash for verification');
      }

      if (currentHashResult.data !== decryptedResult.data.hash) {
        throw new Error('File integrity check failed - file may be corrupted');
      }

      // Create blob and download
      const blob = new Blob([decryptedResult.data.fileContent]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage('File decrypted and downloaded successfully!');
      setSelectedFile(null);

    } catch (error: any) {
      setMessage(`Decryption failed: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('encrypted_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      setFiles(files.filter(f => f.id !== fileId));
      setMessage('File deleted successfully');
    } catch (error: any) {
      setMessage(`Failed to delete file: ${error.message}`);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <File className="w-6 h-6 text-blue-400 mr-3" />
          <h2 className="text-xl font-bold text-white">Encrypted Files</h2>
          <span className="ml-auto text-sm text-gray-300">
            {files.length} file{files.length !== 1 ? 's' : ''}
          </span>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300">No encrypted files found</p>
            <p className="text-gray-400 text-sm mt-2">Upload your first file to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <File className="w-5 h-5 text-blue-400 mr-2" />
                      <h3 className="text-white font-medium truncate">{file.filename}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{formatFileSize(file.file_size)}</span>
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedFile(file)}
                      disabled={processing === file.id}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors duration-200"
                      title="Decrypt and Download"
                    >
                      {processing === file.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200"
                      title="Delete File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('successfully') || message.includes('downloaded')
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message}
          </div>
        )}
      </div>

      {selectedFile && (
        <DecryptModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDecrypt={downloadFile}
        />
      )}
    </>
  );
};