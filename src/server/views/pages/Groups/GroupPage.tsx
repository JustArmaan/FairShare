import { getGroupsForUserWithMembers } from '../../../services/group.service';
import type { ExtractFunctionReturnType } from '../../../services/user.service';
import { GroupItem } from './components/GroupItem';

export type Groups = ExtractFunctionReturnType<
  typeof getGroupsForUserWithMembers
>;

export const GroupPage = (props: { edit?: boolean; groups: Groups }) => {
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl text-font-off-white">Groups</h2>
        {props.edit ? (
          <button hx-get="/groups/page" hx-target="#app" hx-trigger="click">
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
            hx-trigger="click"
            class={props.groups.length === 0 ? 'hidden' : ''}
          >
            <img class="h-4" src="icons/edit.svg" alt="edit icon" />
          </button>
        )}
      </div>
      <div class="px-4 py-2 mt-4 rounded-lg bg-primary-black">
        {props.groups.length === 0 && (
          <p class="text-font-off-white text-lg">
            No groups found! Create one by using the button below.
          </p>
        )}
        {props.groups.map((group, index) => (
          <>
            <GroupItem group={group} tailwindColorClass="accent-green" />
            {index !== 0 && (
              <div class="mt-3 h-px rounded-full bg-primary-dark-grey" />
            )}
          </>
        ))}
      </div>
      <div class="flex justify-center mt-10">
        <button
          class="rounded-2xl py-3 px-4 bg-accent-blue text-font-off-white"
          hx-get="/groups/create"
          hx-swap="innerHTML"
          hx-target="#app"
          hx-push-url="true"
        >
          <span class="text-lg font-semibold">Create New Group</span>
        </button>
      </div>
      <div class="h-20" />
    </div>
  );
};
