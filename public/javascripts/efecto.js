
/*Selector del Registro*/
const register = document.querySelector(".register");
const registerForm = document.querySelector(".register form");
const buttonRegister = document.getElementById('register'); /*Obteniendo el evento click*/

/*Selector del Login*/
const login = document.querySelector(".login");
const loginForm = document.querySelector(".login form");
const buttonLogin = document.getElementById('login'); /*Obteniendo el evento click*/

const astronautaRegister = document.querySelector(".astronauta");
const astronautaLogin = document.querySelector(".astronauta-1");

buttonLogin.addEventListener('click', () => {
    register.style.background = "#34bbc7";
    registerForm.style.opacity = 0;
    registerForm.style.pointerEvents = "none";
    login.style.background = 'transparent';
    loginForm.style.opacity = 1;
    loginForm.style.pointerEvents = "all";
    astronautaRegister.style.opacity = 1;
    astronautaRegister.style.zIndex = 1;
    astronautaLogin.style.opacity = 0;
    astronautaLogin.style.zIndex = -1;

})

buttonRegister.addEventListener('click', () => {
    register.style.background = "transparent";
    registerForm.style.opacity = 1;
    registerForm.style.pointerEvents = "all";
    login.style.background = '#34bbc7';
    loginForm.style.opacity = 0;
    loginForm.style.pointerEvents = "none";
    astronautaRegister.style.opacity = 0;
    astronautaRegister.style.zIndex = -1;
    astronautaLogin.style.opacity = 1;
    astronautaLogin.style.zIndex = 1;
})
