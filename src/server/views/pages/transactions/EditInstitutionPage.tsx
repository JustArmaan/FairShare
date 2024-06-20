import Institutions from "./components/InstitutionList";
import type { getItemsForUser } from "../../../services/plaid.service";
import type { ExtractFunctionReturnType } from "../../../services/user.service";

export type Info = ExtractFunctionReturnType<typeof getItemsForUser>;
export const EditInstitution = (props: { edit?: boolean; info: Info }) => {
  return (
    <div class="p-6 animate-fade-in">
      <img
        class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6 "
        src="/icons/modify.svg"
        alt="modify icon"
        id="modify-institution-icon"
      />
      {props.info.map((item) => (
        <>
          <Institutions info={item} edit={props.edit} />
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

export default EditInstitution;
