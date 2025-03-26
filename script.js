let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = cart.reduce((sum, item) => sum + item.subtotal, 0);

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
    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.subtotal += price;
    } else {
        cart.push({ title, price, quantity: 1, subtotal: price });
    }
    total += price;
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`L'article "${title}" a été ajouté au panier.`);
}

function replaceCartItem(title, price) {
    const editingIndex = parseInt(localStorage.getItem('editingItemIndex'));
    if (!isNaN(editingIndex)) {
        cart.splice(editingIndex, 0, {
            title,
            price,
            quantity: 1,
            subtotal: price
        });
        total += price;
        localStorage.removeItem('editingItemIndex');
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`L'article "${title}" a remplacé l'article précédent.`);
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.price}€</p>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>
            <p class="cart-item-subtotal">${item.subtotal}€</p>
            <div class="cart-item-actions">
                <button class="edit-item" onclick="editCartItem(${index})">Modifier</button>
                <button class="remove-item" onclick="removeCartItem(${index})">Supprimer</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    document.getElementById('cart-total').textContent = total;
    localStorage.setItem('cart', JSON.stringify(cart));
}

function changeQuantity(index, delta) {
    const item = cart[index];
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0) {
        item.quantity = newQuantity;
        item.subtotal = item.price * newQuantity;
        total += item.price * delta;
    } else {
        total -= item.subtotal;
        cart.splice(index, 1);
    }
    updateCart();
}

function removeCartItem(index) {
    const item = cart[index];
    total -= item.subtotal;
    cart.splice(index, 1);
    updateCart();
}

function editCartItem(index) {
    const item = cart[index];
    if (confirm(`Voulez-vous modifier l'article "${item.title}" ? Vous serez redirigé vers l'accueil pour choisir un nouvel article.`)) {
        total -= item.subtotal;
        cart.splice(index, 1);
        updateCart();
        localStorage.setItem('editingItemIndex', index);
        window.location.href = 'accueil.html';
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide. Ajoutez des articles avant de finaliser la commande.');
        return;
    }

    if (confirm('Êtes-vous sûr de vouloir finaliser votre commande ?')) {
        alert('Merci pour votre commande ! Nous vous contacterons rapidement pour finaliser la transaction.');
        cart = [];
        total = 0;
        updateCart();
    }
}

function clearCart() {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        cart = [];
        total = 0;
        updateCart();
        alert('Votre panier a été vidé.');
    }
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

function resetProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const button = card.querySelector('button');
        button.textContent = 'Réserver';
        button.onclick = function() {
            const title = card.querySelector('h3').textContent;
            const price = parseFloat(card.querySelector('p:last-child').textContent.replace('Prix: ', '').replace('€', ''));
            addToCart(title, price);
        };
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