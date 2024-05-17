import type { Groups } from '../GroupPage';
import type { ArrayElement } from '../../transactions/components/Transaction';

export const GroupItem = (props: {
  group: ArrayElement<Groups>;
  edit?: boolean;
}) => {
  return (
    <div class="cursor-pointer hover:opacity-80 transition-all bg-primary-black my-4">
      <div
        class="flex items-center"
        hx-get={`/groups/view/${props.group.id}`}
        hx-target="#app"
        hx-swap="innerHTML"
      >
        <div
          class={`${
            props.group.temporary === 'true'
              ? `border-[3px] border-dashed border-${props.group.color} rounded-lg`
              : `bg-${props.group.color} rounded`
          }  w-14 h-14 aspect-square flex items-center justify-center`}
        >
          <div
            class={`${
              props.group.temporary === 'true'
                ? `text-${props.group.color}`
                : 'text-card-black'
            } `}
          >
            <img
              class="w-10 h-10"
              src={
                props.group.icon.endsWith('svg')
                  ? props.group.icon
                  : '/icons/bed.svg'
              }
              alt=""
            />
          </div>
        </div>
        <div class="w-full flex justify-between items-center relative">
          <div class="flex flex-col ml-4 h-full ">
            <p class="min-[340px]:text-lg font-semibold text-font-off-white leading-6 mb-1 text-sm truncate">
              {props.group.name}
              {props.group.temporary === 'true' && (
                <span class="text-font-grey"> (TEMP)</span>
              )}
            </p>
            <p class="leading-3 text-xs text-font-off-white">
              {props.group.members.length} members
            </p>
            {!(props.group.temporary === 'true') && (
              <p class="text-xs text-font-off-white">1 budget</p>
            )}
          </div>
          <div class="flex">
            {props.edit && (
              <img
                hx-get={`/groups/delete/${props.group.id}`}
                hx-target="#app"
                hx-swap="innerHTML"
                class=""
                src="icons/delete.svg"
                alt="delete icon"
              />
            )}
            {!props.edit &&
              props.group.members.slice(0, 4).map((member, index) => {
                return index === 3 && props.group.members.length > 4 ? (
                  <div class="-ml-4 rounded-full relative w-fit">
                    <div class="p-px flex items-center justify-center absolute w-full h-full rounded-full bg-card-black z-10 opacity-80">
                      <p class="text-font-off-white text-xs">
                        +{props.group.members.length - 4}
                      </p>
                    </div>
                    <div
                      class={`flex rounded-full bg-${member.color} h-12 w-12 m-2 justify-center`}
                    >
                      <span class="flex justify-center self-center text-center text-xl font-semibold">
                        {member.firstName.split('', 1)}
                        {member.lastName.split('', 1)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    class={`-ml-6 flex rounded-full bg-${member.color} h-12 w-12 m-2 justify-center`}
                  >
                    <span class="flex justify-center self-center text-center text-xl font-semibold">
                      {member.firstName.split('', 1)}
                      {member.lastName.split('', 1)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
