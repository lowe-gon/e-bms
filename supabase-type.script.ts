import { ENV } from '@/typings/env';
import { config } from 'dotenv';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Load variables from .env.local or .env
config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });

const projectId = ENV.SUPABASE_PROJECT_ID;

if (!projectId) {
  console.error('❌ Error: SUPABASE_PROJECT_ID is not defined in your .env or .env.local file.');
  process.exit(1);
}

console.log(`🔄 Generating Supabase types for project: ${projectId}...`);

try {
  // Generate types directly into src/typings/
  execSync(
    `npx supabase gen types typescript --project-id "${projectId}" --schema public > src/typings/database.types.ts`,
    { stdio: 'inherit' },
  );

  // Clean up any auto-generated 'supabase' folder at root
  const generatedFolder = path.resolve(process.cwd(), 'supabase');
  if (fs.existsSync(generatedFolder)) {
    fs.rmSync(generatedFolder, { recursive: true, force: true });
  }

  console.log('✅ Types successfully generated at src/typings/database.types.ts');
} catch (error) {
  console.error('❌ Failed to generate types:', error);
  process.exit(1);
}
