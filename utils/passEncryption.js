import { pbkdf2Sync } from 'crypto';

const hashPswd = (pwd) => pbkdf2Sync(pwd, 'salt', 100000, 64, 'sha1');

export default hashPswd;
