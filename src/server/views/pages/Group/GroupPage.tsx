import { GroupItem } from './components/GroupItem';

export const GroupPage = () => {
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl text-font-off-white">Groups</h2>
        <img class="h-full" src="icons/edit.svg" alt="edit icon" />
      </div>
      <div class="px-4 py-2 mt-4 rounded-lg bg-primary-black">
        <GroupItem />
        <GroupItem />
        <GroupItem />
        <GroupItem />
      </div>
    </div>
  );
};
