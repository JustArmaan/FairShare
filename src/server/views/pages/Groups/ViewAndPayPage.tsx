import { getAllOwedForGroupTransactionWithMemberInfo } from '../../../services/owed.service';
import type { getTransaction } from '../../../services/transaction.service';
import type { ExtractFunctionReturnType } from '../../../services/user.service';

export const ViewAndPayPage = (props: {
  owed: ExtractFunctionReturnType<
    typeof getAllOwedForGroupTransactionWithMemberInfo
  >;
  transaction: ExtractFunctionReturnType<typeof getTransaction>;
}) => {
  return (
    <div class="p-6">
      <div>
        <h2>Total: {props.transaction.amount}</h2>
      </div>
    </div>
  );
};
