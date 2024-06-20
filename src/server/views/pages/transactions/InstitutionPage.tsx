import type { getItemsForUser } from "../../../services/plaid.service";
import type { ExtractFunctionReturnType } from "../../../services/user.service";
import { InstitutionList } from "./components/InstitutionList";

export type Info = ExtractFunctionReturnType<typeof getItemsForUser>;
export const InstitutionsPage = (props: { edit?: boolean; info: Info }) => {
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl text-font-off-white">Institutions</h2>
        {props.edit ? (
          <button
            hx-get="/home/institutionPicker"
            hx-target="#app"
            hx-trigger="click"
            hx-swap="innerHTML"
          >
            <div class="cursor-pointer h-full text-font-off-white">
              <svg
                width="16"
                height="16"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.35235 16.7524L0.33667 14.7391L6.43079 8.65217L0.33667 2.56521L2.35235 0.551895L8.44647 6.63885L14.5406 0.551895L16.5563 2.56521L10.4622 8.65217L16.5563 14.7391L14.5406 16.7524L8.44647 10.6655L2.35235 16.7524Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </button>
        ) : (
          <button
            hx-get="/home/institutions/edit"
            hx-target="#app"
            hx-swap="innerHTML"
            hx-trigger="click"
            // class={props.institution.length === 0 ? 'hidden' : ''}
          >
            <img class="h-5" src="/icons/modify.svg" alt="modify icon" />
          </button>
        )}
      </div>
      {props.info.length === 0 && (
        <p class="text-font-off-white text-lg">
          No Institutions found! Add one by using the button below.
        </p>
      )}
      {props.info.map((item) => (
        <>
          <InstitutionList info={item} edit={props.edit} />
        </>
      ))}
      <div class="flex flex-col text-font-off-white font-semibold text-lg mt-8 justify-center items-center">
        <button
          id="connect-to-plaid"
          class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl w-72 py-[0.5rem] mt-4"
        >
          Add a new institution
        </button>
      </div>
    </div>
  );
};

export default InstitutionsPage;
