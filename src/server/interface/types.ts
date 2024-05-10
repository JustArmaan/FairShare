import { findUser } from '../services/user.service';
import { getTransaction } from '../services/transaction.service';
import type { MemberTypeSchema } from '../services/group.service';

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type TransactionSchema = Awaited<ReturnType<typeof getTransaction>>;
export type UserSchema = NonNullable<Awaited<ReturnType<typeof findUser>>>;
export type UserSchemaWithMemberType = NonNullable<
  Awaited<ReturnType<typeof findUser>>
> &
  MemberTypeSchema;
