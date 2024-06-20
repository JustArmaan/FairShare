import { getDB } from '../database/client';
import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { ExtractFunctionReturnType } from './user.service';
import { type ArrayElement } from '../interface/types';

const db = getDB();

export function deleteItem() {
}
