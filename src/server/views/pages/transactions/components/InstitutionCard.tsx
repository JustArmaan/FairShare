import type { AccountSchema } from '../../../../services/plaid.service';

export const InstitutionCard = () => {
  return (
    <div class="bg-accent-blue text-font-off-white py-3 px-4 rounded-lg shadow-lg  my-4">
      <div class='flex flex-row items-center'>
         <img
          class="h-10"
          src="/icons/chip.svg"
          alt="chip icon"
          id="chip-icon"
        />
          <img
          class="h-8 ml-3"
          src="/icons/wifi.svg"
          alt="wifi icon"
          id="wifi-icon"
        />
        <p class="text-font-off-white text-lg flex justify-end">Credit Card</p>
      </div>
        <p class="text-font-off-white text-lg">5555 5555 5555 5555</p>
        <div class='flex flex-row'>
            <p>CARD HOLDER</p>
            <p>EXPIRE DATE</p>
        </div>
        <div class='flex flex-row'>
            <p>JOE GUY</p>
            <p>02/11/26</p>
        </div>
    </div>
  );
};

export default InstitutionCard;
