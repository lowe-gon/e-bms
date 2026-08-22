import * as schema from '@/database/schema';
import { defineRelations } from 'drizzle-orm';

export const relations = defineRelations(schema, (r) => ({}));
