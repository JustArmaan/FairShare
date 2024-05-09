import { type CategoriesSchema } from '../../../../services/group.service';
import { type UserSchema } from '../../../../interface/types';
import { AddedMember } from './Member';

export const CreateGroup = ({
  categories,
  currentUser,
}: {
  categories: CategoriesSchema;
  currentUser: UserSchema;
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
      <div class="flex flex-col my-8">
        <label class="text-font-off-white justify-start bold">Group Name</label>
        <input
          class="py-1 px-4 justify-center items-center text-font-grey bg-primary-black rounded-lg mt-2"
          type="text"
          name="groupName"
          placeholder="Enter group name"
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
          {categories.map((category) => (
            <button
              type="button"
              data-category-id={category.id}
              class="category-button flex items-center p-2 mt-2 bg-card-black rounded-lg hover:bg-primary-faded-black focus:outline-none focus:ring-2 focus:ring-accent-blue w-full animation-fade-in"
            >
              <img
                src={category.icon}
                alt={`${category.name} icon`}
                class="h-6 w-6 mr-2"
              />
              <span class="text-font-off-white">{category.name}</span>
            </button>
          ))}
        </div>
        <label class="text-font-off-white justify-start font-bold mt-4 cursor-pointer">
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
        </div>
        {/* <label class="text-font-off-white justify-start bold mt-4">
          Select Tag
        </label>
        <input
          id="select-tag"
          class="justify-center items-center text-font-grey bg-primary-black rounded-lg mt-2"
          type="button"
          name="select-tag"
          value="Select Group Tag"
          placeholder="  Select Group Tag"
        /> */}
        <h1 class="text-font-off-white justify-start bold text-lg mt-4">
          Add Members
        </h1>
        <div
          id="members"
          class="bg-primary-black w-full rounded-lg flex p-6 flex-col text-xs justify-center items-center"
        >
          <div class="flex-col w-full">
            <AddedMember
              user={currentUser}
            />
            <div
              id="memberContainer"
              class="bg-primary-black w-full rounded-lg flex flex-col text-xs justify-center items-center"
            ></div>
          </div>

          <div
            id="addMemberForm"
            class="rounded-md w-full h-14 bg-accent-blue flex justify-center items-center p-2 hidden" // This is on purpose
          >
            <div class="flex w-full h-9">
              <input
                type="email"
                name="addEmail"
                class="text-font-black bg-pure-white/75 rounded-lg w-full flex justify-center p-2"
                placeholder="Enter member email"
              ></input>
              <button
                id="enterEmailButton"
                class="text-accent-blue bg-pure-white rounded-lg flex justify-center mx-1 items-center w-16"
                hx-get="/groups/addMember"
                hx-trigger="click"
                hx-include="[name='addEmail']"
                hx-swap="beforeend"
                hx-target="#memberContainer"
                hx-vals="js:{shouldSend: !isEmailDuplicated()}"
              >
                Invite
              </button>
            </div>
          </div>

          <button
            id="addMemberButton"
            class="rounded-lg w-24 h-8 bg-accent-blue justify-center text-font-off-white my-2"
          >
            Add
          </button>
          <div class="flex text-font-off-white items-center justify-center">
            <p class="mr-2 ">Temporary Group?</p>
            <img
              class="w-4 hidden"
              src="/activeIcons/info.svg"
              alt="Hover for more info"
            />
          </div>
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
            class="rounded-lg w-32 h-10 bg-accent-blue justify-center text-font-off-white text-sm mb-6"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
