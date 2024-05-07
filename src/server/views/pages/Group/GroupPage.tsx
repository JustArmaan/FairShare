import type { GroupSchema } from '../../../services/group.service';
import { GroupItem } from './components/GroupItem';

const sampleGroup: GroupSchema = {
  id: '',
  name: 'Family',
};
export const GroupPage = () => {
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl text-font-off-white">Groups</h2>
        <img class="h-full" src="icons/edit.svg" alt="edit icon" />
      </div>
      <div class="px-4 py-2 mt-4 rounded-lg bg-primary-black">
        <GroupItem
          group={{
            id: '',
            name: 'Family',
          }}
          tailwindColorClass="accent-red"
        />
        <div class="mt-3 h-px rounded-full bg-primary-dark-grey" />
        <GroupItem
          group={{
            id: '',
            name: 'Friends',
          }}
          tailwindColorClass="accent-blue"
        />
        <div class="mt-3 h-px rounded-full bg-primary-dark-grey" />
        <GroupItem
          group={{
            id: '',
            name: 'Friday Night',
          }}
          tailwindColorClass="accent-green"
          temp
        />
        <div class="mt-3 h-px rounded-full bg-primary-dark-grey" />
      </div>
    </div>
  );
};
