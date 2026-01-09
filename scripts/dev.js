#!/usr/bin/env node

const { spawn } = require('child_process');
const net = require('net');

function findAvailablePort(startPort = 3000, maxPort = 3100) {
  return new Promise((resolve, reject) => {
    function checkPort(port) {
      if (port > maxPort) {
        reject(new Error(`No available port found between ${startPort} and ${maxPort}`));
        return;
      }

      const server = net.createServer();
      server.listen(port, () => {
        server.once('close', () => resolve(port));
        server.close();
      });
      server.on('error', () => {
        checkPort(port + 1);
      });
    }

    checkPort(startPort);
  });
}

async function startDev() {
  try {
    const port = await findAvailablePort(3000, 3100);
    console.log(`Starting Next.js dev server on port ${port}...`);
    
    const nextDev = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      stdio: 'inherit',
      shell: true,
    });

    nextDev.on('error', (error) => {
      console.error('Failed to start Next.js dev server:', error);
      process.exit(1);
    });

    nextDev.on('exit', (code) => {
      process.exit(code || 0);
    });

    process.on('SIGINT', () => {
      nextDev.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
      nextDev.kill('SIGTERM');
    });
  } catch (error) {
    console.error('Error finding available port:', error.message);
    process.exit(1);
  }
}

startDev();

