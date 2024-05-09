import { faker } from '@faker-js/faker';
import { type UserSchema } from '../../../../interface/types';

export const OwedGroup = ({
  memberDetails,
  currentUser,
}: {
  memberDetails: UserSchema[];
  currentUser: UserSchema;
}) => {
  return (
    <div class="flex-col w-full justify-evenly rounded-lg pl-4 pr-4 mt-3 py-2 flex items-center bg-primary-black relative">
      {memberDetails.map((member, index) => (
        <>
          <div class="flex justify-between w-full">
            <p class="text-font-off-white self-start w-fit font-semibold text-lg">
              {faker.company.name().split(' ')[0].split(',')[0]}
            </p>
            <p class="text-font-off-white self-end w-fit text-lg">
              You Owe:{' '}
              <span class=" text-lg font-medium text-negative-number">
                ${(Math.random() * 40).toFixed(2)}
              </span>
            </p>
          </div>
          <p class="text-font-off-white self-start text-xs">March 14, 2024</p>
          <div class="flex justify-between w-full">
            <p class="text-font-off-white self-start mt-2">
              Paid by:{' '}
              <span class="text-font-off-white self-start mt-2 font-semibold">
                {' '}
                {member.firstName}
              </span>
            </p>
            <div class="flex flex-row justify-center text-font-off-white">
              <button
                hx-swap="innerHTML"
                hx-get="/breakdown/page"
                hx-target="#app"
                hx-push-url="true"
                // rotate 0.0001deg prevents strange subpixel snapping during animation when viewport is 430px wide. I spent 15 mins on this.
                // https://stackoverflow.com/questions/24854640/strange-pixel-shifting-jumping-in-firefox-with-css-transitions
                class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold px-12 py-2.5 bg-accent-blue rounded-xl"
              >
                View and Pay
              </button>
            </div>
          </div>
          {index !== memberDetails.length - 1 && (
            <div class="mx-3 my-4 h-[1px] bg-primary-grey rounded w-full"></div>
          )}
        </>
      ))}
    </div>
  );
};
export default OwedGroup;
