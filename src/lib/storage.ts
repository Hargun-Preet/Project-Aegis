export class StorageUtils {
  private static readonly PUBLIC_KEY_STORAGE = 'file_vault_public_key';
  
  // Store public key in localStorage
  static storePublicKey(publicKeyHex: string): void {
    localStorage.setItem(this.PUBLIC_KEY_STORAGE, publicKeyHex);
  }
  
  // Retrieve public key from localStorage
  static getPublicKey(): string | null {
    return localStorage.getItem(this.PUBLIC_KEY_STORAGE);
  }
  
  // Remove public key from localStorage
  static removePublicKey(): void {
    localStorage.removeItem(this.PUBLIC_KEY_STORAGE);
  }
  
  // Check if public key exists
  static hasPublicKey(): boolean {
    return this.getPublicKey() !== null;
  }
}