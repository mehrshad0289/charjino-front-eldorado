#!/usr/bin/env python3
"""Session 13 — final detail probe for the blog article template.

Covers: toc-box radius/anchors, share buttons, ayudawp-title, RELATED
GUIDES heading + card styles, hr separator, mobile TOC floating button,
breadcrumb separators, entry h3/iframe/figure markup.

Output: /tmp/blog_article_details2.json
"""

import json
from playwright.sync_api import sync_playwright

URL = "https://www.eldorado.gg/blog/insider-interviews/mark-darrah-bioware-shutdown-dragon-age-veilguard-interview/"

JS = r"""
() => {
  const cs = (el) => el ? getComputedStyle(el) : null;
  const rect = (el) => { const r = el.getBoundingClientRect(); return {top: Math.round(r.top+scrollY), h: Math.round(r.height), w: Math.round(r.width), left: Math.round(r.left)}; };
  const S = (el, keys) => { const c = cs(el); if (!c) return null; const o = {}; for (const k of keys) o[k] = (c[k]||'').toString().slice(0,70); return o; };
  const out = {};

  const toc = document.querySelector('.toc-box');
  out.tocBox = toc ? S(toc, ['backgroundColor','border','borderRadius','padding','width']) : null;
  out.tocTitle = S(document.querySelector('.toc-box-title'), ['fontSize','fontWeight','letterSpacing','textTransform','margin']);
  const tl = document.querySelector('.toc-box-links');
  out.tocLinksWrap = tl ? S(tl, ['padding','margin']) : null;
  out.tocLi = tl ? S(tl.querySelector('li'), ['padding','margin','lineHeight']) : null;

  // share buttons
  const btns = [...document.querySelectorAll('.ayudawp-share-btn')];
  out.shareBtnCount = btns.length;
  out.shareBtns = btns.slice(0,5).map(b => ({cls: (b.className||'').slice(0,60), rect: rect(b), st: S(b, ['backgroundColor','borderRadius','width','height','border'])}));
  out.ayudawpTitle = S(document.querySelector('.ayudawp-title'), ['fontSize','fontWeight','fontFamily','color','margin']);
  out.ayudawpContainer = S(document.querySelector('.ayudawp-buttons-container'), ['display','gap','margin','padding']);

  // RELATED GUIDES heading + grid
  const rg = [...document.querySelectorAll('h2,h3')].find(h => (h.textContent||'').trim().toLowerCase() === 'related guides');
  out.relatedGuidesH2 = rg ? {tag: rg.tagName, cls: (rg.className||'').slice(0,80), st: S(rg, ['fontSize','fontWeight','fontFamily','textTransform','letterSpacing','margin','color'])} : null;
  if (rg) {
    // cards: next siblings
    let n = rg.parentElement;
    out.rgParentCls = (n.className||'').toString().slice(0,80);
    const grid = [...document.querySelectorAll('*')].find(e => e !== rg && (e.className||'').toString().includes('related') && e.querySelector('img') && rect(e).w > 500);
    out.rgGridCls = grid ? (grid.className||'').toString().slice(0,100) : null;
  }
  // related guide card probe: find anchors with img + h3/h4 near RELATED GUIDES
  const rgSection = rg ? rg.closest('section') || rg.parentElement.parentElement : null;
  out.rgSectionCls = rgSection ? (rgSection.className||'').toString().slice(0,90) : null;
  if (rgSection) {
    const cards = [...rgSection.querySelectorAll('a')].filter(a => a.querySelector('img')).slice(0, 3);
    out.rgCards = cards.map(a => ({
      cls: (a.className||'').toString().slice(0,80), href: a.getAttribute('href'),
      rect: rect(a),
      st: S(a, ['display','gap','gridTemplateColumns']),
      img: (() => { const i = a.querySelector('img'); return i ? {src:(i.currentSrc||i.src).slice(0,130), rect: rect(i), st: S(i, ['borderRadius','width','height','objectFit'])} : null; })(),
      cat: (() => { const els=[...a.querySelectorAll('*')].filter(e=>e.children.length===0); const cat = els.find(e=>/insider|interviews|grand|guide/i.test(e.textContent)&&e.textContent.length<30); return cat ? {text: cat.textContent.trim().slice(0,30), st: S(cat, ['fontSize','fontWeight','color','textTransform','letterSpacing','margin'])} : null; })(),
      title: (() => { const t = a.querySelector('h3,h4,.title,div'); return t ? {tag: t.tagName, text: t.textContent.trim().slice(0,50), st: S(t, ['fontSize','fontWeight','color','lineHeight'])} : null; })(),
      date: (() => { const els=[...a.querySelectorAll('*')].filter(e=>e.children.length===0); const d = els.find(e=>/\d{1,2} \w{3} \d{4}/.test(e.textContent)); return d ? {text: d.textContent.trim().slice(0,40), st: S(d, ['fontSize','color'])} : null; })(),
    }));
  }

  // hr separator (gold line above Social Share)
  const hrs = [...document.querySelectorAll('hr')].slice(0, 3);
  out.hrs = hrs.map(h => ({rect: rect(h), st: S(h, ['backgroundColor','border','height','margin','width','opacity'])}));
  // also dividers that are not <hr>
  const gold = [...document.querySelectorAll('div,span')].filter(e => {
    const c = cs(e); if (!c) return false;
    return e.offsetHeight <= 3 && e.offsetWidth > 300 && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'rgb(255, 255, 255)';
  }).slice(0,4);
  out.dividers = gold.map(e => ({cls: (e.className||'').toString().slice(0,60), rect: rect(e), st: S(e, ['backgroundColor','height','margin','width'])}));

  // breadcrumb separators + current
  const bc = document.querySelector('.breads');
  out.breadsHTML = bc ? bc.innerHTML.replace(/\s+/g,' ').slice(0, 700) : null;
  out.breadLink = S(bc ? bc.querySelector('a') : null, ['fontSize','color','fontWeight']);
  const sep = bc ? bc.querySelector('li:not(:first-child)') : null;
  // find separator glyph spans
  if (bc) { const li2 = bc.querySelectorAll('li')[1]; out.breadLi2 = li2 ? {text: li2.textContent.trim().slice(0,40), st: S(li2, ['fontSize','color'])} : null;
    const svg = bc.querySelector('svg, img'); out.breadSepImg = svg ? {tag: svg.tagName, src: (svg.src||'').slice(0,120), rect: rect(svg)} : null; }

  // entry: iframe embed
  const ifr = document.querySelector('.entry iframe');
  out.iframe = ifr ? {src: (ifr.src||'').slice(0,140), rect: rect(ifr), st: S(ifr, ['width','height','borderRadius','aspectRatio'])} : null;
  const ifrParent = ifr ? ifr.parentElement : null;
  out.iframeParent = ifrParent ? {tag: ifrParent.tagName, cls: (ifrParent.className||'').toString().slice(0,80), rect: rect(ifrParent)} : null;
  // entry: figure/figcaption
  const fig = document.querySelector('.entry figure');
  out.figure = fig ? {cls: (fig.className||'').toString().slice(0,80), rect: rect(fig), st: S(fig, ['margin','padding']), img: (()=>{const i=fig.querySelector('img'); return i?{src:(i.currentSrc||i.src).slice(0,130), rect: rect(i), st: S(i,['borderRadius'])}:null;})(), cap: (()=>{const c=fig.querySelector('figcaption'); return c?{text:c.textContent.trim().slice(0,60), st: S(c,['fontSize','color','margin'])}:null;})()} : null;
  // entry h3
  const h3 = document.querySelector('.entry h3');
  out.entryH3 = h3 ? {text: h3.textContent.trim().slice(0,50), st: S(h3, ['fontSize','fontWeight','fontFamily','margin','color','lineHeight'])} : null;
  // entry ol
  const ol = document.querySelector('.entry ol');
  out.entryOl = ol ? S(ol, ['listStyleType','padding','margin']) : null;
  // Q:/MD: prefix markup
  const qP = [...document.querySelectorAll('.entry p')].find(p => p.textContent.trim().startsWith('Q:'));
  out.qHTML = qP ? qP.innerHTML.slice(0, 300) : null;
  const mdP = [...document.querySelectorAll('.entry p')].find(p => p.textContent.trim().startsWith('MD:'));
  out.mdHTML = mdP ? mdP.innerHTML.slice(0, 300) : null;
  // floating mobile toc button (fixed positioned elements)
  out.fixed = [...document.querySelectorAll('body *')].filter(e => {
    const c = cs(e); return c && c.position === 'fixed' && e.offsetHeight > 20 && e.offsetHeight < 120 && e.offsetWidth > 20 && e.offsetWidth < 120;
  }).slice(0, 6).map(e => ({tag: e.tagName, cls: (e.className||'').toString().slice(0,70), rect: rect(e), st: S(e, ['backgroundColor','borderRadius','border','right','bottom','display'])}));
  // footer lang selector presence
  const f = document.querySelector('footer');
  out.footerHasLang = f ? !!f.textContent.toLowerCase().includes('english') : null;
  out.footerHTMLSnippet = f ? f.textContent.replace(/\s+/g,' ').slice(0, 200) : null;
  return out;
}
"""

