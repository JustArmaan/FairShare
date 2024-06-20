import type { Info } from "../InstitutionPage";
import type { ArrayElement } from "./Transaction";

export const InstitutionList = (props: {
  edit?: boolean;
  info: ArrayElement<Info>;
}) => {
  return (
    <button class="bg-primary-black text-font-off-white py-3 px-4 rounded-lg shadow-lg my-4 flex justify-between items-center w-full text-left">
      <div class="flex items-center ">
        <div class="flex justify-between items-center mr-4">
          <span class="text-lg font-semibold">
            <img
              class="rounded-full border-card-black w-10"
              src={`data:image/png;base64, ${props.info.item.logo}`}
            />
          </span>
        </div>
        <div class="flex justify-between items-center mr-4">
          <span class="text-font-off-white mr-2">Institution Name:</span>
          <span class="text-lg font-semibold">
            {props.info.item.institutionName}
          </span>
        </div>
      </div>
      {props.edit ? (
        <img
          hx-get={`/institution/delete`}
          hx-target="#app"
          hx-swap="innerHTML"
          class=""
          src="/icons/delete.svg"
          alt="delete icon"
        />
      ) : (
        <img
          class="h-4"
          src="/images/right-triangle.svg"
          alt="triangle icon"
          id="account-select-image"
        />
      )}
    </button>
  );
};
