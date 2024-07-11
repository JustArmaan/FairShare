const LinkTransactionDetails = (props: {
  amount: number;
  accountDetails?: string | null;
  totalOwed?: number;
}) => {
  return (
    <div class="w-full bg-primary-black p-4 rounded-lg mb-[2rem]">
      <p class="text-font-off-white mb-2">
        Paid by: You{" "}
        <span class="text-font-off-white">(${props.amount.toFixed(2)})</span>
      </p>
      {props.accountDetails ? (
        <>
          <p class="text-font-grey mb-2">with {props.accountDetails}</p>
          {props.totalOwed && (
            <p class="text-positive-number font-semibold">
              Total Owed: ${props.totalOwed.toFixed(2)}
            </p>
          )}
        </>
      ) : (
        <div class="flex">
          <img src="/activeIcons/link.svg" alt="link" class="mr-1" />
          <p class="text-font-grey">link transaction</p>
        </div>
      )}
    </div>
  );
};

export default LinkTransactionDetails;
