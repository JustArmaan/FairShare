import type { UserSchema } from "../../../../interface/types";
import type { GroupWithMembers } from "../../../../services/group.service";
import { AddedMember } from "./Member";

const AddMembersComponent = ({
  group,
  currentUser,
  isEditMode = false,
}: {
  group?: GroupWithMembers;
  currentUser: UserSchema;
  isEditMode: boolean;
}) => {
  return (
    <div>
      <h1 class="text-font-off-white justify-start bold text-lg mt-4">
        Add Members
      </h1>
      <div
        id="members"
        class="bg-primary-black w-full rounded-lg flex p-6 flex-col text-xs justify-center items-center"
      >
        <div class="flex-col w-full">
          {isEditMode ? (
            <>
              <AddedMember user={{ ...currentUser, type: "Owner" }} />
              <div
                id="memberContainer"
                class="bg-primary-black w-full rounded-lg flex flex-col text-xs justify-center items-center"
              >
                {group?.members
                  .filter((member) => member.id !== currentUser.id) // Exclude current user
                  .map((member, index) => (
                    <>
                      {index !== group?.members.length && (
                        <div class="h-[1px] bg-primary-grey rounded w-full mb-2"></div>
                      )}
                      <AddedMember user={member} groupId={group?.id} />
                    </>
                  ))}
              </div>
            </>
          ) : (
            <AddedMember user={{ ...currentUser, type: "Owner" }} />
          )}
        </div>

        <div
          id="addMemberForm"
          class="rounded-md w-full h-14 bg-accent-blue flex justify-center items-center p-2 hidden"
        >
          <div class="flex w-full h-9">
            <input
              type="email"
              name="addEmail"
              class="text-font-black bg-pure-white/75 rounded-lg w-full flex justify-center p-2"
              placeholder="Enter member email"
            />
            <button
              id="enterEmailButton"
              class="text-accent-blue bg-pure-white rounded-lg flex justify-center mx-1 items-center w-16"
              hx-get={
                group
                  ? `/groups/addMember/${group ? group.id : ""}`
                  : "/groups/addMember"
              }
              hx-trigger="click"
              hx-include="[name='addEmail']"
              hx-swap="beforeend"
              hx-target="#memberContainer"
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
      </div>
    </div>
  );
};

export default AddMembersComponent;
