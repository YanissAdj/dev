let cart = [];
let total = 0;

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showCategory(categoryId) {
    const selectedCategory = document.getElementById(categoryId);
    if (selectedCategory.style.display === 'none' || selectedCategory.style.display === '') {
        selectedCategory.style.display = 'grid';
    } else {
        selectedCategory.style.display = 'none';
    }
}

function addToCart(title, price) {
    cart.push({title, price});
    total += price;
    updateCart();
    showPage('panier');
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.price}€</p>
        `;
        cartItems.appendChild(cartItem);
    });
    document.getElementById('cart-total').textContent = total;
}

function checkout() {
    alert('Merci pour votre commande ! Nous vous contacterons rapidement pour finaliser la transaction.');
    cart = [];
    total = 0;
    updateCart();
}

function searchVinyl(query) {
    query = query.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
   
    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
       
        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Fonctions pour l'authentification
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Ici, vous pouvez ajouter la logique de connexion
    console.log('Tentative de connexion:', { email, password });
    alert('Connexion réussie !');
    showPage('accueil');
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas !');
        return;
    }
    
    // Ici, vous pouvez ajouter la logique d'inscription
    console.log('Tentative d\'inscription:', { name, email, password });
    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    showPage('connexion');
} 