def main():
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        p = b.new_page(viewport={"width":1920,"height":900})
        p.goto(URL, wait_until="domcontentloaded", timeout=60000)
        p.wait_for_timeout(5000)
        data = p.evaluate(JS)
        # mobile fixed elements
        p2 = b.new_page(viewport={"width":390,"height":800})
        p2.goto(URL, wait_until="domcontentloaded", timeout=60000)
        p2.wait_for_timeout(5000)
        data["mobileFixed"] = p2.evaluate("""() => [...document.querySelectorAll('body *')].filter(e => {
            const c = getComputedStyle(e); return c && c.position === 'fixed' && e.offsetHeight > 20 && e.offsetWidth > 20;
          }).slice(0, 8).map(e => ({tag: e.tagName, cls: (e.className||'').toString().slice(0,70),
            rect: (()=>{const r=e.getBoundingClientRect(); return {t:Math.round(r.top),l:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height)};})(),
            st: (()=>{const c=getComputedStyle(e); return {bg:c.backgroundColor, br:c.borderRadius, right:c.right, bottom:c.bottom, z:c.zIndex};})(),
            text: e.textContent.trim().slice(0,40)}))""")
        data["mobileToc"] = p2.evaluate("""() => {
          const t = document.querySelector('.toc-box');
          if (!t) return 'no .toc-box';
          const c = getComputedStyle(t);
          return {display: c.display, rect: (()=>{const r=t.getBoundingClientRect(); return {t:Math.round(r.top),l:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height)};})()};
        }""")
        data["mobileHeroBg"] = p2.evaluate("""() => {
          const h = document.querySelector('.single-hero-bg img') || document.querySelector('.single-hero-bg');
          if (!h) return null;
          const r = h.getBoundingClientRect();
          return {t: Math.round(r.top + scrollY), h: Math.round(r.height), w: Math.round(r.width)};
        }""")
        data["mobileSingleContent"] = p2.evaluate("""() => {
          const s = document.querySelector('.single-content-split');
          const l = document.querySelector('.single-content-left');
          const c = s ? getComputedStyle(s) : null;
          return {split: s ? (()=>{const r=s.getBoundingClientRect(); return {w:Math.round(r.width), pad:c.padding, disp:c.display};})() : null,
                  left: l ? (()=>{const r=l.getBoundingClientRect(); return {w:Math.round(r.width)};})() : null};
        }""")
        b.close()
    with open("/tmp/blog_article_details2.json", "w") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
    print("saved")

if __name__ == "__main__":
    main()
