document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur a déjà fait son choix
    if (!localStorage.getItem('cookieConsent')) {
        // Créer la bannière
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant à naviguer, vous acceptez notre utilisation des cookies.</p>
                <div class="cookie-buttons">
                    <button onclick="acceptCookies()" class="accept-btn">Accepter</button>
                    <button onclick="rejectCookies()" class="reject-btn">Refuser</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
    }
});

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookie-banner').style.display = 'none';
    // Ajouter ici le code pour activer les cookies si nécessaire
}

function rejectCookies() {
    localStorage.setItem('cookieConsent', 'rejected');
    document.getElementById('cookie-banner').style.display = 'none';
    // Ajouter ici le code pour désactiver les cookies si nécessaire
} 