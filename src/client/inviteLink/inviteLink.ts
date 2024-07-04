export function clipBoardCopyInviteLink() {
  const inviteLink = document.getElementById("invite-link");
  const clipboardIcon = document.getElementById("clipboard-icon");

  if (inviteLink && clipboardIcon && !clipboardIcon.dataset.listenerAttached) {
    clipboardIcon.addEventListener("click", () => {
      navigator.clipboard
        .writeText(inviteLink.innerText)
        .then(() => {
          alert("Invite link copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    });
    clipboardIcon.dataset.listenerAttached = "true";
  }
}
