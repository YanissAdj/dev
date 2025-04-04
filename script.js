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