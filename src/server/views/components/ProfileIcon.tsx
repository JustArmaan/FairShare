import type { UserSchema } from '../../interface/types';

export const ProfileIcon = (props: { user: UserSchema }) => {
  return (
    <div
      class={`flex rounded-full bg-${props.user.color} h-12 w-12 justify-center`}
    >
      <span class="flex justify-center self-center text-center text-xl font-semibold">
        {props.user.firstName.split('', 1)}
        {props.user.lastName.split('', 1)}
      </span>
    </div>
  );
};
