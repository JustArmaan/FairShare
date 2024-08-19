export const ProfileIcon = (props: {
  user: { firstName: string; lastName: string | null; color: string };
  class: string;
  textSize?: string;
}) => {
  return (
    <div
      class={`flex rounded-full bg-${props.user.color} ${props.class ? props.class : "h-12 w-12"} justify-center`}
    >
      <span
        class={`flex justify-center self-center text-center ${props.textSize ? props.textSize : "text-xl"} font-semibold`}
      >
        {props.user.firstName.split("", 1)}
        {props.user.lastName?.split("", 1)}
      </span>
    </div>
  );
};
