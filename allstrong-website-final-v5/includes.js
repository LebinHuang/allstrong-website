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
          <a href="#">Cooking Equipment</a>
          <a href="chinese-wok-range.html">Chinese Wok Ranges</a>
          <a href="bbq-oven.html">BBQ Ovens</a>
          <a href="mongolian-bbq-range.html">Mongolian BBQ Grills</a>
          <a href="steamer-cabinets.html">Steamer Cabinets</a>
          <a href="noodle-pasta-broiler.html">Noodle / Pasta Broiler</a>
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
      <li><a href="#">Custom Made</a></li>
      <li><a href="#">Close Out</a></li>
      <li><a href="#">About Us</a></li>
    </ul>
    <div class="nav-actions">
      <a href="tel:6264487878" class="nav-phone"><span>\u{1F4DE}</span>626-448-7878</a>
      <a href="tel:6264487878" class="btn-contact">Contact Us</a>
    </div>
  </div>
</header>`;

  var FOOTER = `<footer>
  <div class="footer-inner">
    <div>
      <a href="index.html" class="logo-wrap"><div class="logo-badge">AS</div><div class="logo-text-wrap"><div class="brand">Allstrong</div><div class="tagline">Restaurant Equipment Inc.</div></div></a>
      <p class="footer-desc">Professional commercial kitchen equipment manufacturer. NSF-certified wok ranges, custom fabrication, and cooking equipment trusted by restaurants nationwide.</p>
      <div class="footer-address"><p>\u{1F4CD} 1839 Durfee Ave, South El Monte, CA 91733</p><p>\u{1F4DE} <a href="tel:6264487878">626-448-7878</a></p></div>
    </div>
    <div><div class="footer-col-title">Products</div><ul class="footer-links"><li><a href="chinese-wok-range.html">Chinese Wok Ranges</a></li><li><a href="bbq-oven.html">BBQ Ovens</a></li><li><a href="mongolian-bbq-range.html">Mongolian BBQ Grills</a></li><li><a href="steamer-cabinets.html">Steamer Cabinets</a></li><li><a href="noodle-pasta-broiler.html">Noodle / Pasta Broiler</a></li><li><a href="rice-noodle-range.html">Rice Noodle Range</a></li><li><a href="thawing-machine.html">Thawing Machine</a></li></ul></div>
    <div><div class="footer-col-title">Furniture &amp; Parts</div><ul class="footer-links"><li><a href="tables-and-counters.html">Work Tables &amp; Counters</a></li><li><a href="#">Cabinets</a></li><li><a href="#">Shelves</a></li><li><a href="#">Hoods</a></li><li><a href="faucets.html">Faucets</a></li><li><a href="#">Range Accessories</a></li></ul></div>
    <div><div class="footer-col-title">Company</div><ul class="footer-links"><li><a href="#">About Us</a></li><li><a href="#">Company Video</a></li><li><a href="#">Custom Made</a></li><li><a href="#">Close Out Deals</a></li><li><a href="#">Blog</a></li><li><a href="#">Contact Us</a></li></ul></div>
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
