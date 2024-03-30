import { ResultSet } from '@libsql/client/.';

export type OmitMultiple<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export function parseTable<T>(result: ResultSet): T[] {
  return result.rows.map((row) => {
    return Object.keys(row).reduce((object, key, index) => {
      if (index >= result.columns.length) return object;
      const rowName = result.columns[index];
      object[rowName] = row[key];
      return object;
    }, {} as any);
  }) as T[];
}
