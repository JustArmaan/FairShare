import type { Info } from '../InstitutionPage';
import type { ArrayElement } from '../../transactions/components/Transaction';

export const Institutions = (props: { edit?: boolean; info: ArrayElement<Info>}) => {
  return (
    <button class="bg-primary-black text-font-off-white py-3 px-4 rounded-lg shadow-lg my-4 flex justify-between items-center w-full text-left">
      <div class="flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <span class="text-font-off-white mr-2">Institution Name:</span>
          <span class="text-lg font-semibold">Scotia Bank</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-font-off-white mr-2">Institution Holder:</span>
          <span class="text-lg font-semibold">Joe Burden</span>
        </div>
      </div>
      {props.edit ? (
        <img
          hx-get={`/institution/delete`}
          hx-target="#app"
          hx-swap="innerHTML"
          class=""
          src="icons/delete.svg"
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
  )
}

export default Institutions
