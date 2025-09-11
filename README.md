# Project Aegis - Secure File Vault System

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

🔐 A robust, client-side encrypted file storage solution ensuring maximum data privacy and security.

**Live Demo:** [Project Aegis](https://aegisone.vercel.app)

## 📖 Introduction

Project Aegis is a cutting-edge secure file vault system developed as part of the Cyber Security Course (July-Dec 2025). The project implements a web-based solution that prioritizes user privacy through client-side encryption, ensuring that sensitive data never leaves the user's browser in an unencrypted form.

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

## ⚙️ Tech Stack

- **Frontend**
  - React
  - TypeScript
  - Tailwind CSS
  - Web Crypto API

- **Backend**
  - Supabase
  - Node.js

- **Deployment**
  - Vercel
  - Supabase Cloud

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
2. Upload files through the drag-and-drop interface
3. Monitor encryption progress
4. For decryption, input your RSA private key when prompted
5. Download and verify decrypted files

## 📂 Project Structure

```
SecureVault/
├── src/
│   ├── components/        # React components
│   ├── lib/              # Cryptographic operations
│   ├── pages/            # Application pages
│   └── types/            # TypeScript definitions
├── public/               # Static assets
└── supabase/            # Database migrations
```

## 👥 Contributors

Group B14 Members:
- [Member 1]
- [Member 2]
- [Member 3]
- [Member 4]

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
- Supabase Team for Backend Infrastructure
- Web Crypto API Contributors
