import type { AccountSchema } from '../../../../services/plaid.service';

export const Card = (props: { account: AccountSchema }) => {
  return (
    <div class="bg-primary-black text-font-off-white py-3 px-4 rounded-lg shadow-lg  my-4">
      <div class="flex justify-between items-center mb-4">
        <span class="text-font-off-white">Name:</span>
        <span class="text-lg font-semibold">
          {props.account.name && props.account.name}
        </span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-font-off-white">Balance:</span>
        <span class="text-lg font-semibold">
            ${parseFloat(props.account.balance!).toFixed(2)}
</span>
      </div>
    </div>
  );
};

export default Card;
