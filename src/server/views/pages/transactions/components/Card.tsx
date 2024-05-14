import type { AccountSchema } from '../../../../services/plaid.service';

export const Card = (props: { account: AccountSchema }) => {
  return (
    <div class="bg-primary-black text-font-off-white py-3 px-4 rounded-lg shadow-lg max-w-md mx-auto my-4">
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm text-font-off-white">Name:</span>
        <span class="text-lg font-semibold">
          {props.account.name && props.account.name}
        </span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-font-off-white">Balance:</span>
        <span class="text-lg font-semibold">${props.account.balance}</span>
      </div>
    </div>
  );
};

export default Card;
