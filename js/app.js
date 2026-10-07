/* Woodish site: hero scroll, open/closed status, catalogue, basket to WhatsApp. */
(function () {
  const D = window.WOODISH;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) document.documentElement.classList.add('reduced');
  const catById = Object.fromEntries(D.categories.map(c => [c.id, c]));
  const money = n => 'Rs ' + n.toLocaleString('en-PK');
  const wa = text => `https://wa.me/${D.phone}${text ? '?text=' + encodeURIComponent(text) : ''}`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = id => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${catById[id].icon}"/></svg>`;

  /* ---------- plain links to WhatsApp ---------- */
  const hello = 'Assalam o Alaikum Woodish Furniture, I would like some information about your furniture.';
  ['heroWa', 'visitWa', 'ctaWa', 'fabWa'].forEach(id => { const a = document.getElementById(id); if (a) a.href = wa(hello); });
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- open / closed (Pakistan time) ---------- */
  function openState() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: D.tz, hour: 'numeric', hour12: false }).format(new Date());
    const hr = parseInt(parts, 10) % 24;
    return hr >= D.open && hr < D.close;
  }
  function paintOpen() {
    const open = openState();
    const pill = $('#openPill'); pill.hidden = false;
    pill.classList.toggle('is-open', open);
    $('#openText').textContent = open ? 'Open now' : 'Closed. Opens 9am';
    const inl = $('#openInline');
    inl.textContent = open ? 'Open now' : 'Closed now';
    inl.classList.toggle('shut', !open);
  }
  paintOpen(); setInterval(paintOpen, 60000);

  /* ---------- smooth scroll + nav ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href'); if (id.length < 2) return;
      const el = document.querySelector(id); if (!el) return;
      e.preventDefault(); lenis.scrollTo(el, { offset: -64 });
    }));
  }
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('solid', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- hero scroll scene ---------- */
  const hero = $('#hero'), copy = $('.hero-copy');
  const fx = window.LogoFX.init($('#heroCanvas'), 'assets/logo-stack.png', copy);
  const frames = $$('.hf'), line = $('.hero-line');
  const speeds = [0.9, 1.15, 1.0, 1.25];
  function heroTick() {
    const range = hero.offsetHeight - innerHeight;
    const p = clamp(scrollY / Math.max(1, range), 0, 1);
    fx.setProgress(p);
    if (!reduce) {
      const c = clamp((p - 0.1) / 0.3, 0, 1);
      copy.style.opacity = 1 - c;
      copy.style.transform = `translateY(${-c * 50}px)`;
      const l = clamp((p - 0.42) / 0.25, 0, 1);
      line.style.opacity = l; line.style.transform = `translateY(${(1 - l) * 30}px)`;
      frames.forEach((f, i) => {
        const t = clamp((p - 0.18) / 0.5 * speeds[i], 0, 1), e = 1 - Math.pow(1 - t, 3);
        const dir = i % 2 ? 1 : -1;
        f.style.opacity = e;
        f.style.transform = `translate3d(0,${(1 - e) * (innerHeight * 0.55 + i * 50) - p * 40 * speeds[i]}px,0) rotate(${(1 - e) * dir * 7 + dir * 1.5}deg) scale(${0.88 + 0.12 * e})`;
      });
    }
    requestAnimationFrame(heroTick);
  }
  heroTick();

  /* ---------- reveal on scroll ---------- */
  function reveals() {
    if (reduce || !window.gsap || !window.ScrollTrigger) { $$('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; }); return; }
    gsap.registerPlugin(ScrollTrigger);
    $$('.reveal').forEach(el => {
      if (el.dataset.rv) return; el.dataset.rv = 1;
      gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
  }

  /* ---------- categories ---------- */
  const count = id => D.products.filter(p => p.cat === id).length;
  $('#catGrid').innerHTML = D.categories.map(c => {
    const n = count(c.id);
    const im = D.catImg[c.id] || (D.products.find(p => p.cat === c.id) || {}).img;
    return `<button class="cat reveal${im ? "" : " no-img"}" data-cat="${c.id}">${im ? `<span class="cat-bg"><img src="assets/products/${im}" alt="" loading="lazy"></span>` : ""}${icon(c.id)}<strong>${esc(c.name)}</strong><small>${n ? n + (n > 1 ? ' pieces' : ' piece') : 'Ask what is in stock'}</small></button>`;
  }).join('');

  /* ---------- catalogue ---------- */
  let active = 'all', query = '';
  const grid = $('#grid'), empty = $('#empty'), chips = $('#chips');
  chips.innerHTML = [{ id: 'all', name: 'All' }, ...D.categories].map(c =>
    `<button class="chip" role="tab" data-cat="${c.id}" aria-selected="${c.id === 'all'}">${esc(c.name)}</button>`).join('');

  let basket = [];
  try { basket = JSON.parse(localStorage.getItem('woodish-basket') || '[]').filter(l => D.products.some(p => p.id === l.id)); } catch (e) { }
  const save = () => { try { localStorage.setItem('woodish-basket', JSON.stringify(basket)); } catch (e) { } };
  const inBasket = id => basket.find(l => l.id === id);

  function card(p) {
    const inb = inBasket(p.id);
    const price = p.price ? `<span class="price">${money(p.price)}</span>` : `<span class="price ask">Price on WhatsApp</span>`;
    const ask = wa(`Assalam o Alaikum, I am interested in the "${p.name}". Can you share the price, sizes and availability?`);
    return `<article class="pc reveal" data-id="${p.id}">
      <div class="pc-img"><img src="assets/products/${p.img}" alt="${esc(p.name)}" loading="lazy" style="object-position:${p.pos || '50% 50%'}"><span class="pc-cat">${esc(catById[p.cat].name)}</span></div>
      <div class="pc-body">
        <h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>
        ${p.tags ? `<div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
        <div class="pc-foot">${price}<button class="add${inb ? ' in' : ''}" data-add="${p.id}">${inb ? 'In basket' : '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add'}</button></div>
        <a class="pc-ask" href="${ask}" target="_blank" rel="noopener">Ask about this piece</a>
      </div></article>`;
  }

  function renderGrid() {
    const q = query.trim().toLowerCase();
    const list = D.products.filter(p => (active === 'all' || p.cat === active) &&
      (!q || (p.name + ' ' + p.desc + ' ' + catById[p.cat].name + ' ' + (p.tags || []).join(' ')).toLowerCase().includes(q)));
    let html = list.map(card).join('');
    const catName = active === 'all' ? '' : catById[active].name;
    {
      const msg = active === 'all' || !catName ? 'Looking for something else?' : `More ${catName.toLowerCase()}`;
      const text = active === 'all' ? 'Assalam o Alaikum, I am looking for some furniture. Can you help?' : `Assalam o Alaikum, I am looking for ${catName.toLowerCase()}. What do you have in stock?`;
      html += `<div class="ask-card reveal"><h3>${msg}</h3><p>Our showroom has more than we can photograph. Tell us what you need and we will send pictures, sizes and prices.</p><a class="btn btn-gold" href="${wa(text)}" target="_blank" rel="noopener">Ask on WhatsApp</a></div>`;
    }
    grid.innerHTML = html;
    empty.hidden = list.length > 0;
    if (!list.length) empty.innerHTML = q ? `Nothing matches "${esc(query)}". <a href="${wa('Assalam o Alaikum, I am looking for: ' + query)}" target="_blank" rel="noopener">Ask us on WhatsApp</a>.`
      : `Photos for ${esc(catName.toLowerCase())} are coming soon. <a href="${wa(`Assalam o Alaikum, I am looking for ${catName.toLowerCase()}. What do you have in stock?`)}" target="_blank" rel="noopener">Ask us what is in stock</a>.`;
    reveals();
  }
  function setCat(id, scroll) {
    active = id;
    $$('.chip').forEach(c => c.setAttribute('aria-selected', c.dataset.cat === id));
    renderGrid();
    if (scroll) { const t = $('#catalogue'); lenis ? lenis.scrollTo(t, { offset: -64 }) : t.scrollIntoView({ behavior: 'smooth' }); }
  }
  chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) setCat(b.dataset.cat); });
  $('#catGrid').addEventListener('click', e => { const b = e.target.closest('.cat'); if (b) setCat(b.dataset.cat, true); });
  $('#q').addEventListener('input', e => { query = e.target.value; renderGrid(); });

  /* ---------- basket ---------- */
  const drawer = $('#drawer'), scrim = $('#scrim'), body = $('#drawerBody'), form = $('#orderForm');
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }

  function paintBasket() {
    const n = basket.reduce((s, l) => s + l.qty, 0);
    $('#basketCount').textContent = n;
    $('#sendWa').disabled = n === 0;
    if (!basket.length) {
      body.innerHTML = `<div class="basket-empty"><svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 11H6.2zM9 8V6a3 3 0 0 1 6 0v2"/></svg><p>Your basket is empty.<br>Add a few pieces and send them to us together.</p></div>`;
      return;
    }
    body.innerHTML = basket.map(l => {
      const p = D.products.find(x => x.id === l.id);
      return `<div class="line" data-id="${p.id}"><img src="assets/products/${p.img}" alt="" style="object-position:${p.pos || '50% 50%'}">
        <div><h4>${esc(p.name)}</h4><small>${esc(catById[p.cat].name)}${p.price ? ' &middot; ' + money(p.price) : ''}</small>
        <div class="qty"><button data-q="-1" aria-label="Fewer">&minus;</button><span>${l.qty}</span><button data-q="1" aria-label="More">+</button></div></div>
        <button class="rm" data-rm="${p.id}">Remove</button></div>`;
    }).join('');
  }
  function openDrawer() {
    drawer.classList.add('on'); drawer.setAttribute('aria-hidden', 'false');
    scrim.hidden = false; requestAnimationFrame(() => scrim.classList.add('on'));
    lenis && lenis.stop(); document.documentElement.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); scrim.classList.remove('on');
    setTimeout(() => { scrim.hidden = true; }, 300);
    lenis && lenis.start(); document.documentElement.style.overflow = '';
  }
  $('#basketBtn').addEventListener('click', openDrawer);
  $('#drawerClose').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('on')) closeDrawer(); });

  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    const id = b.dataset.add, line = inBasket(id), p = D.products.find(x => x.id === id);
    if (line) { openDrawer(); return; }
    basket.push({ id, qty: 1 }); save(); paintBasket();
    b.classList.add('in'); b.textContent = 'In basket';
    const btn = $('#basketBtn'); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
    toast(`${p.name} added to basket`);
  });
  body.addEventListener('click', e => {
    const row = e.target.closest('.line'); if (!row) return;
    const line = inBasket(row.dataset.id);
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { line.qty = clamp(line.qty + Number(q.dataset.q), 1, 20); }
    if (rm) { basket = basket.filter(l => l !== line); }
    save(); paintBasket(); renderGrid();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!basket.length) return;
    const f = new FormData(form);
    const lines = basket.map((l, i) => {
      const p = D.products.find(x => x.id === l.id);
      return `${i + 1}. ${p.name} x ${l.qty}${p.price ? ' (' + money(p.price) + ' each)' : ''}`;
    }).join('\n');
    const msg = `Assalam o Alaikum Woodish Furniture, I would like to order / enquire about:\n\n${lines}\n\n` +
      `Payment: ${f.get('pay')}\nDelivery: ${f.get('ship')}${f.get('area') ? ' (' + f.get('area') + ')' : ''}\n` +
      (f.get('name') ? `Name: ${f.get('name')}\n` : '') + (f.get('notes') ? `Notes: ${f.get('notes')}\n` : '') +
      `\nPlease confirm availability, price and delivery. Thank you.`;
    window.open(wa(msg), '_blank', 'noopener');
  });

  /* ---------- go ---------- */
  paintBasket(); renderGrid(); reveals();
  if (window.ScrollTrigger) addEventListener('load', () => ScrollTrigger.refresh());
})();
