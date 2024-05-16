export const AddButton = () => {
  return (
    <div class="swap">
      <button
        class="absolute top-0 right-0 bg-font-off-white rounded-full p-2 cursor-pointer hover:-translate-y-0.5 transition-transform hover:opacity-80"
      >
        <img
          src="/icons/addTransaction.svg"
          alt="Plus Icon"
          class="w-4 text-primary-black-page"
        />
      </button>
    </div>
  );
};

export default AddButton;
