/* Extra content under each buy page: how-to-order videos, description, FAQ.
   Video files live in public/videos/. To use a different video, replace the file
   with the same name, or change the path below. YouTube and Google Drive links also work.
   Leave a value as "" to show a "Video coming soon" tile. */
window.CS_HOW_TO_ORDER = {
  pc: "videos/how-to-order-pc.mp4",         // computer or laptop
  mobile: "videos/how-to-order-mobile.mp4"  // phone
};

(function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function embedUrl(u) {
    if (!u) return "";
    var yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
    if (yt) return "https://www.youtube.com/embed/" + yt[1];
    var gd = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (gd) return "https://drive.google.com/file/d/" + gd[1] + "/preview";
    return "";
  }

  function videoCard(title, url, portrait) {
    var body;
    if (url && /\.mp4$/i.test(url)) {
      body = '<video controls playsinline preload="metadata" src="' + esc(url) + '"></video>';
    } else if (embedUrl(url)) {
      body = '<iframe src="' + esc(embedUrl(url)) + '" title="' + esc(title) + '" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    } else {
      body = '<div class="how-video-soon"><span class="how-play" aria-hidden="true">&#9654;</span><b>Video coming soon</b><small>Follow the steps below for now.</small></div>';
    }
    return '<div class="how-video-card"><h3>' + esc(title) + '</h3><div class="how-video-frame' + (portrait ? ' portrait' : '') + '">' + body + '</div></div>';
  }

  function priceOf(pl) {
    return window.CS && CS.eff ? CS.eff(pl) : pl[1];
  }

  function setMeta(name, value) {
    var m = document.querySelector('meta[name="' + name + '"]');
    if (!m) { m = document.createElement("meta"); m.name = name; document.head.appendChild(m); }
    m.content = value;
  }

  var COPY = {
    "chatgpt-plus-subscription-in-nepal": "Looking for ChatGPT Plus in Nepal? Get a ChatGPT Plus subscription for writing, studying, coding and everyday work. Pay with eSewa, Khalti or Fonepay, and choose the plan that suits you above.",
    "claude-pro-subscription-in-nepal": "Claude Pro subscription in Nepal for writing, research and long documents. Choose a Sharing or Private plan, pay with eSewa, Khalti or Fonepay, and get it delivered after your payment is verified.",
    "perplexity-pro-subscription-in-nepal": "Perplexity Pro subscription in Nepal for fast research with sources. Compare the 3, 6 and 12 month plans and pay locally, with no international card needed.",
    "google-gemini-subscription-in-nepal": "Google Gemini subscription in Nepal for AI help with writing, ideas and everyday tasks. Pay with eSewa, Khalti or Fonepay and pick the plan that suits you above.",
    "netflix-sharing-subscription-in-nepal-cheap": "Cheap Netflix sharing subscription in Nepal. Choose a Sharing or Private plan, pay with eSewa, Khalti or Fonepay, and watch movies and series on your own profile.",
    "spotify-premium-subscription-in-nepal": "Spotify Premium subscription in Nepal for ad-free music and podcasts. Choose a plan above and pay with eSewa, Khalti or Fonepay.",
    "youtube-premium-subscription-in-nepal": "YouTube Premium subscription in Nepal for ad-free videos, background play and offline downloads. Pay locally with eSewa, Khalti or Fonepay.",
    "canva-pro-subscription-in-nepal": "Canva Pro subscription in Nepal for designing posters, reels, presentations and social media posts. Pay locally with eSewa, Khalti or Fonepay.",
    "adobe-creative-cloud-subscription-in-nepal": "Adobe Creative Cloud subscription in Nepal for Photoshop, Premiere Pro, Illustrator and more. Choose a 4 or 12 month plan and pay with eSewa, Khalti or Fonepay.",
    "microsoft-365-subscription-in-nepal": "Microsoft 365 subscription in Nepal for Word, Excel, PowerPoint and Outlook. Buy the 12 month plan and pay with eSewa, Khalti or Fonepay.",
    "duolingo-super-subscription-in-nepal": "Duolingo Super subscription in Nepal for ad-free lessons and extra practice while you learn English and other languages. Pay with eSewa, Khalti or Fonepay.",
    "grammarly-premium-subscription-in-nepal": "Grammarly Premium subscription in Nepal for better grammar, tone and writing suggestions in English. Pay with eSewa, Khalti or Fonepay.",
    "higgsfield-subscription-in-nepal": "Higgsfield subscription in Nepal for AI video and image creation. Choose a plan above and pay locally with eSewa, Khalti or Fonepay.",
    "linkedin-premium-subscription-in-nepal": "LinkedIn Premium subscription in Nepal for job search, Sales Navigator and business networking. Pay with eSewa, Khalti or Fonepay.",
    "crunchyroll-subscription-in-nepal": "Crunchyroll subscription in Nepal for anime and Asian drama, with a 1 year plan. Pay with eSewa, Khalti or Fonepay.",
    "prime-video-subscription-in-nepal": "Prime Video subscription in Nepal for movies, series and Amazon Originals. Pay with eSewa, Khalti or Fonepay.",
    "capcut-pro-subscription-in-nepal": "CapCut Pro subscription in Nepal for video editing with pro effects, templates and exports. Pay with eSewa, Khalti or Fonepay."
  };
  function introFor(p) {
    return COPY[p.slug] || (p.name + " is available from CheapSewa.Store, a digital subscriptions shop made for Nepal. " + p.desc);
  }

  window.CS_BUY_EXTRAS = function (p) {
    var name = p.name;
    var plansText = p.plans.map(function (pl) { return pl[0] + " – NPR " + priceOf(pl); }).join(", ");
    var fromPrice = Math.min.apply(null, p.plans.map(priceOf));
    var slug = p.slug || ("product-" + p.id);
    var url = location.origin + "/" + slug;

    // Title, description and canonical address for search engines
    document.title = "Buy " + name + " in Nepal | CheapSewa.Store";
    setMeta("description", (p.desc + " Buy " + name + " in Nepal with eSewa, Khalti, Fonepay or bank transfer.").slice(0, 155));
    var canon = document.querySelector('link[rel="canonical"]');
    if (!canon) { canon = document.createElement("link"); canon.rel = "canonical"; document.head.appendChild(canon); }
    canon.href = url;

    var v = window.CS_HOW_TO_ORDER || {};

    return '' +
      '<section class="buy-extra">' +

      // 1. Videos, directly under the Payment help box
      '<div class="card-box">' +
        '<h2>How to order and pay for ' + esc(name) + '</h2>' +
        '<div class="how-videos">' +
          videoCard("How to order on PC or laptop", v.pc, false) +
          videoCard("How to order on mobile", v.mobile, true) +
        '</div>' +
      '</div>' +

      // 2. Description
      '<div class="card-box">' +
        '<h2>About ' + esc(name) + ' in Nepal</h2>' +
        '<h3>नेपालमा ' + esc(name) + ' किन्नुहोस्</h3>' +
        '<p>' + esc(introFor(p)) + '</p>' +
        '<p><b>Plans:</b> ' + esc(plansText) + '. Prices start from NPR ' + esc(fromPrice) + '. Choose the plan that suits you above, then pay with eSewa, Khalti, Fonepay or bank transfer. You do not need an international card.</p>' +
        '<p>After you pay, upload your payment screenshot on this page and tap Verify payment. Your order is then delivered. If you forget your account password, message us on WhatsApp at 9717647043 and we will reset it for you.</p>' +
      '</div>' +

      // 3. Steps and FAQ
      '<div class="card-box">' +
        '<h3>Steps</h3>' +
        '<ol class="how-steps">' +
          '<li>Choose your plan above.</li>' +
          '<li>Tap "Add to cart" to buy more items, or "Continue to amount" to buy now.</li>' +
          '<li>Enter your name and phone number.</li>' +
          '<li>Pay with the QR code using eSewa, Khalti, Fonepay or bank transfer.</li>' +
          '<li>Upload your payment screenshot and tap "Verify payment".</li>' +
          '<li>Your order is delivered after we verify your payment.</li>' +
        '</ol>' +
        '<h2>Frequently asked questions</h2>' +
        '<p class="faq-q">How do I order ' + esc(name) + '?</p><p>Follow the steps above or watch the video. It takes only a few minutes.</p>' +
        '<p class="faq-q">Which payment methods are accepted?</p><p>eSewa, Khalti, Fonepay and bank transfer.</p>' +
        '<p class="faq-q">How long does delivery take?</p><p>Delivery starts after we verify your payment screenshot.</p>' +
        '<p class="faq-q">I need help. Who do I contact?</p><p>WhatsApp 9717647043 or email support@cheapsewa.store.</p>' +
      '</div>' +

      '<a class="text-btn back-site" href="index.html#shop">← Back to website</a>' +
      '</section>';
  };
})();
