# 🛡️ Project Aegis - Secure File Vault System

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

🔐 A robust, client-side encrypted file storage solution ensuring maximum data privacy and security.

**Live Demo:** [Project Aegis](https://aegisone.vercel.app)

## 📖 Introduction

Project Aegis is a cutting-edge secure file vault system developed as part of the Cyber Security Course (July-Dec 2025). This project ensures maximum privacy by performing all cryptographic operations in the browser. Files are encrypted with AES-256, integrity-protected with SHA-256, and securely stored in the backend database along with their encrypted keys — ensuring that only the rightful owner with the private RSA key can decrypt and access the data.

## 🔒 Problem Statement

In today’s digital world, storing sensitive files on cloud servers poses significant privacy and security risks. Traditional storage methods often rely on server-side encryption, which can expose encryption keys or plaintext data to the server.

**Project Aegis** addresses this issue by providing a **web-based secure file vault** where all cryptographic operations — encryption, decryption, and hashing — are performed entirely on the **client side (in the browser)**. 

The system works as follows:  
1. The user selects a file to upload.  
2. A random **AES-256 key** is generated for the file.  
3. The **SHA-256 digest** of the file is calculated for integrity verification.  
4. The file content along with its hash is encrypted using **AES-256-GCM**.  
5. The AES key is encrypted using the user's **RSA public key**.  
6. The server stores only:  
   - The encrypted file and hash  
   - The encrypted AES key  

To decrypt a file:  
1. Retrieve the encrypted file and AES key from the server.  
2. Decrypt the AES key using the user's **RSA private key**.  
3. Use the AES key to decrypt the file.  
4. Verify the file integrity using the stored SHA-256 hash.  

All keys and cryptographic operations remain on the client; **no keys are sent to the server**. Users can generate RSA key pairs manually (converted to HEX format) or use the **“Generate RSA Key Pair”** option in the GUI. The **public key** can be stored in localStorage for convenience, but the **private key must never be stored**.

This approach ensures:  

- **Confidentiality:** The server never sees plaintext files or encryption keys.  
- **Integrity:** Files can be verified for tampering using stored SHA-256 hashes.
- **Security & Availability:** The system ensures **Confidentiality** (no plaintext files or keys are exposed), **Integrity** (files can be verified using SHA-256 hashes), and **Availability** (users can reliably access and decrypt their files anytime using their private RSA key).
- **User Control:** Only users with the correct private RSA key can decrypt and access their files.  

By combining **client-side cryptography** with **secure backend storage**, Project Aegis provides a **robust and reliable solution for confidential file storage and retrieval**.


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
  - My Files Dashboard
    - View all your uploaded encrypted files in one place
    - Decrypt files directly from the dashboard using your private RSA key
    - Sort files by name, size, or upload date for easy access

- **Secure Backend Storage**
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
git clone https://github.com/Hargun-Preet/Project-Aegis.git
cd Project-Aegis
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
