(() => {
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

  // Header: solid after scroll, mobile menu, active section
  const header = $('#site-header')
  const toggle = $('.site-header__toggle')
  const onScroll = () => header.classList.toggle('is-solid', scrollY > 40)
  onScroll()
  addEventListener('scroll', onScroll, { passive: true })

  const setMenu = (open) => {
    header.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.textContent = open ? 'Close' : 'Index'
    document.body.style.overflow = open ? 'hidden' : ''
  }
  toggle.addEventListener('click', () => setMenu(!header.classList.contains('is-open')))
  addEventListener('keydown', (e) => e.key === 'Escape' && header.classList.contains('is-open') && setMenu(false))
  $$('.site-header__nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)))

  const links = $$('.site-header__nav a')
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return
        links.forEach((a) => (a.getAttribute('href') === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')))
      }),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach((a) => { const s = $(a.getAttribute('href')); s && io.observe(s) })
  }

  // Reveal: only hide elements that start below the fold, and only when motion is OK
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    $$('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.92) return
      el.classList.add('reveal')
      io.observe(el)
    })
  }

  // Lightbox
  const dlg = $('#lightbox')
  const big = $('img', dlg)
  let opener = null
  const close = () => { dlg.close(); opener && opener.focus() }
  $$('.zoom').forEach((b) => b.addEventListener('click', () => {
    opener = b
    big.src = b.dataset.full
    big.alt = b.dataset.alt
    dlg.showModal()
  }))
  $('.lightbox__close', dlg).addEventListener('click', close)
  dlg.addEventListener('click', (e) => e.target === dlg && close())
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close() })
})()
