// Variables globales
let cart = [];
let total = 0;
let editingItemIndex = null; // Pour stocker l'index de l'article en cours de modification

// Fonctions de navigation
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

// Fonction pour mettre à jour la quantité
function updateQuantity(inputId, change) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    let value = parseInt(input.value) + change;
    if (value < 1) value = 1;
    if (value > 10) value = 10;
    
    input.value = value;
}


function addToCart(productName, price, qtyInputId) {
    const qtyInput = document.getElementById(qtyInputId);
    if (!qtyInput) return;
    
    const quantity = parseInt(qtyInput.value);
    if (isNaN(quantity) || quantity < 1) {
        alert('Veuillez sélectionner une quantité valide');
        return;
    }
    
    // Si on est en train de modifier un article
    if (editingItemIndex !== null) {
        cart[editingItemIndex] = {
            name: productName,
            price: price,
            quantity: quantity,
            total: price * quantity
        };
        editingItemIndex = null;
    } else {
        // Vérifier si l'article existe déjà dans le panier
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.total = existingItem.quantity * price;
        } else {
            cart.push({
                name: productName,
                price: price,
                quantity: quantity,
                total: price * quantity
            });
        }
    }
    
    // Sauvegarder le panier et réinitialiser la quantité
    saveCart();
    qtyInput.value = 1;
    alert(`${quantity} ${productName} ajouté(s) au panier !`);
    
    // Rediriger vers le panier
    window.location.href = 'panier.html';
}

// Fonction pour modifier un article
function editCartItem(index) {
    // Supprimer l'article actuel
    cart.splice(index, 1);
    saveCart();
    
    // Rediriger vers l'accueil pour choisir un nouvel article
    window.location.href = 'accueil.html';
}

// Fonction pour supprimer du panier
function removeFromCart(index) {
    const item = cart[index];
    total -= item.total;
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

// Fonction pour échapper les entrées utilisateur (protection XSS)
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Fonction pour mettre à jour l'affichage du panier
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Votre panier est vide</div>';
        cartTotal.innerHTML = '';
        return;
    }
    
    cart.forEach((item, index) => {
        total += item.total;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${escapeHTML(item.name)}</h3>
                    <p>Prix unitaire: ${escapeHTML(item.price.toString())}€</p>
                    <p>Quantité: ${escapeHTML(item.quantity.toString())}</p>
                    <p>Total: ${escapeHTML(item.total.toString())}€</p>
                </div>
                <div class="cart-buttons">
                    <button onclick="editCartItem(${index})" class="edit-btn">Modifier</button>
                    <button onclick="removeFromCart(${index})" class="remove-btn">Supprimer</button>
                </div>
            </div>
        `;
    });
    
    cartTotal.innerHTML = `<p>Total du panier: ${total.toFixed(2)}€</p>`;
}

// Fonction pour sauvegarder le panier
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Fonction pour vider le panier
function clearCart() {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        cart = [];
        saveCart();
    }
}

function toggleCart() {
    const cartSection = document.getElementById('cart-section');
    if (cartSection) {
        cartSection.style.display = cartSection.style.display === 'none' ? 'block' : 'none';
    }
}

// Fonction de recherche de vinyles
function searchVinyl(query) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Fonctions d'authentification
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
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
    
    console.log('Tentative d\'inscription:', { name, email, password });
    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    showPage('connexion');
}

// Protection CSRF : Ajout d'un jeton CSRF dans les requêtes sensibles
function getCSRFToken() {
    return localStorage.getItem('csrfToken') || generateCSRFToken();
}

function generateCSRFToken() {
    const token = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
    localStorage.setItem('csrfToken', token);
    return token;
}

// Exemple d'utilisation du jeton CSRF dans une requête
function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
    }

    const csrfToken = getCSRFToken();
    if (confirm('Êtes-vous sûr de vouloir finaliser votre commande ?')) {
        // Simuler une requête avec le jeton CSRF
        console.log('Commande envoyée avec le jeton CSRF :', csrfToken);
        alert('Commande finalisée avec succès !');
        cart = [];
        saveCart();
        window.location.href = 'accueil.html';
    }
}

// Charger le panier au démarrage
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }


// Fonctions pour la liste de souhaits
function toggleWishlist(title, price, image) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const itemId = title.toLowerCase().replace(/\s+/g, '-');
    
    const existingItem = wishlist.find(item => item.id === itemId);
    if (existingItem) {
        wishlist = wishlist.filter(item => item.id !== itemId);
        showToast('Produit retiré des favoris', 'info');
    } else {
        wishlist.push({
            id: itemId,
            title: title,
            price: price,
            image: image,
            description: "Vinyle d'exception"
        });
        showToast('Produit ajouté aux favoris', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistIcons();
    updateWishlistCount();
}

function updateWishlistIcons() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    document.querySelectorAll('.wishlist-icon').forEach(icon => {
        const itemId = icon.getAttribute('data-title').toLowerCase().replace(/\s+/g, '-');
        if (wishlist.some(item => item.id === itemId)) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const countElement = document.getElementById('wishlist-count');
    if (countElement) {
        countElement.textContent = wishlist.length;
    }
}

function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistContainer = document.getElementById('wishlist-items');
    
    if (wishlistContainer) {
        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="empty-wishlist">
                    <p>Votre liste de favoris est vide</p>
                    <p>Parcourez notre collection pour ajouter des vinyles à vos favoris</p>
                    <button onclick="window.location.href='collection.html'">Voir la collection</button>
                </div>
            `;
            return;
        }

        wishlistContainer.innerHTML = wishlist.map(item => `
            <div class="wishlist-item">
                <button class="remove-from-wishlist" onclick="toggleWishlist('${item.title}', ${item.price}, '${item.image}')">×</button>
                <img src="${item.image}" alt="${item.title}">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p class="price">${item.price}€</p>
                <button class="add-to-cart" onclick="addToCart('${item.title}', ${item.price})">Ajouter au panier</button>
            </div>
        `).join('');
    }
}

