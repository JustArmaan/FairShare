import type { Item } from "../../../../services/plaid.service";

export const ItemPickerForm = (props: {
  items: Item[];
  selectedItemId: string;
  groupId?: string;
  itemId?: string;
}) => {
  return (
    <div class="picker-container">
      <div class="h-screen w-screen fixed top-0 left-0 bg-card-black opacity-80"></div>
      <div class="z-[9999999] fixed bottom-0 left-0 right-0 p-5 rounded-t-2xl shadow-lg bg-card-black">
        <form class="flex flex-col mb-0 mt-3 justify-center text-font-off-white  border-b-primary-dark-grey">
          <div class="bg-primary-black rounded-xl">
            {props.items.map((item, index) => (
              <>
                <div
                  class="w-full flex justify-between p-4 hover:opacity-80 cursor-pointer"
                  hx-get={
                    props.groupId
                      ? `/groups/addTransaction/default/${props.groupId}/${item.id}`
                      : `/home/page/${item.id}`
                  }
                  hx-swap="innerHTML"
                  hx-target="#app"
                  hx-push-url={
                    props.groupId
                      ? `/groups/addTransaction/default/${props.groupId}/${item.id}`
                      : `/home/page/${item.id}`
                  }
                >
                  <label>{item.institutionName}</label>
                  <input
                    type="radio"
                    class="radio-picker w-6 h-6 cursor-pointer"
                    checked={item.id === props.selectedItemId}
                  />
                </div>
                {index !== props.items.length - 1 && (
                  <div class="w-full h-px bg-primary-dark-grey rounded mb-2 opacity-75"></div>
                )}
              </>
            ))}
          </div>
          <button
            class="text-accent-blue mt-4  py-2 cursor-pointer bg-primary-black rounded-xl font-semibold text-lg"
            hx-trigger="click"
            hx-get="/empty"
            hx-target=".picker-container"
            hx-swap="outerHTML"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
