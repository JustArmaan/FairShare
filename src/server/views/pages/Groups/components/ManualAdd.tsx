import { type UserSchemaWithMemberType } from "../../../../interface/types";
import { type CategoriesSchema } from "../../../../services/group.service";

export const CreateTransaction = ({
  icons,
  groupId,
  currentUser,
}: {
  icons: CategoriesSchema;
  groupId: string;
  currentUser: UserSchemaWithMemberType;
}) => {
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex justify-start w-fit items-center mb-1">
        <a
          hx-get="/groups/page"
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          class="text-font-off-white text-4xl cursor-pointer"
        >
          <img
            src="/icons/arrow_back_ios.svg"
            alt="back arrow icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          />
        </a>
      </div>
      <div class="flex flex-col my-8 bg-primary-black bg-opacity-40 rounded-lg p-4">
        <label class="text-font-off-white justify-start bold pb-2">
          Transaction Name
        </label>
        <input
          class="py-1 px-4 justify-center items-center text-font-grey bg-primary-black rounded-lg mt-2"
          type="text"
          name="transactionName"
          id="transactionName"
          placeholder="Enter Transaction Name"
        />
        <label class="text-font-off-white justify-start bold">
          Transaction Amount
        </label>
        <input
          class="py-1 px-4 justify-center items-center text-font-grey bg-primary-black rounded-lg mt-2"
          type="number"
          name="transactionAmount"
          id="transactionAmount"
          placeholder="Enter Transaction Amount"
        />
        <label class="text-font-off-white justify-start bold mt-4 cursor-pointer">
          Select Icon
        </label>
        <input
          id="select-icon"
          class="hover:opacity-80 pointer-cursor py-1 px-4 justify-center items-center text-font-grey bg-primary-black rounded-lg mt-2"
          type="button"
          name="select-icon"
          value="Select Group Icon"
          placeholder="Select Group Icon"
        />
        <div id="selected-icon" class=""></div>
        <div id="categoriesContainer" class="hidden">
          {icons.map((icon) => (
            <button
              type="button"
              data-category-id={icon.id}
              class="category-button flex items-center p-2 mt-2 bg-card-black rounded-lg hover:bg-primary-faded-black focus:outline-none focus:ring-2 focus:ring-accent-blue w-full animation-fade-in"
            >
              <img
                src={icon.icon}
                alt={`${icon.displayName} icon`}
                class="h-6 w-6 mr-2"
              />
              <span class="text-font-off-white">{icon.displayName}</span>
            </button>
          ))}
        </div>
        {/* <label class="text-font-off-white justify-start font-bold mt-4 cursor-pointer">
          Select Color
        </label>

        <input type="hidden" id="selectedColor" name="selectedColor" value="" />

        <div class="flex flex-wrap mt-2 gap-2">
          <button
            class="color-button h-10 w-10 rounded-full bg-accent-blue"
            data-color="accent-blue"
          ></button>
          <button
            class="color-button h-10 w-10 rounded-full bg-accent-purple"
            data-color="accent-purple"
          ></button>
          <button
            class="color-button h-10 w-10 rounded-full bg-accent-red"
            data-color="accent-red"
          ></button>
          <button
            class="color-button h-10 w-10 rounded-full bg-accent-yellow"
            data-color="accent-yellow"
          ></button>
          <button
            class="color-button h-10 w-10 rounded-full bg-accent-green"
            data-color="accent-green"
          ></button>
          <button
            class="color-button h-10 w-10 rounded-full bg-positive-number"
            data-color="positive-number"
          ></button>
          <button
            class="color-button h-10 w-10 rounded-full bg-negative-number"
            data-color="negative-number"
          ></button>
          <button
            class="color-button h-10 w-10 rounded-full bg-card-red"
            data-color="card-red"
          ></button>
          <div class="ring-2 ring-offset-2 ring-accent-blue hidden"></div>
        </div> */}
        <input
          type="hidden"
          name="selectedCategoryId"
          id="selectedCategoryId"
        />

        <div
          id="errorContainer"
          class="text-accent-red bg-opacity-10 border border-accent-red p-4 rounded shadow hidden text-center mt-4"
        ></div>

        <div class="flex justify-center items-center mt-3 mb-4">
          <button
            type="button"
            hx-post={`/transactions/createTransaction/${groupId}`}
            hx-target="#app"
            hx-swap="innerHTML"
            hx-include="#selectedCategoryId, [name='transactionName'], [name='transactionAmount'], #selectedColor"
            class="rounded-lg w-32 h-10 bg-accent-blue justify-center text-font-off-white text-sm mt-4"
          >
            Create Transaction
          </button>
        </div>
      </div>
      <div class="mb-20"></div>
    </div>
  );
};

export default CreateTransaction;
