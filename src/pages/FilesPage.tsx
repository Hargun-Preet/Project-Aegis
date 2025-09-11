import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, File, Download, Trash2, Key, AlertCircle, Search, Filter, Calendar, HardDrive, SortAsc, SortDesc } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CryptoUtils } from '../lib/crypto';
import type { User } from '@supabase/supabase-js';
import type { EncryptedFile } from '../types';

interface FilesPageProps {
  user: User;
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card neon-border rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center mb-6">
          <Key className="w-6 h-6 neon-text mr-3" />
          <h3 className="text-xl font-bold text-white">Enter Private Key</h3>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">
            File: <span className="font-medium neon-text">{file.filename}</span>
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
            className="w-full h-32 p-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            required
          />

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 glow-button text-black font-bold py-2 px-4 rounded-lg"
            >
              Decrypt & Download
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600/20 border border-gray-500/30 text-gray-300 rounded-lg hover:bg-gray-600/30 transition-colors duration-200"
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

export const FilesPage: React.FC<FilesPageProps> = ({ user }) => {
  const [files, setFiles] = useState<EncryptedFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<EncryptedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<EncryptedFile | null>(null);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    filterAndSortFiles();
  }, [files, searchTerm, sortBy, sortOrder]);

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

  const filterAndSortFiles = () => {
    let filtered = files.filter(file =>
      file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.filename.localeCompare(b.filename);
          break;
        case 'size':
          comparison = a.file_size - b.file_size;
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredFiles(filtered);
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

  const toggleSort = (newSortBy: 'name' | 'size' | 'date') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 cyber-grid opacity-10"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <header className="px-6 py-4 border-b border-gray-800">
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Dashboard</span>
                </Link>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-black" />
                  </div>
                  <span className="text-2xl font-bold neon-text">My Files</span>
                </div>
              </div>

              <div className="text-gray-300 text-sm">
                {filteredFiles.length} of {files.length} files
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Search and Filter Bar */}
            <div className="glass-card neon-border rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Sort by:</span>
                  </div>
                  
                  <button
                    onClick={() => toggleSort('name')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors duration-200 ${
                      sortBy === 'name' ? 'bg-cyan-400/20 text-cyan-400' : 'text-gray-400 hover:text-cyan-400'
                    }`}
                  >
                    <span>Name</span>
                    {sortBy === 'name' && (
                      sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => toggleSort('size')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors duration-200 ${
                      sortBy === 'size' ? 'bg-cyan-400/20 text-cyan-400' : 'text-gray-400 hover:text-cyan-400'
                    }`}
                  >
                    <HardDrive className="w-4 h-4" />
                    <span>Size</span>
                    {sortBy === 'size' && (
                      sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => toggleSort('date')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors duration-200 ${
                      sortBy === 'date' ? 'bg-cyan-400/20 text-cyan-400' : 'text-gray-400 hover:text-cyan-400'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Date</span>
                    {sortBy === 'date' && (
                      sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Files Grid */}
            {filteredFiles.length === 0 ? (
              <div className="glass-card neon-border rounded-xl p-12 text-center">
                <File className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">
                  {files.length === 0 ? 'No files found' : 'No files match your search'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {files.length === 0 
                    ? 'Upload your first encrypted file to get started'
                    : 'Try adjusting your search terms or filters'
                  }
                </p>
                {files.length === 0 && (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-6 py-3 glow-button text-black font-bold rounded-lg"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Go to Dashboard
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="glass-card neon-border rounded-xl p-6 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-cyan-400/20 rounded-lg flex items-center justify-center mr-3">
                          <File className="w-5 h-5 neon-text" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium truncate max-w-[150px]" title={file.filename}>
                            {file.filename}
                          </h3>
                          <p className="text-gray-400 text-sm">{formatFileSize(file.file_size)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      {formatDate(file.created_at)}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedFile(file)}
                        disabled={processing === file.id}
                        className="flex-1 bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 py-2 px-3 rounded-lg hover:bg-cyan-600/30 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                        title="Decrypt and Download"
                      >
                        {processing === file.id ? (
                          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            <span className="text-sm">Decrypt</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="bg-red-600/20 border border-red-500/30 text-red-400 p-2 rounded-lg hover:bg-red-600/30 transition-colors duration-200"
                        title="Delete File"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {message && (
              <div className={`mt-6 p-4 rounded-lg text-sm border ${
                message.includes('successfully') || message.includes('downloaded')
                  ? 'bg-green-500/10 text-green-400 border-green-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
                {message}
              </div>
            )}
          </main>
        </div>
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