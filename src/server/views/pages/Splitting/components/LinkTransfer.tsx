import { getItemsWithAllTransactions } from "../../../../services/transaction.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";
import { TransactionSelector } from "./TransactionSelector";

export type ItemsWithTransactions = ExtractFunctionReturnType<
  typeof getItemsWithAllTransactions
>;

export const LinkTransfer = (props: {
  items: ItemsWithTransactions;
  selectedItemId: string;
}) => {
  const selectedIndex =
    props.selectedItemId !== "default" &&
    props.items.findIndex((entry) => entry.item.id === props.selectedItemId);

  return (
    <div id="link-transfer-dropdown">
      <div class="rounded-md bg-primary-faded-black bg-opacity-75">
        {props.items.map((item, index) => {
          const selected = selectedIndex === index;

          return (
            <>
              <div
                class={`flex flex-row justify-between items-center hover:opacity-80 cursor-pointer border-b-primary-grey ${index !== props.items.length - 1 && "border-b"} px-5 py-3
                ${selected ? "-mt-px" : ""}
                `}
                hx-get={`/split/splitController/${item.item.id}`}
                hx-swap="outerHTML"
                hx-trigger="click"
                hx-target="#link-transfer-dropdown"
              >
                {" "}
                <p class={selected ? "font-semibold" : ""}>
                  {item.item.institutionName}
                </p>{" "}
                <div
                  class={`rounded-full aspect-square my-px border ${selected ? "border-accent-blue border-[0.47rem] h-[25px]" : "border-font-grey h-6"}
                `}
                />
              </div>
            </>
          );
        })}
      </div>
      {selectedIndex !== -1 && selectedIndex !== false ? (
        <TransactionSelector
          itemWithTransactions={props.items[selectedIndex]}
          selectedTransactionId={null}
        />
      ) : (
        <button class="bg-primary-dark-grey text-font-grey py-2 w-full rounded-md mt-8 mb-4 cursor-default">
          <p class="text-lg">Settle</p>
        </button>
      )}
    </div>
  );
};
