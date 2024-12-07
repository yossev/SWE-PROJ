import { Controller, Get, Logger } from '@nestjs/common';
import { BackupService } from './backup.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('backup')
export class BackupController {
  private readonly logger = new Logger(BackupController.name);

  constructor(private readonly backupService: BackupService) {}

  // Endpoint to trigger the backup manually
  @Get('trigger')
  async triggerBackup() {
    this.logger.log('Manual backup triggered.');
    await this.backupService.backupData();
    return { message: 'Backup successfully triggered.' };
  }

  // Endpoint to list all existing backup files
  @Get('list')
  listBackups() {
    const backupPath = path.join(__dirname, '..', '..', 'backups');
    if (!fs.existsSync(backupPath)) {
      return { message: 'No backups found.' };
    }

    const files = fs.readdirSync(backupPath).map((file) => ({
      filename: file,
      path: path.join(backupPath, file),
    }));

    return { backups: files };
  }
}
