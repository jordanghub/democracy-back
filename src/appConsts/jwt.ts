import * as fs from 'fs';
import * as path from 'path';

export const JWT_SECRET = 'some-secret';

export const JWT_PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, '..', '..', 'keys', 'jwt.key'),
  'utf8',
);
export const JWT_PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, '..', '..', 'keys', 'jwt.key.pub'),
  'utf8',
);
