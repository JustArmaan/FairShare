import { findUser } from "../services/user.service";
import { getTransaction } from "../services/transaction.service";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;


export type ITransaction = Awaited<ReturnType<typeof getTransaction>>;
export type IUser = Awaited<ReturnType<typeof findUser>>;

