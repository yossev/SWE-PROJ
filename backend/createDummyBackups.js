// createDummyBackups.js
const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, '..', '..', 'backups');

// Create backups directory if it doesn't exist
if (!fs.existsSync(backupPath)) {
  fs.mkdirSync(backupPath);
}

// Create dummy backup files
for (let i = 1; i <= 5; i++) {
  const fileName = `backup_file_${i}.txt`;
  fs.writeFileSync(path.join(backupPath, fileName), `This is dummy backup data for file ${i}.`);
}

console.log('Dummy backup files created successfully.');