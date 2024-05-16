import { type UserSchema } from "../../../../interface/types";
import { AddedMember } from "./Member";
import { getGroupWithMembers } from "../../../../services/group.service";



export const AddTransaction = ({
    currentUser,
    groupId,
  }: {
    currentUser: UserSchema;
    groupId: string;
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
        </div>
    )
  };
  
  export default AddTransaction;
  