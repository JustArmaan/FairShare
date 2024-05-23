import type { AccountWithItem } from '../../../services/account.service';
import { getAllOwedForGroupTransactionWithMemberInfo } from '../../../services/owed.service';
import type { getTransaction } from '../../../services/transaction.service';
import type { ExtractFunctionReturnType } from '../../../services/user.service';
import { ProfileIcon } from '../../components/ProfileIcon';
import { formatDate } from '../transactions/components/Transaction';
import { AccountSelector } from './components/AccountSelector';

export const ViewAndPayPage = (props: {
  owed: ExtractFunctionReturnType<
    typeof getAllOwedForGroupTransactionWithMemberInfo
  >;
  transaction: ExtractFunctionReturnType<typeof getTransaction>;
  accounts: AccountWithItem[];
  groupId: string
}) => {
  return (
    <div class='p-6 text-font-off-white'>
      <form>
        <div>
          <h2 class='text-3xl'>
            Total:{' '}
            <span class='font-semibold'>
              ${props.transaction.amount.toFixed(2)}
            </span>
          </h2>
          <p class='text-xl mt-1'>
            {props.transaction.company &&
              (props.transaction.company.length > 20
                ? props.transaction.company.slice(0, 20) + '...'
                : props.transaction.company)}
          </p>
          <p class='text-xl mt-1'>
            {props.transaction.timestamp &&
              formatDate(props.transaction.timestamp)}
          </p>
        </div>
        <div class='mt-4 mb-2 flex items-center justify-between text-font-off-white'>
          <h3 class='text-2xl'>Member Breakdown</h3>
        </div>
        <div class='rounded-lg p-2 bg-primary-black text-xl'>
          <div class='py-2'>
            {props.owed
              .filter((owed) => owed.amount < 0)
              .map((owed) => {
                return (
                  <div class='flex items-center justify-between mx-6 py-2'>
                    <div class='flex items-center'>
                      <ProfileIcon user={owed.user} />
                      <p class='ml-4'>{owed.user.firstName}</p>
                    </div>
                    <p>
                      Transfer:{'  '}
                      <span class='font-semibold text-negative-number'>
                        -${owed.amount * -1}
                      </span>
                    </p>
                  </div>
                );
              })}
          </div>
          <div class='h-px bg-primary-dark-grey mx-4 my-2 rounded' />
          <div class='flex flex-row justify-end items-center mx-6 text-xl my-3'>
            <p>
              Total Transfer Out:{' '}
              <span class='text-negative-number font-semibold'>
                -$
                {props.owed
                  .filter((owed) => owed.amount < 0)
                  .map((owed) => owed.amount)
                  .reduce((acc, amount) => amount + acc, 0) * -1}
              </span>
            </p>
          </div>
        </div>
        <div class='mt-4 mb-2 flex items-center justify-between text-font-off-white'>
          <h3 class='text-2xl'>Select Account</h3>
        </div>
        <div
          class='h-80'
          hx-get={`/groups/account-selector/select?accountId=`}
          hx-trigger='load'
          hx-swap='outerHTML'
        ></div>
        <div class='mt-4 rounded-lg p-4 bg-primary-black text-xl flex flex-col'>
          <p>
            By clicking confirm, you authorize Fairshare to complete the listed
            transfers and resolve outstanding balances for this transaction.
          </p>
          <p class='font-semibold mt-4'>This action is irreversible.</p>
        </div>

        <input type='hidden' name='transactionId' value={props.transaction.id}/>
        <input type='hidden' name='groupId' value={props.groupId}/>

        <button
          hx-post='/transfer/initiate/transfer/sender'
          hx-trigger='click'
          class='hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform bg-accent-blue py-4 w-full rounded-2xl mt-8 font-semibold text-2xl'
        >
          Confirm and Transfer
        </button>
      </form>
    </div>
  );
};
