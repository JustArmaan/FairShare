import type { getItemsForUser } from "../../../services/plaid.service";
import type { ExtractFunctionReturnType } from "../../../services/user.service";
import { InstitutionItem } from "./components/InstitutionItem";

export type Info = ExtractFunctionReturnType<typeof getItemsForUser>;
export const InstitutionsPage = (props: {
  edit?: boolean;
  info: Info;
  mobile?: boolean;
}) => {
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl text-font-off-white">
          {props.info.length === 0 ? "Connect" : "Connected Institutions"}
        </h2>
        {!props.mobile && ( // if mobile, no editing is allowed
          <>
            {props.edit ? (
              <button
                hx-get="/institutions/page"
                hx-target="#app"
                hx-trigger="click"
                hx-swap="innerHTML"
                class="hover:opacity-80 cursor-pointer"
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
                hx-get="/institutions/edit"
                hx-target="#app"
                hx-swap="innerHTML"
                hx-trigger="click"
                class={`hover:opacity-80 cursor-pointer ${props.info.length === 0 ? "hidden" : ""}`}
              >
                <img class="h-5" src="/icons/modify.svg" alt="modify icon" />
              </button>
            )}
          </>
        )}
      </div>
      {props.info.length === 0 && (
        <div class="p-4 mt-4 w-full bg-primary-black rounded-xl mb-2 text-lg text-font-off-white">
          <p>
            Fairshare uses a third party financial service,{" "}
            <a class="text-accent-blue" href="https://plaid.com/">
              Plaid
            </a>
            , to gather your transaction data. This data is used within our
            application to power our visualisations and transaction history
            features.{" "}
          </p>
          <br />
          <p>
            By clicking below, you will be prompted to connect your bank and
            begin using the application.
          </p>
        </div>
      )}
      {props.info.map((item) => (
        <InstitutionItem info={item} edit={props.edit} />
      ))}
      <div
        class={`flex flex-col text-font-off-white font-semibold text-lg mt-8 justify-center items-center`}
      >
        {props.mobile && props.info.length > 0 && (
          <div class="p-4 w-full bg-primary-black rounded-xl mb-2 text-lg text-font-off-white font-normal">
            <p>
              <span class="font-semibold">You're all connected up!</span> You
              can choose to connect another institution below or head back to
              the mobile app.
            </p>
          </div>
        )}
        <button
          id="connect-to-plaid"
          class="hover:-translate-y-0.5 transition-all bg-accent-blue rounded-3xl w-fit py-[0.5rem] mt-4 px-8"
        >
          {props.info.length === 0
            ? "Connect your first institution"
            : "Add a new institution"}
        </button>
      </div>
    </div>
  );
};

export default InstitutionsPage;
