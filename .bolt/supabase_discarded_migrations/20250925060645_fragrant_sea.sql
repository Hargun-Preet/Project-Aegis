/*
  # Create encrypted files table and security policies

  1. New Tables
    - `encrypted_files`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `filename` (text, not null)
      - `file_size` (bigint, not null)
      - `encrypted_content` (text, not null) - Base64 encoded encrypted file content
      - `encrypted_aes_key` (text, not null) - RSA encrypted AES key in HEX format
      - `file_hash` (text, not null) - SHA-256 hash of original file
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `encrypted_files` table
    - Add policies for authenticated users to manage their own files
    - Add indexes for performance

  3. Features
    - Automatic timestamp updates
    - Foreign key constraint to auth.users
    - Optimized indexes for common queries
*/

-- Create the encrypted_files table
CREATE TABLE IF NOT EXISTS encrypted_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_size bigint NOT NULL,
  encrypted_content text NOT NULL,
  encrypted_aes_key text NOT NULL,
  file_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE encrypted_files ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can insert own encrypted files"
  ON encrypted_files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own encrypted files"
  ON encrypted_files
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own encrypted files"
  ON encrypted_files
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_encrypted_files_user_id 
  ON encrypted_files(user_id);

CREATE INDEX IF NOT EXISTS idx_encrypted_files_created_at 
  ON encrypted_files(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_encrypted_files_updated_at
  BEFORE UPDATE ON encrypted_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();