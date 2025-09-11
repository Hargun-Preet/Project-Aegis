/*
  # Create encrypted files table for secure file vault

  1. New Tables
    - `encrypted_files`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `filename` (text, original filename)
      - `file_size` (bigint, original file size in bytes)
      - `encrypted_content` (text, base64 encoded encrypted file data)
      - `encrypted_aes_key` (text, RSA encrypted AES key in HEX)
      - `file_hash` (text, SHA-256 hash for integrity verification)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `encrypted_files` table
    - Add policy for users to read only their own files
    - Add policy for users to insert their own files
    - Add policy for users to delete their own files
*/

CREATE TABLE IF NOT EXISTS encrypted_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  filename text NOT NULL,
  file_size bigint NOT NULL,
  encrypted_content text NOT NULL,
  encrypted_aes_key text NOT NULL,
  file_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE encrypted_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own encrypted files"
  ON encrypted_files
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own encrypted files"
  ON encrypted_files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own encrypted files"
  ON encrypted_files
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_encrypted_files_user_id ON encrypted_files(user_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_files_created_at ON encrypted_files(created_at DESC);