interface Icon {
  icon: string;
  name: string;
}
export const SelectIcon = (props: {
  icons: Icon[];
  colors: { name: string; bgClass: string }[];
  selectedIcon?: string;
  selectedColor?: string;
}) => {
  const { icons, colors, selectedIcon, selectedColor } = props;

  return (
    <div
      id="select-group-icon-container"
      class="flex flex-col w-full h-fit bg-primary-black rounded-md mt-1  items-center animate-fade-in min-h-[50px] max-h-[512px]"
    >
      <div
        id="select-group-icon-header"
        class="py-2 px-3 w-full h-fit flex justify-between"
      >
        <p class="text-primary-grey font-normal">Select Group Icon</p>
        <img
          hx-get="/groups/selectIconEmpty"
          hx-trigger="click"
          hx-swap="outerHTML"
          hx-target="#select-group-icon-container"
          src="/activeIcons/expand_more.svg"
          class="rotate-180 cursor-pointer aspect-square w-[24px]"
        />
      </div>
      <hr class="border-t border-primary-dark-grey w-11/12 mx-auto px-2" />
      <div class="w-full bg-primary-black rounded-md p-4 animate-fade-in">
        <div class="grid grid-cols-[repeat(auto-fit,_minmax(4rem,_1fr))] mb-4 px-2">
          {icons.map((icon) => (
            <div class="w-full h-full flex justify-center items-center mt-2">
              <div
                data-category-id={icon.icon}
                class={`flex justify-center items-center w-14 h-14 bg-primary-faded-black rounded-lg cursor-pointer ${
                  selectedIcon === icon.icon ? "ring-2 ring-accent-blue" : ""
                }`}
              >
                <img
                  src={icon.icon}
                  alt={icon.name}
                  class="w-[38px] h-[38px]"
                />
              </div>
            </div>
          ))}
        </div>
        <p class="text-primary-grey font-normal">Select Icon Color</p>
        <hr class="border-t border-primary-dark-grey w-full my-1 mx-auto px-2 mb-3" />
        <div class="flex justify-between px-8 items-center">
          {colors.map((color) => (
            <div
              class={`h-10 w-10 rounded-full cursor-pointer ${color.bgClass} ${
                selectedColor === color.name ? "ring-2 ring-accent-blue" : ""
              }`}
              title={color.name}
              data-color={color.name}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectIcon;
