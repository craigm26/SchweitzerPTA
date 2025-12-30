const { execSync } = require('child_process');
const os = require('os');

const platform = os.platform();
const arch = os.arch();

console.log(`Installing native dependencies for ${platform}-${arch}...`);

const packages = [];

if (platform === 'win32' && arch === 'x64') {
  packages.push(
    '@tailwindcss/oxide-win32-x64-msvc@4.1.18',
    'lightningcss-win32-x64-msvc@1.30.2'
  );
} else if (platform === 'linux' && arch === 'x64') {
  packages.push(
    '@tailwindcss/oxide-linux-x64-gnu@4.1.18',
    'lightningcss-linux-x64-gnu@1.30.2'
  );
} else if (platform === 'darwin' && arch === 'arm64') {
  packages.push(
    '@tailwindcss/oxide-darwin-arm64@4.1.18',
    'lightningcss-darwin-arm64@1.30.2'
  );
} else if (platform === 'darwin' && arch === 'x64') {
  packages.push(
    '@tailwindcss/oxide-darwin-x64@4.1.18',
    'lightningcss-darwin-x64@1.30.2'
  );
}

if (packages.length > 0) {
  console.log(`Installing: ${packages.join(', ')}`);
  try {
    execSync(`npm install ${packages.join(' ')} --no-save`, { 
      stdio: 'inherit',
      env: { ...process.env, npm_config_ignore_scripts: 'true' }
    });
    console.log('Native dependencies installed successfully!');
  } catch (error) {
    console.error('Failed to install native dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log(`No native dependencies configured for ${platform}-${arch}`);
}

