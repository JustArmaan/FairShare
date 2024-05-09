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
      class="bg-primary-black my-4"
      hx-get={`/groups/view/${props.group.id}`}
      hx-target="#app"
      hx-swap="innerHTML"
      hx-push-url="true"
    >
      <div class="flex">
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
            <svg
              width="30"
              height="30"
              viewBox="0 0 46 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_1205_3770"
                style="mask-type:alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="46"
                height="46"
              >
                <rect width="46" height="46" fill="currentColor" />
              </mask>
              <g mask="url(#mask0_1205_3770)">
                <path
                  d="M3.83325 36.4166V24.9166C3.83325 24.0541 4.00895 23.2714 4.36034 22.5687C4.71172 21.8659 5.17492 21.243 5.74992 20.6999V15.3333C5.74992 13.736 6.30895 12.3784 7.427 11.2603C8.54506 10.1423 9.9027 9.58325 11.4999 9.58325H19.1666C19.9013 9.58325 20.5881 9.71902 21.227 9.99054C21.8659 10.2621 22.4569 10.6374 22.9999 11.1166C23.543 10.6374 24.1339 10.2621 24.7728 9.99054C25.4117 9.71902 26.0985 9.58325 26.8333 9.58325H34.4999C36.0971 9.58325 37.4548 10.1423 38.5728 11.2603C39.6909 12.3784 40.2499 13.736 40.2499 15.3333V20.6999C40.8249 21.243 41.2881 21.8659 41.6395 22.5687C41.9909 23.2714 42.1666 24.0541 42.1666 24.9166V36.4166H38.3333V32.5833H7.66659V36.4166H3.83325ZM24.9166 19.1666H36.4166V15.3333C36.4166 14.7902 36.2329 14.335 35.8655 13.9676C35.4982 13.6003 35.043 13.4166 34.4999 13.4166H26.8333C26.2902 13.4166 25.835 13.6003 25.4676 13.9676C25.1003 14.335 24.9166 14.7902 24.9166 15.3333V19.1666ZM9.58325 19.1666H21.0833V15.3333C21.0833 14.7902 20.8996 14.335 20.5322 13.9676C20.1649 13.6003 19.7096 13.4166 19.1666 13.4166H11.4999C10.9569 13.4166 10.5017 13.6003 10.1343 13.9676C9.76693 14.335 9.58325 14.7902 9.58325 15.3333V19.1666ZM7.66659 28.7499H38.3333V24.9166C38.3333 24.3735 38.1496 23.9183 37.7822 23.551C37.4148 23.1836 36.9596 22.9999 36.4166 22.9999H9.58325C9.0402 22.9999 8.58499 23.1836 8.21763 23.551C7.85027 23.9183 7.66659 24.3735 7.66659 24.9166V28.7499Z"
                  fill="currentColor"
                />
              </g>
            </svg>
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
