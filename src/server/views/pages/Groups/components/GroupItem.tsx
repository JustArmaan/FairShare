import type { Groups } from '../GroupPage';
import type { ArrayElement } from '../../transactions/components/Transaction';

export const GroupItem = (props: {
  temp?: boolean;
  tailwindColorClass: string;
  group: ArrayElement<Groups>;
  edit?: boolean;
}) => {
  return (
    <div
      class="cursor-pointer hover:opacity-80 transition-all bg-primary-black my-4"
      hx-get={`/groups/view/${props.group.id}`}
      hx-target="#app"
      hx-swap="innerHTML"
    >
      <div class="flex items-center">
        <div
          class={`${
            props.temp
              ? `border-[3px] border-dashed border-${props.tailwindColorClass} rounded-lg`
              : `bg-${props.tailwindColorClass} rounded`
          } w-14 h-14 aspect-square flex items-center justify-center`}
        >
          <div
            class={`${
              props.temp
                ? `text-${props.tailwindColorClass}`
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
        <div class="w-full flex justify-between items-center">
          <div class="flex flex-col ml-4 h-full">
            <p class="text-lg font-semibold text-font-off-white">
              {props.group.name}
              {props.temp && <span class="text-font-grey"> (TEMP)</span>}
            </p>
            <p class="leading-3 text-xs text-font-off-white">
              {props.group.members.length} members
            </p>
            {!props.temp && <p class="text-xs text-font-off-white">1 budget</p>}
          </div>
          <div class="flex">
            {props.edit && (
              <img class="" src="icons/delete.svg" alt="delete icon" />
            )}
            {!props.edit &&
              props.group.members.slice(0, 4).map((member, index) => {
                return index === 3 && props.group.members.length > 4 ? (
                  <div class="-ml-4 rounded-full relative">
                    <div class="p-px flex items-center justify-center absolute w-full h-full rounded-full bg-card-black z-10 opacity-80">
                      <p class="text-font-off-white text-xs">
                        +{props.group.members.length - 4}
                      </p>
                    </div>
                    <img
                      class="h-8 rounded-full z-0"
                      src={
                        member.picture
                          ? member.picture
                          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png'
                      }
                      alt="member icon"
                    />
                  </div>
                ) : (
                  <img
                    class={`${index > 0 && '-ml-4'} h-8 w-8 rounded-full`}
                    src={member!.picture!}
                    alt="member icon"
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
