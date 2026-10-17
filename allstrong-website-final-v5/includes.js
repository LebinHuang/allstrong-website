/* ============================================================
   Shared header + footer injection.
   Each page keeps its own page-specific .announce-bar, then drops in
   <div id="site-header"></div> (followed by this script) and a
   <div id="site-footer"></div> near the bottom. This file is the single
   source of truth for the nav and footer markup.
   ============================================================ */
(function () {
  var HEADER = `<header>
  <div class="nav-inner">
    <a href="index.html" class="logo-wrap">
      <div class="logo-badge">AS</div>
      <div class="logo-text-wrap">
        <div class="brand">Allstrong</div>
        <div class="tagline">Restaurant Equipment Inc.</div>
      </div>
    </a>
    <ul class="nav-menu">
      <li>
        <a href="#">Products <span class="arrow"></span></a>
        <div class="dropdown">
          <a href="cooking-equipment.html">Cooking Equipment</a>
          <a href="california-style-wok-range.html">California-Style Wok Range</a>
          <a href="chinese-wok-range.html">Wok Ranges</a>
          <a href="bbq-oven.html">BBQ Ovens</a>
          <a href="mongolian-bbq-range.html">Mongolian BBQ Grills</a>
          <a href="steamer-cabinets.html">Steamer Cabinets</a>
          <a href="dumpling-range.html">Dimsum &amp; Dumpling Range</a>
          <a href="ramen-cooker.html">Ramen Cooker</a>
          <a href="rice-noodle-range.html">Rice Noodle Range</a>
          <a href="thawing-machine.html">Thawing Machine</a>
        </div>
      </li>
      <li>
        <a href="#">Furniture <span class="arrow"></span></a>
        <div class="dropdown">
          <a href="tables-and-counters.html">Work Tables &amp; Counters</a>
          <a href="#">Cabinets</a>
          <a href="#">Shelves</a>
          <a href="#">Equipment Stands</a>
          <a href="#">Hoods</a>
        </div>
      </li>
      <li>
        <a href="#">Parts &amp; Accessories <span class="arrow"></span></a>
        <div class="dropdown">
          <a href="faucets.html">Faucets</a>
          <a href="#">Range Accessories</a>
          <a href="#">Drop-in / Hand Sink</a>
          <a href="#">Insulation Chamber</a>
        </div>
      </li>
      <li><a href="custom-quote.html">Custom Made</a></li>
      <li><a href="about.html">About Us</a></li>
    </ul>
    <div class="nav-actions">
      <a href="tel:6264487878" class="nav-phone"><span><svg width="16" height="16" style="vertical-align:middle;margin-right:6px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3H3v4c0 8 6 14 14 14h4v-6l-5-1-2 3a14 14 0 0 1-7-7l3-2-1-5Z"/></svg></span>626-448-7878</a>
      <a href="contact.html" class="btn-contact">Contact Us</a>
    </div>
  </div>
</header>`;

  var FOOTER = `<footer>
  <div class="footer-inner">
    <div>
      <a href="index.html" class="logo-wrap"><div class="logo-badge">AS</div><div class="logo-text-wrap"><div class="brand">Allstrong</div><div class="tagline">Restaurant Equipment Inc.</div></div></a>
      <p class="footer-desc">Professional commercial kitchen equipment manufacturer. NSF-certified wok ranges, custom fabrication, and cooking equipment trusted by restaurants nationwide.</p>
      <div class="footer-address"><p><svg width="16" height="16" style="vertical-align:middle;margin-right:6px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg> 1839 Durfee Ave, South El Monte, CA 91733</p><p><svg width="16" height="16" style="vertical-align:middle;margin-right:6px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3H3v4c0 8 6 14 14 14h4v-6l-5-1-2 3a14 14 0 0 1-7-7l3-2-1-5Z"/></svg> <a href="tel:6264487878">626-448-7878</a></p></div>
    </div>
    <div><div class="footer-col-title">Products</div><ul class="footer-links"><li><a href="california-style-wok-range.html">California-Style Wok Range</a></li><li><a href="chinese-wok-range.html">Wok Ranges</a></li><li><a href="bbq-oven.html">BBQ Ovens</a></li><li><a href="mongolian-bbq-range.html">Mongolian BBQ Grills</a></li><li><a href="steamer-cabinets.html">Steamer Cabinets</a></li><li><a href="dumpling-range.html">Dimsum &amp; Dumpling Range</a></li><li><a href="ramen-cooker.html">Ramen Cooker</a></li><li><a href="rice-noodle-range.html">Rice Noodle Range</a></li><li><a href="thawing-machine.html">Thawing Machine</a></li></ul></div>
    <div><div class="footer-col-title">Furniture &amp; Parts</div><ul class="footer-links"><li><a href="tables-and-counters.html">Work Tables &amp; Counters</a></li><li><a href="#">Cabinets</a></li><li><a href="#">Shelves</a></li><li><a href="#">Hoods</a></li><li><a href="faucets.html">Faucets</a></li><li><a href="#">Range Accessories</a></li></ul></div>
    <div><div class="footer-col-title">Company</div><ul class="footer-links"><li><a href="about.html">About Us</a></li><li><a href="#">Company Video</a></li><li><a href="custom-quote.html">Custom Made</a></li><li><a href="#">Blog</a></li><li><a href="contact.html">Contact Us</a></li></ul></div>
  </div>
  <div class="footer-bottom">
    <p class="footer-copy">© 2024 <span>Allstrong Restaurant Equipment Inc.</span> All Rights Reserved.</p>
    <div class="footer-legal"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Sitemap</a></div>
  </div>
</footer>`;

  function highlightActive() {
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (!page) page = 'index.html';
    var links = document.querySelectorAll('header .dropdown a, header .nav-menu > li > a');
    links.forEach(function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (href && href === page) {
        a.classList.add('is-current');
        var li = a.closest('li');
        if (li) {
          var top = li.querySelector('a');
          if (top) top.classList.add('is-current');
        }
      }
    });
  }

  function injectHeader() {
    var ph = document.getElementById('site-header');
    if (ph) {
      ph.outerHTML = HEADER;
      highlightActive();
    }
  }

  function injectFooter() {
    var ph = document.getElementById('site-footer');
    if (ph) ph.outerHTML = FOOTER;
  }

  // Inject the header as early as possible (its placeholder precedes this
  // script in the body) so there is no layout shift at the top of the page.
  if (document.getElementById('site-header')) {
    injectHeader();
  } else {
    document.addEventListener('DOMContentLoaded', injectHeader);
  }

  // The footer placeholder lives at the end of the body, so wait for parse.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();


