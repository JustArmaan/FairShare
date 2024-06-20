export function highlightNavigationIcons() {
  const url = window.location.pathname;

  const icons = {
    home: {
      inactive: document.getElementById("homeIconInactive"),
      active: document.getElementById("homeIconActive"),
      text: document.getElementById("homeText"),
      color: "accent-yellow",
    },
    groups: {
      inactive: document.getElementById("groupsIconInactive"),
      active: document.getElementById("groupsIconActive"),
      text: document.getElementById("groupsText"),
      color: "accent-purple",
    },
    notifications: {
      inactive: document.getElementById("notificationsIconInactive"),
      active: document.getElementById("notificationsIconActive"),
      text: document.getElementById("notificationsText"),
      color: "accent-green",
    },
  };

  Object.values(icons).forEach((section) => {
    section.inactive?.classList.remove("hidden");
    section.inactive?.classList.add("block");
    section.active?.classList.add("hidden");
    section.active?.classList.remove("block");

    section.text?.classList.remove("text-accent-yellow");
    section.text?.classList.remove("text-accent-purple");
    section.text?.classList.remove("text-accent-green");
  });

  Object.entries(icons).forEach(([key, value]) => {
    if (url.includes(`/${key}`)) {
      value.inactive?.classList.add("hidden");
      value.active?.classList.remove("hidden");
      value.active?.classList.add("block");
      value.text?.classList.add(`text-${value.color}`);
    }
  });
}
