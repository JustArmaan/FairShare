import { type UserSchemaWithMemberType } from "../../../../interface/types";
import SelectIcon from "./SelectIcon";

interface Icon {
  icon: string;
  name: string;
}

export const CreateGroup = ({
  icons,
  colors,
  selectedIcon,
  selectedColor,
}: {
  currentUser: UserSchemaWithMemberType;
  icons: Icon[];
  colors: { name: string; bgClass: string }[];
  selectedIcon?: string;
  selectedColor?: string;
}) => {
  return (
    <div id="create-group-page" class="animate-fade-in">
      <div
        class="flex justify-start w-fit items-center mb-1 mt-[28px]"
        id="create-back-button"
      >
        <a
          hx-get="/groups/page"
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          hx-push-url="/groups/page"
          class="text-font-off-white text-4xl cursor-pointer"
        >
          <img
            src="/icons/arrow_back_ios.svg"
            alt="back arrow icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          />
        </a>
      </div>
      <div class="flex flex-col mt-[0.75rem]">
        <form>
          <div id="icon-group-container" class="flex">
            <div id="icon-preview" class="hidden mt-2 mr-3"></div>
            <div
              id="group-name-container"
              class="flex flex-col flex-grow w-full"
            >
              <label class="text-font-off-white font-bold">Group Name</label>
              <input
                class="px-4 py-2 justify-center items-center text-font-off-white bg-primary-black rounded-md mt-2 w-full"
                type="text"
                name="groupName"
                placeholder="Enter Group Name"
              />
            </div>
          </div>

          <label class="text-font-off-white justify-start semibold flex flex-col text-lg mt-[0.68rem]">
            Select Icon
          </label>
          <div
            id="select-group-icon-container"
            class="py-2 px-3  w-full h-fit flex justify-between bg-primary-black rounded-md mt-1"
          >
            <p class="text-primary-grey font-normal">Select Group Icon</p>
            <img
              src="/activeIcons/expand_more.svg"
              class="cursor-pointer w-[24px] aspect-square"
            />
          </div>
          <div
            id="select-group-icon-container-open"
            class="w-full h-fit bg-primary-black rounded-md mt-1 flex flex-col items-center animate-fade-in min-h-[50px] hidden"
          >
            <div
              id="select-group-icon-header"
              class="py-2 px-3 w-full h-fit flex justify-between"
            >
              <p class="text-primary-grey font-normal">Select Group Icon</p>
              <img
                src="/activeIcons/expand_more.svg"
                class="rotate-180 cursor-pointer"
              />
            </div>
            <hr class="border-t border-primary-dark-grey w-11/12 mx-auto px-2" />
            <SelectIcon
              icons={icons}
              colors={colors}
              selectedIcon={selectedIcon}
              selectedColor={selectedColor}
            />
          </div>

          <hr class="border-t border-primary-dark-grey w-full my-[1.5rem]"></hr>
          <input type="hidden" name="selectedIcon" id="selectedIcon" />
          <input type="hidden" name="selectedColor" id="selectedColor" />

          <div
            id="errorContainer"
            class="text-accent-red bg-opacity-10 border border-accent-red p-4 rounded shadow hidden text-center mt-4"
          ></div>

          <div class="flex justify-center items-center mt-3 mb-4">
            <button
              id="create-group-button"
              type="button"
              hx-post="/groups/create"
              hx-target="#app"
              hx-swap="innerHTML"
              class="rounded-md w-32 h-10 bg-accent-blue justify-center text-font-off-white text-sm"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
      <div class="mb-20"></div>
    </div>
  );
};

export default CreateGroup;
