function renderSiteNav() {
  const navHTML = `
    <simple-nav
      logo-src="/images/nav-logo.png"
      logo-alt="C4TBYTE"
      logo-href="/"
      links="
        Work|/work,
        BackAlley|/backalley,
        About|/about,
        Services|/services,
        Contact|/contact
      "
    ></simple-nav>
  `;

  document.querySelectorAll("[data-site-nav]").forEach((el) => {
    el.innerHTML = navHTML;
  });
}

document.addEventListener("DOMContentLoaded", renderSiteNav);

window.NavHelper = { renderSiteNav };
