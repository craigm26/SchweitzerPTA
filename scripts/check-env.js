// Script to verify environment variables are set correctly
const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const supabaseKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  
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

  // Check API key
  if (supabaseKeyMatch) {
    const key = supabaseKeyMatch[1].trim();
    console.log('\n✓ NEXT_PUBLIC_SUPABASE_ANON_KEY found in .env.local');
    console.log(`  Key length: ${key.length} characters`);
    console.log(`  Key prefix: ${key.substring(0, 20)}...`);
    
    if (key.startsWith('eyJ')) {
      console.log('✓ Key format is valid (starts with "eyJ" - JWT format)');
    } else {
      console.error('✗ Key format is INVALID!');
      console.error('  The anon key should start with "eyJ" (JWT format)');
      console.error('  You may be using the service_role key instead of the anon key');
      console.error('  ⚠️  IMPORTANT: Use the "anon public" key, NOT the "service_role secret" key!');
      process.exit(1);
    }
    
    // Check if it might be service_role key (they're longer and have different structure)
    if (key.length > 200) {
      console.warn('⚠ WARNING: Key is unusually long. Make sure you copied the entire key correctly.');
    }
  } else {
    console.error('\n✗ NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local');
    console.error('  Please add it to your .env.local file');
    process.exit(1);
  }
} else {
  console.error('✗ .env.local file not found');
  console.error('  Please create a .env.local file in the project root with:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=https://mrptpsbzadthudiiazqr.supabase.co');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here');
  process.exit(1);
}

// Check if system environment variable is set (which would override .env.local)
const systemEnv = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (systemEnv && systemEnv !== 'https://mrptpsbzadthudiiazqr.supabase.co') {
  console.warn('\n⚠ WARNING: System environment variable is set and will override .env.local');
  console.warn(`  System value: ${systemEnv}`);
  console.warn('  This may cause issues. Consider removing it from system environment variables.');
}

console.log('\n✓ All environment variables are correctly configured!');
console.log('  Remember to restart your dev server after updating .env.local');
