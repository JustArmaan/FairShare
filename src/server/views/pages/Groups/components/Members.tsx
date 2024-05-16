import { type UserSchema } from '../../../../interface/types';
import { faker } from '@faker-js/faker';


const colors = [
  'accent-blue',
  'accent-purple',
  'accent-red',
  'accent-yellow',
  'accent-green',
  'negative-number',
  'card-red',
]
export const Members = ({
  memberDetails,
  currentUser,
}: {
  memberDetails: UserSchema[];
  currentUser: UserSchema;
}) => {
  return (
    <div class="flex flex-wrap items-center w-full">
      {memberDetails.map((member) => (
        <div class="flex bg-primary-black h-16 md:w-[calc(100%_-_0.5rem)] w-[calc(50%_-_0.5rem)] rounded-lg m-1 items-center">
          <div class={`flex rounded-full bg-${faker.helpers.arrayElement(colors)} h-12 w-12 m-2 justify-center`}><span class='flex justify-center self-center text-center text-xl font-semibold'>{member.firstName.split('',1)}{member.lastName.split('',1)}</span></div>
          <div class="flex flex-col text-center self-center items-center justify-center ml-4 ">
            <p class="text-font-off-white flex w-fit">{member.firstName}</p>

            {member.id === currentUser.id ? (
              <p class="text-font-off-white flex w-fit text-sm">You</p>
            ) : (
              <p class="text-negative-number flex w-fit text-sm">
                $
                <span class="text-negative-number flex w-fit text-sm font-semibold">
                  {(Math.random() * 40).toFixed(2)}
                </span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Members;
