export const AddInput = (props: { index: number }) => {
  return (
    <div
      class="flex justify-between mb-1 w-full receipt-input-container"
      data-index={props.index}
    >
      <input
        type="text"
        name="items[${index}].productName"
        placeholder="Item Name"
        class="w-[50%] bg-primary-faded-black text-font-off-white pl-2"
      />
      <input
        type="text"
        name="items[${index}].quantity"
        placeholder="Quantity"
        class="w-[20%] bg-primary-faded-black text-font-off-white text-center"
      />
      <input
        type="text"
        name="items[${index}].costPerItem"
        placeholder="Price"
        class="w-[20%] bg-primary-faded-black text-font-off-white text-center"
      />
      <button type="button" class="flex items-center justify-center">
        <img
          src="/icons/delete.svg"
          alt="Delete item"
          class="h-6 w-6 ml-2 delete-item"
        />
      </button>
    </div>
  );
};
