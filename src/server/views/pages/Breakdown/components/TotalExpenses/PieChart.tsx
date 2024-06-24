export const PieChart = (props: {
  home?: boolean;
  accountId: string;
  slices: {
    clipPathStyle: string;
    tailwindColorClass: string;
    title: string;
  }[];
}) => {
  return (
    <div class="bg-primary-grey rounded-full w-3/5 max-w-60 min-w-20 aspect-square overflow-hidden relative">
      {/* the inner square is larger than the circle 
          it is then clipped by the circle overflow hidden
          we then define triangles using clip path and polygon to
          create pie slices
          clip path is determined mathematically
          */}
      {props.slices.map((slice) => {
        return (
          <a
            href={
              props.home
                ? `/breakdown/page/${props.accountId}`
                : `#${slice.title}`
            }
          >
            <div
              class={`hover:opacity-80 transition-all absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${slice.tailwindColorClass} w-[150%] h-[150%]`}
              style={slice.clipPathStyle}
            ></div>
          </a>
        );
      })}
    </div>
  );
};
