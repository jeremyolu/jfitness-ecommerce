const basketOpen = document.getElementById('basket');
const basketClose = document.getElementById('basket-close');
const basket = document.getElementById('shopping-basket-container');

var menuIcon = document.getElementById('open');
var closeIcon = document.getElementById('close');
var navbarLinks = document.getElementById('nav-items');

menuIcon.addEventListener('click', showMenu);
closeIcon.addEventListener('click', closeMenu);

basketOpen.addEventListener('click', () => {
    basket.style.display = 'block';
    closeMenu();
});

basketClose.addEventListener('click', () => {
    basket.style.display = 'none';
});

function showMenu() {
    navbarLinks.style.right = "0";
}

function closeMenu() {
    navbarLinks.style.right = "-200px";
}