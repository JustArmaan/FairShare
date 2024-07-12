import { v4 as uuidv4 } from "uuid";
import {
  createCashAccount,
  getCashAccountForUser,
} from "../services/transaction.service";
import { getAccountTypeIdByName } from "../services/accountType.service";
import { addAccount } from "../services/account.service";

export async function getOrCreateCashAccountForUser(userId: string) {
  let cashAccount = await getCashAccountForUser(userId);

  if (!cashAccount) {
    const accountType = await getAccountTypeIdByName("cash");
    if (!accountType) {
      throw new Error("Cash account type not found");
    }

    const newAccount = await addAccount({
      id: uuidv4(),
      name: "Cash Account",
      accountTypeId: accountType.id,
      currencyCodeId: null,
    });

    if (!newAccount) {
      throw new Error("Failed to create cash account");
    }

    await createCashAccount({ userId, account_id: newAccount.id });

    cashAccount = await getCashAccountForUser(userId);
  }

  return cashAccount;
}
