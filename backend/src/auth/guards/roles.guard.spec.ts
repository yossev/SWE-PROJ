/* eslint-disable prettier/prettier */
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  it('should allow access if roles match', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'admin' } }),
      }),
    } as any;

    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should deny access if roles do not match', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'student' } }),
      }),
    } as any;

    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    expect(rolesGuard.canActivate(context)).toBe(false);
  });
});
