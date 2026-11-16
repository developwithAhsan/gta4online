document.addEventListener("DOMContentLoaded",()=>{
  const search=document.getElementById("blogSearch");
  const category=document.getElementById("blogCategory");
  const cards=[...document.querySelectorAll(".blog-card")];
  const empty=document.getElementById("noResults");
  function filter(){
    const q=(search?.value||"").trim().toLowerCase();
    const c=category?.value||"all";
    let count=0;
    cards.forEach(card=>{
      const ok=(c==="all"||card.dataset.category===c)&&card.textContent.toLowerCase().includes(q);
      card.hidden=!ok;if(ok)count++;
    });
    if(empty)empty.hidden=count!==0;
  }
  search?.addEventListener("input",filter);
  category?.addEventListener("change",filter);
  const toggle=document.getElementById("menuToggle"),nav=document.querySelector(".blog-nav");
  toggle?.addEventListener("click",()=>{
    const open=toggle.getAttribute("aria-expanded")==="true";
    toggle.setAttribute("aria-expanded",String(!open));
    nav?.classList.toggle("nav-open",!open);
  });
});