
// Very small lightbox: click any link.lightbox -> open overlay with full image
(function(){
  const layer = document.createElement('div');
  layer.className = 'lightbox-layer';
  layer.innerHTML = '<button class="lightbox-close" aria-label="Tutup">Tutup</button><div class="lightbox-content"></div>';
  document.body.appendChild(layer);
  const content = layer.querySelector('.lightbox-content');
  const close = layer.querySelector('.lightbox-close');
  function open(src, alt){
    content.innerHTML = '';
    const img = new Image();
    img.alt = alt || '';
    img.onload = ()=> layer.classList.add('show');
    img.src = src;
    content.appendChild(img);
  }
  function hide(){ layer.classList.remove('show'); }
  close.addEventListener('click', hide);
  layer.addEventListener('click', (e)=>{ if(e.target === layer) hide(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') hide(); });

  document.querySelectorAll('a.lightbox').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      open(a.getAttribute('href'), a.querySelector('img')?.alt);
    });
  });
})();
