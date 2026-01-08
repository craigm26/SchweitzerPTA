// Script to verify environment variables are set correctly
const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  
  if (supabaseUrlMatch) {
    const url = supabaseUrlMatch[1].trim();
    const expectedUrl = 'https://mrptpsbzadthudiiazqr.supabase.co';
    
    if (url === expectedUrl) {
      console.log('✓ .env.local has correct Supabase URL');
      console.log(`  URL: ${url}`);
    } else {
      console.error('✗ .env.local has incorrect Supabase URL');
      console.error(`  Found: ${url}`);
      console.error(`  Expected: ${expectedUrl}`);
      process.exit(1);
    }
  } else {
    console.error('✗ NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
    process.exit(1);
  }
} else {
  console.error('✗ .env.local file not found');
  process.exit(1);
}

// Check if system environment variable is set (which would override .env.local)
const systemEnv = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (systemEnv && systemEnv !== 'https://mrptpsbzadthudiiazqr.supabase.co') {
  console.warn('⚠ WARNING: System environment variable is set and will override .env.local');
  console.warn(`  System value: ${systemEnv}`);
  console.warn('  This may cause issues. Consider removing it from system environment variables.');
}

