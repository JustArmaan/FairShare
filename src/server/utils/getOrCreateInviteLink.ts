import {
  getInviteLinkById,
  createInviteLink,
  getInviteLinkByUsersToGroupsId,
} from "../services/invite.service";

export async function getOrCreateInviteLink(usersToGroupsId: string) {
  const inviteLink = await getInviteLinkByUsersToGroupsId(usersToGroupsId);

  if (inviteLink) {
    return inviteLink;
  }

  const newInviteLink = await createInviteLink(usersToGroupsId);

  return await getInviteLinkById(newInviteLink.id);
}
