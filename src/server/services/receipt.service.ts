import { getDB } from "../database/client";
import { transactionReceipt } from "../database/schema/transactionReceipt";
import { receiptLineItem } from "../database/schema/receiptLineItem";
import { eq } from "drizzle-orm";
import type { ExtractFunctionReturnType } from "./user.service";
import type { ArrayElement } from "../interface/types";

const db = getDB();

export async function getReceipt(id: string) {
  const results = await db
    .select()
    .from(transactionReceipt)
    .where(eq(transactionReceipt.id, id));

  return results;
}

export type Receipt = ExtractFunctionReturnType<typeof getReceipt>;

export async function createReceipt(receipt: Receipt) {
  const result = await db
    .insert(transactionReceipt)
    .values(receipt)
    .returning();

  return result[0];
}

export async function getReceiptLineItems(receiptId: string) {
  const results = await db
    .select()
    .from(receiptLineItem)
    .where(eq(receiptLineItem.transactionReceiptId, receiptId));

  return results;
}

export type ReceiptLineItems = ExtractFunctionReturnType<
  typeof getReceiptLineItems
>;

export type ReceiptLineItem = ArrayElement<ReceiptLineItems>;

export async function createReceiptLineItems(
  receiptLineItems: ReceiptLineItems
) {
  let results;

  receiptLineItems.forEach(async (item) => {
    let result = await db.insert(receiptLineItem).values(item).returning();
    results.push(result[0]);
  });

  return results;
}
