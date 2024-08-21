import type { GroupWithMembers } from "../../../../services/group.service";

export const SelectGroup = (props: {
  groups: GroupWithMembers[];
  selectedGroupId?: string;
}) => {
  const { groups, selectedGroupId } = props;

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);

  return (
    <div
      class="bg-primary-black text-font-off-white w-full rounded-lg py-1 px-2 mb-4"
      id="select-group"
    >
      <div class="flex items-center justify-between w-full p-4 mb-3 rounded-lg bg-primary-black text-font-off-white">
        {!selectedGroup ? (
          <>
            <div id="icon-preview" class="flex items-center">
              <div
                id="icon-container"
                class="h-[3.875rem] aspect-square flex items-center justify-center"
              >
                <div
                  class="bg-primary-grey rounded-sm h-[3.875rem] aspect-square flex items-center justify-center"
                  id="icon-content"
                >
                  <div class="text-card-black">
                    <div class="w-[1.87rem] h-[1.87rem]"></div>
                  </div>
                </div>
              </div>
              <div class="ml-4">
                <p class="font-semibold text-font-off-white">Group</p>
                <p class="text-xs text-font-grey">Status</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="relative flex flex-col items-center">
                <div class="flex -space-x-2">
                  <div class="w-6 h-6 rounded-full bg-font-grey border-2 border-primary-black"></div>
                  <div class="w-6 h-6 rounded-full bg-font-grey border-2 border-primary-black"></div>
                  <div class="w-6 h-6 rounded-full bg-font-grey border-2 border-primary-black"></div>
                </div>
                <p class="mt-1 text-xs text-font-grey">members</p>
              </div>
              <button class="ml-4">
                <img
                  src="/activeIcons/expand_more.svg"
                  class="w-6 h-6"
                  alt="expand"
                />
              </button>
            </div>
          </>
        ) : (
          <>
            <div class="flex items-center">
              <div
                class={`w-12 h-12 rounded-lg flex items-center justify-center bg-${selectedGroup.color}`}
              >
                <img
                  src={selectedGroup.icon}
                  alt={`${selectedGroup.name} icon`}
                  class="w-[1.87rem] h-[1.87rem]"
                />
              </div>
              <div class="ml-4">
                <p class="font-semibold">{selectedGroup.name}</p>
                <p class="text-xs text-font-grey">
                  {selectedGroup.status ?? "Settled"}
                </p>
              </div>
            </div>
            <div class="flex items-center relative">
              <div class="relative flex flex-col items-center py-1">
                <div class="flex -space-x-2 absolute">
                  {selectedGroup.members.slice(0, 3).map((member) => (
                    <div
                      class={`w-6 h-6 rounded-full border-2 border-primary-black bg-${member.color} flex items-center justify-center`}
                    >
                      <span class="text-xs text-font-off-white">
                        {member.firstName[0]}
                        {member.lastName?.[0] ?? ""}
                      </span>
                    </div>
                  ))}
                  {selectedGroup.members.length > 3 && (
                    <div class="w-6 h-6 rounded-full bg-font-grey flex items-center justify-center text-xs">
                      +{selectedGroup.members.length - 3}
                    </div>
                  )}
                </div>
                <p class="mt-6 text-xs text-font-grey">
                  {selectedGroup.members.length} members
                </p>
              </div>
              <button class="ml-4">
                <img
                  src="/activeIcons/expand_more.svg"
                  class="w-6 h-6"
                  alt="expand"
                />
              </button>
            </div>
            <input
              type="hidden"
              name="selectedGroup"
              value={selectedGroup.id}
            />
          </>
        )}
      </div>

      <hr class="border-t border-font-grey w-full my-2" />

      {groups.map((group) => {
        if (group.id === selectedGroupId) return null;
        return (
          <div
            class="flex items-center justify-between w-full p-4 mb-3 rounded-lg bg-primary-black text-font-off-white"
            hx-get={`/receipt/selectGroup?groupId=${group.id}`}
            hx-target="#select-group"
            hx-swap="outerHTML"
            hx-trigger="click"
          >
            <div class="flex items-center">
              <div
                class={`w-12 h-12 rounded-lg flex items-center justify-center bg-${group.color}`}
              >
                <img
                  src={group.icon}
                  alt={`${group.name} icon`}
                  class="w-[1.87rem] h-[1.87rem]"
                />
              </div>
              <div class="ml-4">
                <p class="font-semibold text-font-off-white">{group.name}</p>
                <p class="text-xs text-font-grey">
                  {group.status ?? "Settled"}
                </p>
              </div>
            </div>

            <div class="flex items-center relative">
              <div class="relative flex flex-col items-center py-1">
                <div class="flex -space-x-2 absolute">
                  {group.members.slice(0, 3).map((member) => (
                    <div
                      class={`w-6 h-6 rounded-full border-2 border-primary-black bg-${member.color} flex items-center justify-center`}
                    >
                      <span class="text-xs text-font-off-white">
                        {member.firstName[0]}
                        {member.lastName?.[0] ?? ""}
                      </span>
                    </div>
                  ))}
                  {group.members.length > 3 && (
                    <div class="w-6 h-6 rounded-full bg-font-grey flex items-center justify-center text-xs">
                      +{group.members.length - 3}
                    </div>
                  )}
                </div>
                <p class="mt-6 text-xs text-font-grey">
                  {group.members.length} members
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
