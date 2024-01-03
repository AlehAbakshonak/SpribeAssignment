export function setProperInnerHeight() {
   let vh = window.innerHeight * 0.01;
   document.documentElement.style.setProperty('--vh', `${vh}px`);
}

export function debounce(timeout, func){
   let timer;
   return function(event){
      if(timer) clearTimeout(timer);
      timer = setTimeout(func,timeout,event);
   };
}