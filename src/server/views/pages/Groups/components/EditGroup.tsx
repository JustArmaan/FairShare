import { type CategoriesSchema } from "../../../../services/group.service";
import { type UserSchema } from "../../../../interface/types";
import { AddedMember } from "./Member";
import { getGroupWithMembers } from "../../../../services/group.service";

export type UserGroupSchema = NonNullable<
  Awaited<ReturnType<typeof getGroupWithMembers>>
>;

export const EditGroupPage = ({
  categories,
  currentUser,
  group,
}: {
  categories: CategoriesSchema;
  currentUser: UserSchema;
  group: UserGroupSchema;
}) => {
  const colors = [
    { name: "accent-blue", bgClass: "bg-accent-blue" },
    { name: "accent-purple", bgClass: "bg-accent-purple" },
    { name: "accent-red", bgClass: "bg-accent-red" },
    { name: "accent-yellow", bgClass: "bg-accent-yellow" },
    { name: "accent-green", bgClass: "bg-accent-green" },
    { name: "positive-number", bgClass: "bg-positive-number" },
    { name: "negative-number", bgClass: "bg-negative-number" },
    { name: "card-red", bgClass: "bg-card-red" },
  ];

  function findMatchedCategory(
    categoryId: string,
    groupIcon: string,
    categories: CategoriesSchema
  ) {
    const selectedCategory = categories.find(
      (category) => category.id === categoryId
    );
    if (selectedCategory && selectedCategory.id === groupIcon) {
      return (
        <div id="selected-icon">
          <button
            type="button"
            data-category-id={selectedCategory.id}
            class="flex items-center p-2 mt-2 bg-card-black rounded-lg hover:bg-primary-faded-black focus:outline-none focus:ring-2 focus:ring-accent-blue w-full animation-fade-in"
          >
            <img
              src={selectedCategory.icon}
              alt={`${selectedCategory.name} icon`}
              class="h-6 w-6 mr-2"
            />
            <span class="text-font-off-white">{selectedCategory.name}</span>
          </button>
        </div>
      );
    }
    return <div id="selected-icon" class=""></div>;
  }

  return (
    <div class="p-6 animate-fade-in">
      <div class="flex justify-start w-fit items-center mb-1">
        <a
          hx-get="/home/page"
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          class="text-font-off-white text-4xl cursor-pointer"
          hx-push-url="true"
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
          class="justify-center items-center text-font-grey bg-primary-black rounded-lg mt-2"
          type="text"
          name="groupName"
          value={group.name}
        />
        <label class="text-font-off-white justify-start bold mt-4 cursor-pointer">
          Select Icon
        </label>
        <input
          id="select-icon"
          class="justify-center items-center text-font-grey bg-primary-black rounded-lg mt-2"
          type="button"
          name="select-icon"
          value="Change Group Icon"
          placeholder="  Select Group Icon"
        />
        {categories.map((category) => (
          <div>{findMatchedCategory(category.id, group.icon, categories)}</div>
        ))}
        <div id="categoriesContainer" class="hidden">
          {categories.map((category) => (
            <div>
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
            </div>
          ))}
        </div>

        <label class="text-font-off-white justify-start font-bold mt-4 cursor-pointer">
          Select Color
        </label>

        <input type="hidden" id="selectedColor" name="selectedColor" value="" />

        <div class="flex flex-wrap mt-2 gap-2">
          {colors.map((color) => (
            <button
              class={`color-button h-10 w-10 rounded-full ${color.bgClass} ${
                group.color === color.name
                  ? "ring-2 ring-offset-2 ring-accent-blue"
                  : ""
              }`}
              data-color={color.name}
            ></button>
          ))}
        </div>
        <h1 class="text-font-off-white justify-start bold text-lg mt-4">
          Add Members
        </h1>
        <div
          id="members"
          class="bg-primary-black w-full rounded-lg flex p-6 flex-col text-xs justify-center items-center"
        >
          <div class="flex-col w-full">
            <div
              id="memberContainer"
              class="bg-primary-black w-full rounded-lg flex flex-col text-xs justify-center items-center"
            >
              {group.members.map((member) => {
                return (
                  <AddedMember
                    user={{
                      type: "member",
                      id: member.email,
                      firstName: member.firstName,
                      email: member.email,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div
            id="addMemberForm"
            class="rounded-md w-full h-14 bg-accent-blue flex justify-center items-center p-2 hidden mt-2"
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
          <div class="flex text-font-off-white">
            <p class="mr-2 mt-3">Temporary Group?</p>
            <img src="/activeIcons/info.svg" alt="Hover for more info" />
          </div>
          <input
            type="checkbox"
            name="temporaryGroup"
            id="temporaryGroup"
            class="ml-2 mt-2"
            checked={group.temporary.toString() === "true"}
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
        <div
          id="success-container"
          class="text-positive-number bg-opacity-10 border border-positive-number p-4 rounded shadow hidden text-center mt-4"
        ></div>
        <div class="flex justify-center items-center mt-3 mb-4">
          <button
            type="button"
            hx-post={`/groups/edit/${group.id}`}
            hx-target="#success-container"
            hx-swap="innerHTML"
            hx-include="#selectedCategoryId, [name='groupName'], [name='temporaryGroup'], #memberEmails, #selectedColor"
            class="rounded-lg w-32 h-10 bg-accent-blue justify-center text-font-off-white text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGroupPage;
