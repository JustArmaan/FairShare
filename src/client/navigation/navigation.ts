import htmx from "htmx.org";

export function handleNavigation() {
  const allCookies = document.cookie;
  if (
    !allCookies.includes("redirect=") ||
    allCookies.includes("redirect=none")
  ) {
    htmx.ajax("GET", "/onboard", {
      target: "body",
      swap: "innerHTML",
    });
    return;
  }

  const redirectCookie = allCookies
    .split("; ")
    .filter((cookie) => cookie.startsWith("redirect="))[0]
    .split("=")[1];

  let url = decodeURIComponent(redirectCookie);
  if (url.includes("invite")) {
    const segments = url.split("/");
    url = "/" + segments.slice(-3).join("/");
  } else {
    url = "/" + url.split("/").slice(3).join("/");
  }

  window.history.replaceState(url, "", url);
  document.cookie = "redirect=none";

  htmx.ajax("GET", url, {
    target: "#app",
    swap: "innerHTML",
  });
}
