import { type UserSchemaWithMemberType } from "../../../../interface/types";

export const CreateGroup = ({
  currentUser,
}: {
  currentUser: UserSchemaWithMemberType;
}) => {
  return (
    <div class="animate-fade-in">
      <div class="flex justify-start w-fit items-center mb-1 mt-[28px]">
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
          <label class="text-font-off-white justify-start semibold text-lg">
            Group Name
          </label>
          <input
            class="py-2 px-4 justify-center items-center text-primary-grey font-normal bg-primary-black rounded-md mt-1 w-full placeholder-primary-grey placeholder-font-light "
            type="text"
            name="groupName"
            placeholder="Enter Group Name"
          />

          <label class="text-font-off-white justify-start semibold flex flex-col text-lg mt-[0.68rem]">
            Select Icon
          </label>
          <div
            id="select-group-icon"
            hx-get="/groups/selectIcon"
            hx-trigger="click"
            hx-swap="outerHTML"
            hx-target="#select-group-icon"
            class="py-2 px-3  w-full h-fit flex justify-between bg-primary-black rounded-md mt-1"
          >
            <p class="text-primary-grey font-normal">Select Group Icon</p>
            <img src="/activeIcons/expand_more.svg" />
          </div>

          {/* <div class="flex justify-center mt-[1.38rem]">
            <div class="relative h-fit w-56 py-2 px-6 bg-primary-black rounded-md flex items-center">
              <div class="flex items-center text-font-off-white">
                <p class="mr-2">Temporary Group</p>
                <input
                  type="checkbox"
                  name="temporaryGroup"
                  id="temporaryGroup"
                  class="rounded-sm border border-accent-blue"
                />
              </div>
              <img
                class="w-4 absolute top-2 right-2"
                src="/activeIcons/info.svg"
                alt="Hover for more info"
              />
            </div>
          </div> */}

          <hr class="border-t border-primary-dark-grey w-full my-[1.5rem]"></hr>
          <input type="hidden" name="selectedIcon" id="selectedIcon" />
          <input type="hidden" name="selectedColor" id="selectedColor" />

          {/* 
          <AddMembersComponent currentUser={currentUser} isEditMode />
          <div class="flex text-font-off-white items-center justify-center">
            <p class="mr-2 ">Temporary Group?</p>
            <img
              class="w-4 hidden"
              src="/activeIcons/info.svg"
              alt="Hover for more info"
            />
          </div>
        
          <input type="hidden" name="memberEmails" id="memberEmails" value="" /> */}

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
