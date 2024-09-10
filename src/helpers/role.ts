import { RoleCode } from '../database/model/Role.js';
import { RoleRequest } from 'app-request.js';
import { Response, NextFunction } from 'express';

export default (...roleCodes: RoleCode[]) =>
  (req: RoleRequest, res: Response, next: NextFunction) => {
    req.currentRoleCodes = roleCodes;
    next();
  };
