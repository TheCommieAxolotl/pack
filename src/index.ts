#!/usr/bin/env node

import { create, include } from './commands';
import { gap, wordmark } from './utils/logger';

console.clear();
await wordmark();
gap();

switch (process.argv[2]) {
    case 'create':
        create();
        break;
    case 'include':
        include();
        break;
    default:
        create();
}
