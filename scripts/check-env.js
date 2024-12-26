import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../.env.local');

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const mistralKey = envContent.match(/VITE_MISTRAL_API_KEY=(.*)/)?.[1];
  
  if (!mistralKey) {
    console.error('❌ VITE_MISTRAL_API_KEY not found in .env.local');
    process.exit(1);
  }
  
  console.log('✅ VITE_MISTRAL_API_KEY found:', mistralKey.substring(0, 5) + '...');
} catch (error) {
  console.error('❌ Error reading .env.local:', error.message);
  process.exit(1);
} 