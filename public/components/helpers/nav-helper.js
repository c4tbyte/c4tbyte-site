function renderSiteNav() {
  const navHTML = `
    <simple-nav
      logo-src="/images/nav-logo.png"
      logo-alt="C4TBYTE"
      logo-href="/"
      links="
        Work|/work,
        Services|/services,
        About|/about,
        Contact|/contact,
        BackAlley|/backalley
      "
    ></simple-nav>
  `;

  document.querySelectorAll("[data-site-nav]").forEach((el) => {
    el.innerHTML = navHTML;
  });
}

document.addEventListener("DOMContentLoaded", renderSiteNav);

window.NavHelper = { renderSiteNav };
