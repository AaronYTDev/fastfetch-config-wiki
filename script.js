const pages=[...
document.querySelectorAll('.page')];
const links=[...
document.querySelectorAll('nav a')];
const searchBtn=document.getElementById('searchBtn');
const overlay=document.getElementById('searchOverlay');
const closeSearch=document.getElementById('closeSearch');
const input=document.getElementById('searchInput');
const results=document.getElementById('searchResults');
const themeBtn=document.getElementById('themeBtn');

function show(route){
  route=(route||'home').replace('#','')||'home';
  const page=pages.find(p=>p.dataset.route===route)||pages[0];
  pages.forEach(p=>p.classList.toggle('active',p===page));
  links.forEach(a=>a.classList.toggle('active',a.dataset.page===page.dataset.route));
  window.scrollTo({top:0,behavior:'smooth'});
}

window.addEventListener('hashchange',()=>show(location.hash));
show(location.hash);


document.querySelectorAll('.copy').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const code=btn.parentElement.querySelector('pre').innerText;
    navigator.clipboard.writeText(code).then(()=>{
      const old=btn.textContent; btn.textContent='copied';
      setTimeout(()=>btn.textContent=old,1100);
    });
  });
});


function openSearch(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');input.focus();renderResults('')}
function close(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true')}
searchBtn.onclick=openSearch; closeSearch.onclick=close;
overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}
  if(e.key==='Escape')close();
});

const index=pages.map(p=>({route:p.dataset.route,title:p.querySelector('h1')?.textContent||p.dataset.route,text:p.innerText}));
function renderResults(q){
  const needle=q.trim().toLowerCase();
  const matches=index.filter(x=>!needle||x.title.toLowerCase().includes(needle)||x.text.toLowerCase().includes(needle)).slice(0,8);
  results.innerHTML=matches.map(x=>`<a class="result" href="#${x.route}"><b>${x.title}</b><small>${x.text.replace(/\s+/g,' ').slice(0,115)}…</small></a>`).join('')||'<div class="result"><b>No results</b><small>Try another phrase.</small></div>';
}
input.addEventListener('input',()=>renderResults(input.value));
results.addEventListener('click',()=>close());


if(localStorage.getItem('ff-wiki-theme')==='light') document.body.classList.add('light');
themeBtn.onclick=()=>{
  document.body.classList.toggle('light');
  localStorage.setItem('ff-wiki-theme',document.body.classList.contains('light')?'light':'dark');
};
