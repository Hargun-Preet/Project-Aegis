import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, File, Download, Trash2, Key, AlertCircle, Search, Calendar, HardDrive, SortAsc, SortDesc, Loader2, CheckCircle, XCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CryptoUtils } from '../lib/crypto';
import type { User } from '@supabase/supabase-js';
import type { EncryptedFile } from '../types';


// --- UI COMPONENTS (Toast, Modals) ---
type ToastType = 'success' | 'error';
interface ToastState { id: number; type: ToastType; message: string; }

const Toast: React.FC<{ toast: ToastState; onClose: () => void; }> = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = toast.type === 'success';
    const Icon = isSuccess ? CheckCircle : XCircle;
    const colors = isSuccess ? 'border-green-500/30 text-green-300' : 'border-red-500/30 text-red-400';

    return (
        <div className={`toast feature-card flex items-start p-4 rounded-lg shadow-lg w-full max-w-sm ${colors}`}>
            <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <p className="flex-grow text-sm text-gray-200">{toast.message}</p>
            <button onClick={onClose} className="ml-4 -mr-2 -mt-2 p-2 rounded-full hover:bg-white/10 transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
        </div>
    );
};

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onConfirm, onCancel, title, message }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
        <div className="feature-card rounded-2xl p-6 w-full max-w-md border border-yellow-500/30">
            <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-400 mr-3" />
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <p className="text-gray-400 mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
                <button onClick={onCancel} className="px-4 py-2.5 border border-[#273142] rounded-lg text-gray-300 hover:bg-[#111927] hover:border-[#00A2FF] transition-colors">Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-lg transition-colors">Confirm Deletion</button>
            </div>
        </div>
    </div>
);
// --- END UI COMPONENTS ---


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
      <div className="feature-card rounded-2xl p-6 w-full max-w-md border border-blue-500/30">
        <div className="flex items-center mb-6">
          <Key className="w-6 h-6 text-[#00C6FF] mr-3" />
          <h3 className="text-xl font-bold text-white">Enter Private Key</h3>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">
            File: <span className="font-medium text-white">{file.filename}</span>
          </p>
          <p className="text-gray-400 text-xs">
            Paste your RSA private key in HEX format to decrypt this file.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Paste your RSA private key (HEX format) here..."
            className="w-full h-32 p-3 bg-[#0A101C] border border-[#273142] rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#0072FF] focus:ring-1 focus:ring-[#0072FF] transition-colors duration-300 font-mono text-xs"
            required
          />

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 cta-button text-white font-bold py-2.5 px-4 rounded-lg"
            >
              Decrypt & Download
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#273142] rounded-lg text-gray-300 hover:bg-[#111927] hover:border-[#00A2FF] transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 flex items-center text-xs text-yellow-400/80">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>Private keys are never stored or transmitted.</span>
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
  const [fileToDelete, setFileToDelete] = useState<EncryptedFile | null>(null); // For confirmation modal
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();
  
  const addToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

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
      addToast('error', `Failed to fetch files: ${error.message}`);
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

    try {
      const privateKeyResult = await CryptoUtils.importRSAPrivateKey(privateKeyHex);
      if (!privateKeyResult.success) throw new Error(privateKeyResult.error);

      const aesKeyResult = await CryptoUtils.decryptAESKey(file.encrypted_aes_key, privateKeyResult.data);
      if (!aesKeyResult.success) throw new Error(aesKeyResult.error || 'Could not decrypt file key. Is the private key correct?');

      const decryptedResult = await CryptoUtils.decryptFileContent(file.encrypted_content, aesKeyResult.data);
      if (!decryptedResult.success) throw new Error(decryptedResult.error);

      const currentHashResult = await CryptoUtils.calculateSHA256(decryptedResult.data.fileContent);
      if (!currentHashResult.success) throw new Error('Failed to calculate file hash for verification');

      if (currentHashResult.data !== decryptedResult.data.hash) {
        throw new Error('File integrity check failed - file may be corrupted.');
      }

      const blob = new Blob([decryptedResult.data.fileContent]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast('success', 'File decrypted and downloaded successfully!');
      setSelectedFile(null);

    } catch (error: any) {
      addToast('error', `Decryption failed: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleDeleteRequest = (file: EncryptedFile) => {
    setFileToDelete(file);
  };

  const handleDeleteConfirmed = async () => {
    if (!fileToDelete) return;
    try {
      const { error } = await supabase
        .from('encrypted_files')
        .delete()
        .eq('id', fileToDelete.id);

      if (error) throw error;

      setFiles(files.filter(f => f.id !== fileToDelete.id));
      addToast('success', `File "${fileToDelete.filename}" deleted.`);
    } catch (error: any) {
      addToast('error', `Failed to delete file: ${error.message}`);
    } finally {
      setFileToDelete(null);
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
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00C6FF] animate-spin" />
      </div>
    );
  }

  return (
    <>
     <style>{`
        /* Consistent styles from other pages */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .hero-bg {
          background-color: #05070D;
          background-image:
            radial-gradient(at 20% 25%, hsla(212, 90%, 25%, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 20%, hsla(288, 70%, 30%, 0.25) 0px, transparent 50%),
            radial-gradient(at 50% 80%, hsla(190, 85%, 40%, 0.2) 0px, transparent 50%);
        }
        .hero-bg::before {
          content: ''; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 50 L50 0 L100 50 L50 100 Z' fill='none' stroke='%23101827' stroke-width='0.5'/%3E%3C/svg%3E");
          background-size: 20px 20px; opacity: 0.1; animation: pan 60s linear infinite;
        }
        @keyframes pan { from { background-position: 0% 0%; } to { background-position: 100% 100%; } }
        .feature-card {
          background: rgba(14, 22, 39, 0.6); border: 1px solid #273142;
          backdrop-filter: blur(10px);
        }
        .cta-button {
          background: linear-gradient(90deg, #00C6FF, #0072FF); transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(0, 198, 255, 0.3);
        }
        .cta-button:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 0 25px rgba(0, 198, 255, 0.5);
        }
        .toast { animation: slideIn 0.3s ease-out forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <div className="fixed top-6 right-6 z-[9999] w-full max-w-sm space-y-3">
          {toasts.map(toast => <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />)}
      </div>

      <div className="min-h-screen bg-[#0A101C] text-white">
        <div className="fixed inset-0 hero-bg"></div>
        
        <div className="relative z-10">
          <header className="px-6 py-4 border-b border-gray-800/50 bg-[#0A101C]/80 backdrop-blur-sm sticky top-0 z-40">
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link to="/dashboard" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-3">
                  <File className="w-7 h-7 text-[#00C6FF]" />
                  <h1 className="text-2xl font-bold text-white">My Files</h1>
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                Showing {filteredFiles.length} of {files.length} files
              </div>
            </nav>
          </header>

          <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="feature-card rounded-xl p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by filename..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0A101C] border border-[#273142] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#0072FF] focus:ring-1 focus:ring-[#0072FF]"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  {[
                    { key: 'name', label: 'Name', icon: File },
                    { key: 'size', label: 'Size', icon: HardDrive },
                    { key: 'date', label: 'Date', icon: Calendar },
                  ].map(btn => (
                    <button
                      key={btn.key}
                      onClick={() => toggleSort(btn.key as 'name' | 'size' | 'date')}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        sortBy === btn.key ? 'bg-blue-500/10 text-[#00C6FF]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <btn.icon className="w-4 h-4" />
                      <span>{btn.label}</span>
                      {sortBy === btn.key && (sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="feature-card rounded-xl p-12 text-center mt-8">
                <File className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">{files.length === 0 ? 'Your Vault is Empty' : 'No Files Found'}</h3>
                <p className="text-gray-500 mb-6">{files.length === 0 ? 'Go to your dashboard to encrypt and upload your first file.' : 'Try adjusting your search or filter criteria.'}</p>
                {files.length === 0 && <Link to="/dashboard" className="inline-flex items-center px-6 py-2.5 cta-button text-white font-bold rounded-lg"><Shield className="w-5 h-5 mr-2" /><span>Go to Dashboard</span></Link>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="feature-card rounded-xl p-5 flex flex-col space-y-4 transition-all duration-300 hover:border-[#00A2FF] hover:-translate-y-1">
                    <div className="flex items-center min-w-0">
                      <div className="p-2.5 bg-blue-500/10 rounded-lg mr-4 border border-blue-400/20"><File className="w-5 h-5 text-[#00C6FF]" /></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate" title={file.filename}>{file.filename}</h3>
                        <p className="text-gray-400 text-sm">{formatFileSize(file.file_size)}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 border-t border-gray-800 pt-3">Uploaded: {formatDate(file.created_at)}</div>
                    <div className="flex items-center space-x-2 pt-2">
                      <button onClick={() => setSelectedFile(file)} disabled={processing === file.id} className="flex-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 py-2 px-3 rounded-lg hover:bg-blue-600/30 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2" title="Decrypt and Download">
                        {processing === file.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Download className="w-4 h-4" /><span className="text-sm font-semibold">Decrypt</span></>}
                      </button>
                      <button onClick={() => handleDeleteRequest(file)} className="bg-red-600/10 border border-red-500/30 text-red-400 p-2.5 rounded-lg hover:bg-red-600/20 transition-colors" title="Delete File">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedFile && <DecryptModal file={selectedFile} onClose={() => setSelectedFile(null)} onDecrypt={downloadFile} />}
      {fileToDelete && <ConfirmationModal onConfirm={handleDeleteConfirmed} onCancel={() => setFileToDelete(null)} title="Confirm Deletion" message={`Are you sure you want to permanently delete "${fileToDelete.filename}"? This action cannot be undone.`} />}
    </>
  );
};

