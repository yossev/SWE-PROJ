/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-expressions */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.user && req.user.role) {
      req.role = req.user.role;
    }
    next();
  }
}
