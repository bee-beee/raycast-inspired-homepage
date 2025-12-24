// Minimal interactions: command palette (⌘/Ctrl+K), mock suggestions, reveal on scroll.

const suggestionsData = [
  "Open Calendar",
  "Search Files",
  "New Note",
  "Run Build",
  "Toggle Dark Mode",
  "Show Today",
  "Open Inbox",
  "Create Task"
];

// Typing effect for mock command prompt in hero
(function heroTyping(){
  const input = document.getElementById('cmdInput');
  const sug = document.getElementById('suggestions');
  if(!input || !sug) return;

  let idx = 0;
  function cycle(){
    // show a rotating set of suggestions
    sug.innerHTML = '';
    for(let i=0;i<3;i++){
      const li = document.createElement('li');
      li.textContent = suggestionsData[(idx+i)%suggestionsData.length];
      sug.appendChild(li);
    }
    idx = (idx+1) % suggestionsData.length;
  }
  cycle();
  setInterval(cycle, 2200);
})();

// Reveal-on-scroll
(function revealOnScroll(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, {threshold: 0.08});
  els.forEach(el=>io.observe(el));
})();

// Overlay command palette logic
(function overlay(){
  const overlay = document.getElementById('commandOverlay');
  const overlayInput = document.getElementById('overlayInput');
  const overlayList = document.getElementById('overlayList');
  const openBtn = document.getElementById('openCmd');

  function openOverlay() {
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    overlayInput.value = '';
    overlayInput.focus();
    renderList(suggestionsData);
  }
  function closeOverlay() {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
  }
  function renderList(items){
    overlayList.innerHTML = '';
    items.slice(0,8).forEach(it=>{
      const li = document.createElement('li');
      li.textContent = it;
      li.addEventListener('click', ()=> {
        // simulated action
        overlayInput.value = '';
        closeOverlay();
        flash(`${it} — opened`);
      });
      overlayList.appendChild(li);
    });
    if(items.length===0){
      const li = document.createElement('li');
      li.textContent = 'No results';
      overlayList.appendChild(li);
    }
  }

  function flash(msg){
    const f = document.createElement('div');
    f.textContent = msg;
    Object.assign(f.style, {
      position:'fixed', left:'50%', top:'8%', transform:'translateX(-50%)',
      background:'rgba(255,255,255,0.06)', padding:'10px 16px', borderRadius:'10px',
      zIndex:200, color:'white', fontWeight:600
    });
    document.body.appendChild(f);
    setTimeout(()=> f.style.opacity = '0', 1400);
    setTimeout(()=> f.remove(), 2000);
  }

  // open on button
  openBtn && openBtn.addEventListener('click', openOverlay);

  // keyboard: Cmd/Ctrl+K to open
  window.addEventListener('keydown', (e)=>{
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
      e.preventDefault();
      const hidden = overlay.classList.contains('hidden');
      if(hidden) openOverlay(); else closeOverlay();
    }
    if(e.key === 'Escape'){
      if(!overlay.classList.contains('hidden')) closeOverlay();
    }
  });

  // search filtering
  overlayInput && overlayInput.addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase().trim();
    if(q === '') renderList(suggestionsData);
    else renderList(suggestionsData.filter(s => s.toLowerCase().includes(q)));
  });

  // click outside to close
  overlay.addEventListener('click', (e)=>{
    if(e.target === overlay) closeOverlay();
  });
})();
