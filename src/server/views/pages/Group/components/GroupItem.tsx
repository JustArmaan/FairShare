import { faker } from '@faker-js/faker';
import type { UserSchema } from '../../../../interface/types';

const members: Partial<UserSchema>[] = [];

for (let i = 0; i < 12; i++) {
  members.push({
    picture: faker.image.avatar(),
  });
}

export const GroupItem = () => {
  return (
    <div class="bg-primary-black mt-4">
      <div class="flex">
        <div class="w-14 h-14 aspect-square border bg-accent-blue rounded">
          <img class="invert p-3.5" src="icons/bed.svg" alt="group icon" />
        </div>
        <div class="w-full flex justify-between items-center">
          <div class="flex flex-col ml-4 h-full">
            <p class="text-lg font-semibold text-font-off-white">Family</p>
            <p class="leading-3 text-xs text-font-grey">12 members</p>
            <p class="text-xs text-font-grey">1 budget</p>
          </div>
          <div class="flex">
            {members.slice(0, 4).map((member) => {
              return (
                <img
                  class="-ml-4 h-8 border rounded-full"
                  src={member!.picture!}
                  alt="member icon"
                />
              );
            })}
          </div>
        </div>
      </div>
      <div class="mt-3 h-px rounded-full bg-primary-dark-grey" />
    </div>
  );
};
