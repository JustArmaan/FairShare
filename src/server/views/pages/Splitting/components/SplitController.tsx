import { ProfileIcon } from "../../../components/ProfileIcon";

export const SplitController = (props: {
  user: {
    id: string;
    firstName: string;
    lastName: string | null;
    color: string;
  };
  transactionOwnerName: string;
  amount: number;
}) => {
  return (
    <>
      <div class="bg-second-black-background rounded-md p-2 mt-4">
        <p class="ml-2.5 mt-4">Split Equally: </p>
        <div class="mt-2 p-[1rem] bg-primary-black rounded-sm flex flex-row items-center justify-between">
          <div class="flex flex-row w-fit justify-between items-center">
            <ProfileIcon class="h-8 w-8" user={props.user} textSize="text-md" />
            <div class="flex flex-row w-fit h-fit ml-4">
              <p>{props.user.firstName}</p>
              <div class="flex flex-row h-[0.8125rem] w-[2.125rem] bg-accent-purple rounded-[0.250rem] self-center justify-center items-center ml-[0.8rem]">
                <p class="font-normal text-font-off-white text-[0.625rem] text-center">
                  You
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-row items-center">
            <p>
              Owe {props.transactionOwnerName}
              <span class="text-negative-number font-semibold">
                {" "}
                ${Math.abs(props.amount).toFixed(2)}
              </span>
            </p>
            <img
              class="-rotate-90 w-3.5 aspect-square relative bottom-[4px] ml-2"
              src="/icons/arrow_back_ios.svg"
            />
          </div>
        </div>
        <div
          class="mt-6 flex flex-col items-center"
          id="link-transfer-container"
        >
          <button
            hx-get="/split/linkTransferComponent?open=true"
            hx-swap="outerHTML settle:0ms"
            hx-target="#link-transfer-container"
            class="flex flex-row items-center cursor:pointer hover:opacity-80"
          >
            <img class="mr-1 h-[18px]" src="/icons/link-transaction.svg" />
            <p class="text-font-grey">Link Transfer</p>
          </button>
          <button class="bg-accent-blue py-2 w-full rounded-md mt-3 mb-4 hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform">
            <p class="text-lg">Settle</p>
          </button>
        </div>
      </div>
      <div id="link-transfer-target" />
    </>
  );
};
