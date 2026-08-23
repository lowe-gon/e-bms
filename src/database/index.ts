import { relations, sectorRelation } from '@/database/relation';
import { ENV } from '@/typings/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(ENV.DATABASE_URL!, { prepare: false });
const database = drizzle({ client, relations: { ...relations, ...sectorRelation }, logger: true });

export default database;
