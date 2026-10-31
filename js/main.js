(async function () {

  await language.init();         
  render.init();                  
  navigation.init();              
  contactForm.init();         

  document.documentElement.classList.add("ready");   

})();
