function renderSiteFooter() {
  const isHome =
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("home.html");
  const isMobile = window.matchMedia("(max-width: 700px)").matches;
  const hideBrand = isHome && isMobile;

  const footerHTML = `
    <simple-footer
      hide-brand="${hideBrand}"
      logo-src="/images/nav-logo.png"
      logo-alt="C4TBYTE"
      logo-href="/"
      about-text="C4TBYTE is a freelance web development and technical consulting studio run by Iris, building custom sites, systems, and automation for the music world and beyond."
      columns="
        Quick Links:
          Work|/work,
          BackAlley|https://backalley.example.com,
          About|/about,
          Services|/services;

        Info:
          Contact|/contact,
          Legal|/legal
      "
      connect-heading="Stay connected"
      connect-text="Got a project? Let's build something."
      social="
        email|mailto:hello@c4tbyte.com,
        instagram|https://www.instagram.com/c4tbyte/
      "
    ></simple-footer>
  `;

  document.querySelectorAll("[data-site-footer]").forEach((el) => {
    el.innerHTML = footerHTML;
  });
}

document.addEventListener("DOMContentLoaded", renderSiteFooter);

window.FooterHelper = { renderSiteFooter };