// Fonction pour afficher un message temporaire
function showToast(message, type = 'info') {
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Fonction  recommandations basées sur le panier
function generateRecommendations() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const allProducts = [
        {
            id: 1,
            title: "Led Zeppelin IV",
            description: "Edition Originale de 1971",
            price: 245,
            image: "vinyl1.jpg",
            category: "rock"
        },
        {
            id: 2,
            title: "Kind of Blue",
            description: "Pressage Japonais Original",
            price: 335,
            image: "vinyl3.jpg",
            category: "jazz"
        },
        {
            id: 3,
            title: "What's Going On",
            description: "Motown Records - 1971",
            price: 250,
            image: "vinyl5.jpg",
            category: "soul"
        },
        {
            id: 4,
            title: "Dark Side of the Moon",
            description: "Réédition Audiophile 180g",
            price: 155,
            image: "vinyl2.jpg",
            category: "rock"
        }
    ];

    // Filtrer les produits qui ne sont pas dans le panier
    const availableProducts = allProducts.filter(product => 
        !cart.some(item => item.title === product.title)
    );

    // Trier par catégorie similaire si le panier n'est pas vide
    if (cart.length > 0) {
        const cartCategories = cart.map(item => item.category);
        availableProducts.sort((a, b) => {
            const aMatch = cartCategories.includes(a.category);
            const bMatch = cartCategories.includes(b.category);
            return bMatch - aMatch;
        });
    }


    return availableProducts.slice(0, 4);
}

// Fonction  appliquer un code promo
function applyPromoCode(code) {
    const promoCodes = {
        'WELCOME10': 0.10, // 10% de réduction
        'SUMMER20': 0.20, // 20% de réduction
        'VIP15': 0.15     // 15% de réduction
    };

    const discount = promoCodes[code.toUpperCase()];
    if (discount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
        const discountAmount = subtotal * discount;
        return {
            success: true,
            discount: discountAmount
        };
    }
    return {
        success: false,
        message: 'Code promo invalide'
    };
}

// Fonction  calculer les points de fidélité
function calculateLoyaltyPoints(amount) {
    // 1 point = 10€ dépensés
    return Math.floor(amount / 10);
}

// Mettre à jour les icônes de liste de souhaits et le compteur au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistIcons();
    updateWishlistCount();
    
    // Charger la liste de souhaits si on est sur la page wishlist.html
    if (window.location.pathname.includes('wishlist.html')) {
        loadWishlist();
    }
}); 
});