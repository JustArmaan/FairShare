import { getItemsWithAllTransactions } from "../../../../services/transaction.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";
import { TransactionSelector } from "./TransactionSelector";

export type ItemsWithTransactions = ExtractFunctionReturnType<
  typeof getItemsWithAllTransactions
>;

export const LinkTransfer = (props: {
  items: ItemsWithTransactions;
  selectedItemId: string;
  owedAmount: number;
  owedId: string;
}) => {
  const selectedIndex =
    props.selectedItemId !== "default" &&
    props.items.findIndex((entry) => entry.item.id === props.selectedItemId);

  return (
    <div id="link-transfer-dropdown">
      <div class="rounded-sm bg-primary-faded-black bg-opacity-75">
        {props.items.map((item, index) => {
          const selected = selectedIndex === index;

          return (
            <>
              <div
                class={`flex flex-row justify-between items-center hover:opacity-80 cursor-pointer border-b-primary-dark-grey border-b-[2px] px-5 py-3
                ${selected ? "-mt-px" : ""}
                `}
                hx-get={`/split/splitController/${item.item.id}?owedAmount=${props.owedAmount}&owedId=${props.owedId}`}
                hx-swap="outerHTML"
                hx-trigger="click"
                hx-target="#link-transfer-dropdown"
              >
                <p class={selected ? "font-semibold" : ""}>
                  {item.item.institutionName}
                </p>
                <div
                  class={`rounded-full aspect-square my-px border ${selected ? "border-accent-blue border-[0.47rem] h-[25px]" : "border-font-grey h-6"}
                `}
                />
              </div>
            </>
          );
        })}
        <div
          class={`flex flex-row justify-between items-center hover:opacity-80 cursor-pointer border-b-primary-grey px-5 py-3
                ${props.selectedItemId === "cash" ? "-mt-px" : ""}
                `}
          hx-get={`/split/splitController/cash?owedAmount=${props.owedAmount}?owedAmount=${props.owedAmount}&owedId=${props.owedId}`}
          hx-swap="outerHTML"
          hx-trigger={props.selectedItemId === "cash" ? "none" : "click"}
          hx-target="#link-transfer-dropdown"
        >
          <p class={props.selectedItemId === "cash" ? "font-semibold" : ""}>
            Cash
          </p>
          <div
            class={`rounded-full aspect-square my-px border ${props.selectedItemId === "cash" ? "border-accent-blue border-[0.47rem] h-[25px]" : "border-font-grey h-6"}`}
          />
        </div>
      </div>
      {selectedIndex !== -1 && selectedIndex !== false ? (
        <TransactionSelector
          itemWithTransactions={props.items[selectedIndex]}
          selectedTransactionId={null}
          owedAmount={props.owedAmount}
          owedId={props.owedId}
        />
      ) : props.selectedItemId === "cash" ? (
        <>
          <div>
            <div class="flex flew-row justify-between items-center mt-4 ml-2 mb-2">
              <p>Enter Amount:</p>
            </div>
            <div class="bg-primary-black w-full h-36 rounded-sm flex flex-row items-center justify-center">
              <p class="text-4xl w-fit flex flex-row font-semibold text-center justify-center">
                $<span id="hide"></span>
                <input
                  id="txt"
                  class="bg-primary-black outline-none [all:unset] w-fit text-center pr-2"
                  value={Math.abs(props.owedAmount).toFixed(2)}
                  min={Math.abs(props.owedAmount).toFixed(2)}
                />
              </p>
            </div>
          </div>
          <button
            hx-post={`/split/settle`}
            hx-vals={`{
              "type": "cash",
              "owedId": "${props.owedId}"
              }`}
            hx-swap="outerHTML"
            hx-trigger="click"
            class="bg-accent-blue hover:-translate-y-0.5 pointer hover:transition-transform rotate-[0.00001deg] py-2 w-full rounded-md mt-8 mb-4"
          >
            <p class="text-lg">Request Confirmation</p>
          </button>
        </>
      ) : (
        <button class="bg-primary-dark-grey text-font-grey py-2 w-full rounded-md mt-8 mb-4 cursor-default">
          <p class="text-lg">Request Confirmation</p>
        </button>
      )}
    </div>
  );
};
