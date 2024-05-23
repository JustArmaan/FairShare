import type { AccountWithItem } from '../../../../services/account.service';

export const InstitutionDropDown = (props: {
  open: boolean;
  items: AccountWithItem['item'][];
  selectedItem: AccountWithItem['item'] | null;
}) => {
  console.log(props.items, props.open, 'items');
  return (
    <div id="institutionSelector">
      <div
        class="drop-shadow-lg rounded-lg bg-primary-faded-black mb-4 cursor-pointer hover:-translate-y-0.5 transition-all rotate-[0.0001deg]"
        hx-get={`/groups/account-selector/institution-drop-down?open=${!props.open}&selected=${
          props.selectedItem ? props.selectedItem.id : null
        }`}
        hx-swap="outerHTML"
        hx-trigger="click"
        hx-target="#institutionSelector"
      >
        <p class="mx-6 py-2.5">
          {props.selectedItem
            ? props.selectedItem.institutionName
            : 'Tap to select an institution'}
        </p>
      </div>
      {props.open &&
        props.items.map((item) => (
          <div
            class="bg-primary-faded-black"
            hx-get={`/groups/account-selector/institution-drop-down?open=${props.open}&selected=${item.id}`}
            hx-swap="outerHTML"
            hx-trigger="click"
            hx-target="#institutionSelector"
          >
            <p>{item.institutionName ? item.institutionName : 'no name!'}</p>
          </div>
        ))}
    </div>
  );
};
