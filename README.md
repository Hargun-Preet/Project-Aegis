# 🛡️ Project Aegis - Secure File Vault System

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

🔐 A robust, client-side encrypted file storage solution ensuring maximum data privacy and security.

**Live Demo:** [Project Aegis](https://aegisone.vercel.app)

## 📖 Introduction

Project Aegis is a cutting-edge secure file vault system developed as part of the Cyber Security Course (July-Dec 2025). This project ensures maximum privacy by performing all cryptographic operations in the browser. Files are encrypted with AES-256, integrity-protected with SHA-256, and securely stored in the backend database along with their encrypted keys — ensuring that only the rightful owner with the private RSA key can decrypt and access the data.

## ✨ Key Features

- **Client-Side Encryption/Decryption**
  - All cryptographic operations performed locally in the browser
  - Zero-knowledge architecture - server never sees unencrypted data
  - AES-256-GCM for file encryption
  - RSA for key protection

- **Data Integrity Protection**
  - SHA-256 hash verification
  - Tamper-evident storage
  - Cryptographic integrity checks

- **Secure Key Management**
  - Client-generated AES-256 keys for each file
  - RSA public/private key authentication
  - No key storage on server

- **User-Friendly Interface**
  - Intuitive file upload/download
  - Drag-and-drop support
  - Progress indicators for cryptographic operations

-**Secure Backend Storage**
  - Encrypted files stored in database with metadata (filename, size, hash)
  - AES keys stored only in RSA-encrypted HEX format
  - Strict Row-Level Security (RLS) ensures users can access only their own files
  - Database policies allow only authenticated users to insert, read, and delete their files
  - Integrity maintained via stored SHA-256 hash for each file

## ⚙️ Tech Stack

- **Frontend**
  - React
  - TypeScript
  - Tailwind CSS
  - Web Crypto API (for Cryptographic Libraries)

- **Backend**
  - Supabase – used for database storage and authentication
  - Node.js

- **Deployment**
  - Vercel - for frontend hosting
  - Supabase Cloud – for database and authentication

## 🚀 How It Works

### Encryption Process
1. User selects a file through the web interface
2. System generates a random AES-256 key
3. File is hashed using SHA-256
4. File + hash are encrypted using AES-256-GCM
5. AES key is encrypted with user's RSA public key
6. Encrypted file and encrypted AES key are stored on server

### Decryption Process
1. User requests file download
2. System retrieves encrypted file and AES key
3. AES key is decrypted using user's RSA private key
4. File is decrypted using the recovered AES key
5. File integrity is verified against original hash
6. File is delivered to user if verification passes

## 🛠️ Installation & Setup

1. Clone the repository
```bash
git clone https://github.com/Cyber-Security-July-Dec-2025/B14.git
cd B14
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Add your Supabase configuration
# Make sure to include the following environment variables:

# 1. VITE_SUPABASE_URL
#    - Go to your Supabase dashboard → Project → Settings → API
#    - Copy the "URL" under "Project URL" and paste it here
VITE_SUPABASE_URL=your-project-url

# 2. VITE_SUPABASE_ANON_KEY
#    - In the same API settings page, copy the "anon public" key
#    - Paste it here. This key is safe for frontend usage
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Start development server
```bash
npm run dev
```

## 🔑 Usage Instructions

### Generating RSA Keys

1. Use OpenSSL to generate your key pair:
```bash
# Generate private key
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

# Extract public key
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

2. Convert keys to HEX format:
```bash
# For private key
openssl rsa -in private_key.pem -outform DER | xxd -p -c 256

# For public key
openssl rsa -pubin -in public_key.pem -outform DER | xxd -p -c 256
```

### Using the Application

1. Input your RSA public key in HEX format in the key management section
- You can either:
  - Generate your own RSA key pair using OpenSSL locally, or
  - Use the “Generate RSA Key Pair” option provided in the web app.
- 💡 Note: Only the public key should be input here; never upload your private key.
2. Upload files through the drag-and-drop interface
3. Monitor encryption progress
4. For decryption, input your RSA private key when prompted
5. Download and verify decrypted files

## 📂 Project Structure

```
SecureVault/
├── src/
│   ├── components/       # React components
│   ├── lib/              # Cryptographic operations
│   ├── pages/            # Application pages
│   └── types/            # TypeScript definitions
└── supabase/            # Database migrations
```

## 👥 Contributors

Group B14 Members:
- Hargun Preet Singh (IIT2023191)
- Adarsh Kumar (IIT2023194)
- Harshit Shahi (IIT2023208)
- Keshav Porwal (IIT2023211)
- Khushwant Kumawat (IIT2023212)

## ⚠️ Security Notes

- Private keys should never be stored in the browser
- Always use secure channels to transfer keys
- Regularly rotate RSA key pairs
- Verify file integrity after decryption
- Use strong passwords for key protection

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Cyber Security Course Faculty
  - Special thanks to Dr. Soumyadev Maity for guidance and support
  - Gratitude to the TAs and faculty team for their assistance throughout the project
- Supabase Team for Backend Infrastructure
- Web Crypto API Contributors
