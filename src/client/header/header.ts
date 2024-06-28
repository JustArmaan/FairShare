export async function changeHeader() {
  try {
    const header = document.getElementById("header");
    const url = window.location.href;
    console.log(url);
    if (header) {
      if (
        url.includes("/groups/view") ||
        url.includes("groups/edit") ||
        url.includes("groups/transactions") ||
        url.includes("transactions/addButton")
      ) {
        const groupId = url.split("/").pop();
        const groupName = await fetchGroupName(groupId!);
        console.log(groupName);
        header.innerText = groupName;
      } else if (
        url.includes("groups") &&
        !url.includes("view") &&
        !url.includes("edit")
      ) {
        header.innerText = "Groups";
      } else if (url.includes("transactions")) {
        header.innerText = "Transactions";
      } else if (url.includes("notification")) {
        header.innerText = "Notifications";
      } else if (url.includes("breakdown")) {
        header.innerText = "Breakdown";
      } else {
        header.innerText = "Fairshare";
      }
    }
  } catch (e) {
    console.error(e);
  }
}

async function fetchGroupName(groupId: string) {
  return await fetch(`/api/v0/groups/getname/${groupId}`)
    .then((res) => res.json())
    .then((data) => data.data.name);
}
