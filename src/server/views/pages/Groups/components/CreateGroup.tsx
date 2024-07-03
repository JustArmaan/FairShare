import { type UserSchemaWithMemberType } from "../../../../interface/types";
// import { AddedMember } from "./Member";
import { colors, createGroupNameInput } from "./EditGroup";
import AddMembersComponent from "./AddMemberForm";

interface Icon {
  id: string;
  icon: string;
  name: string;
}

export const CreateGroup = ({
  icons,
  currentUser,
}: {
  icons: Icon[];
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
      <div class="flex flex-col my-8 bg-primary-black bg-opacity-40 rounded-lg p-4">
        {createGroupNameInput()}
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
              data-category-id={icon.icon}
              class="category-button flex items-center p-2 mt-2 bg-card-black rounded-lg hover:bg-primary-faded-black focus:outline-none focus:ring-2 focus:ring-accent-blue w-full animation-fade-in"
            >
              <img
                src={icon.icon.replace(".", "")}
                alt={`${icon.name} icon`}
                class="h-6 w-6 mr-2"
              />
              <span class="text-font-off-white">{icon.name}</span>
            </button>
          ))}
        </div>
        <label class="text-font-off-white justify-start font-bold mt-4 cursor-pointer">
          Select Color
        </label>

        <input type="hidden" id="selectedColor" name="selectedColor" value="" />

        <div class="flex flex-wrap mt-2 gap-2">
          {colors.map((color) => (
            <button
              class={`color-button h-10 w-10 rounded-full ${color.bgClass}`}
              data-color={color.name}
            ></button>
          ))}
        </div>
        <AddMembersComponent currentUser={currentUser} isEditMode />
        <div class="flex text-font-off-white items-center justify-center">
          <p class="mr-2 ">Temporary Group?</p>
          <img
            class="w-4 hidden"
            src="/activeIcons/info.svg"
            alt="Hover for more info"
          />
        </div>
        <div class="flex text-font-off-white items-center justify-center">
          <input
            type="checkbox"
            name="temporaryGroup"
            id="temporaryGroup"
            class="ml-2 mt-2"
          />
        </div>
        <input
          type="hidden"
          name="selectedCategoryId"
          id="selectedCategoryId"
        />
        <input type="hidden" name="memberEmails" id="memberEmails" value="" />

        <div
          id="errorContainer"
          class="text-accent-red bg-opacity-10 border border-accent-red p-4 rounded shadow hidden text-center mt-4"
        ></div>

        <div class="flex justify-center items-center mt-3 mb-4">
          <button
            type="button"
            hx-post="/groups/create"
            hx-target="#app"
            hx-swap="innerHTML"
            hx-include="#selectedCategoryId, [name='groupName'], [name='temporaryGroup'], #memberEmails, #selectedColor"
            class="rounded-lg w-32 h-10 bg-accent-blue justify-center text-font-off-white text-sm mt-4"
          >
            Create Group
          </button>
        </div>
      </div>
      <div class="mb-20"></div>
    </div>
  );
};

export default CreateGroup;
