import { existsSync } from 'node:fs';

const publishedDataDirectory = new URL('../public/data/', import.meta.url);

if (!existsSync(publishedDataDirectory)) {
  throw new Error('public/data directory is missing. Create it before wiring artifact validation.');
}

console.log('Data-validation stub passed. SS-10 will replace this with Zod artifact validation.');
