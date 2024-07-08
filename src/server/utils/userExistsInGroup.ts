import { getUsersToGroup } from "../services/group.service";

export async function checkUserExistsInGroup(groupId: string, userId: string) {
  const userToGroup = await getUsersToGroup(groupId, userId);
  return !!userToGroup;
}
