export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface EncryptedFile {
  id: string;
  user_id: string;
  filename: string;
  file_size: number;
  encrypted_content: string;
  encrypted_aes_key: string;
  file_hash: string;
  created_at: string;
  updated_at: string;
}

export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface CryptoResult {
  success: boolean;
  data?: any;
  error?: string;
}