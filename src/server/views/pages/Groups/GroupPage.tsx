import { getGroupsAndAllMembersForUser } from "../../../services/group.service";
import type { ExtractFunctionReturnType } from "../../../services/user.service";
import type { ArrayElement } from "../transactions/components/Transaction";
import { GroupItem } from "./components/GroupItem";

export type Groups = ExtractFunctionReturnType<
  typeof getGroupsAndAllMembersForUser
>;

type OwedSum = { owedAmount: number; flags: { owed: boolean; owing: boolean } };

type GroupsWithOwedSum = (ArrayElement<
  ExtractFunctionReturnType<typeof getGroupsAndAllMembersForUser>
> &
  OwedSum)[];

export const GroupPage = (props: {
  edit?: boolean;
  groups: GroupsWithOwedSum;
}) => {
  return (
    <div class="mx-lg-separator animate-fade-in mt-[2.31rem]">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-font-off-white">My Groups</h2>
        {props.edit ? (
          <button
            hx-get="/groups/page"
            hx-target="#app"
            hx-trigger="click"
            hx-swap="innerHTML"
            hx-push-url="/groups/page"
          >
            <div class="cursor-pointer h-full text-font-off-white">
              <svg
                width="16"
                height="16"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.35235 16.7524L0.33667 14.7391L6.43079 8.65217L0.33667 2.56521L2.35235 0.551895L8.44647 6.63885L14.5406 0.551895L16.5563 2.56521L10.4622 8.65217L16.5563 14.7391L14.5406 16.7524L8.44647 10.6655L2.35235 16.7524Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </button>
        ) : (
          <button
            hx-get="/groups/edit"
            hx-target="#app"
            hx-swap="innerHTML"
            hx-trigger="click"
            hx-push-url="/groups/edit"
            class={props.groups.length === 0 ? "hidden" : ""}
          >
            <p class="text-font-grey font-[400] text-[0.875rem] mr-[0.25rem]">
              Edit
            </p>
          </button>
        )}
      </div>
      <div class="mt-semi-separator">
        {props.groups.length === 0 && (
          <p class="text-font-off-white text-lg">
            No groups found! Create one by using the button below.
          </p>
        )}
        {props.groups.map((group) => {
          group.members = [
            ...group.members,
            ...group.members,
            ...group.members,
            ...group.members,
            ...group.members,
            ...group.members,
            ...group.members,
          ];
          return (
            <GroupItem
              group={group}
              edit={props.edit}
              owedAmount={group.owedAmount}
              flags={group.flags}
            />
          );
        })}
      </div>
      <div class="flex justify-center mt-[0.81rem]">
        <button
          class={`rounded-lg p-4 bg-accent-blue text-font-off-white`}
          hx-get="/groups/create"
          hx-swap="innerHTML"
          hx-target="#app"
          hx-push-url="/groups/create"
        >
          <span class="text-lg font-semibold">Create New Group</span>
        </button>
      </div>
      <div class="h-20" />
    </div>
  );
};
