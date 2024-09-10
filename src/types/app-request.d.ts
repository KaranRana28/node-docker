import { Request } from 'express';
import User from '../database/model/User.js';
import Keystore from '../database/model/Keystore.js';
import ApiKey from '../database/model/ApiKey.js';

declare interface PublicRequest extends Request {
  apiKey: ApiKey;
}

declare interface RoleRequest extends PublicRequest {
  currentRoleCodes: string[];
}

declare interface ProtectedRequest extends RoleRequest {
  user: User;
  accessToken: string;
  keystore: Keystore;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}
