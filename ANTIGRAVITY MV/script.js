// Monedas Verdes Logic

// Initial Balance
let balance = 0;

// DOM Elements
const balanceDisplay = document.getElementById('mv-balance');

// Function to add points based on activity
function addPoints(activity) {
    let pointsToAdd = 0;
    let message = "";

    switch (activity) {
        case 'recycle':
            pointsToAdd = 10;
            message = "¡Reciclaste 10 botellas! Ganaste 10 MV.";
            break;
        case 'walk':
            // Simulation of walking 1km
            pointsToAdd = 10;
            message = "¡Caminaste 1km! Ganaste 10 MV.";
            break;
        case 'plant':
            pointsToAdd = 10;
            message = "¡Registraste un árbol! Ganaste 10 MV.";
            break;
        default:
            pointsToAdd = 0;
    }

    // Update Balance
    balance += pointsToAdd;

    // Animate Balance Update
    updateBalanceUI();

    // Show Alert (In a real app, this would be a toast notification)
    alert(message);
}

function updateBalanceUI() {
    balanceDisplay.textContent = balance;
    balanceDisplay.classList.add('highlight');
    setTimeout(() => {
        balanceDisplay.classList.remove('highlight');
    }, 500);
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Wizard Logic
function nextStep(currentStep) {
    // Validation logic could go here
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep + 1}`).classList.add('active');

    // Update progress bar
    document.querySelectorAll('.step-indicator')[currentStep].classList.add('active');
}

function prevStep(currentStep) {
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep - 1}`).classList.add('active');

    // Update progress bar
    document.querySelectorAll('.step-indicator')[currentStep - 1].classList.remove('active');
}

function updateRangeVal(input, displayId) {
    document.getElementById(displayId).textContent = input.value + '%';
}

function submitCompanyForm() {
    alert("¡Registro completado! Redirigiendo al Dashboard...");
    window.location.href = 'dashboard.html';
}

// --- User Gamification Logic ---

// User State
const userState = {
    name: "Alex",
    plan: "free", // free, plus, premium
    exp: 0,
    levelIndex: 0, // Current sub-level index
    fruits: [],
    referrals: { free: 0, paid: 0 },
    achievements: []
};

// Granular Level Configuration
const LEVEL_SYSTEM = {
    'free': [
        { name: 'Brote', icon: 'ph-plant', minExp: 0 },
        { name: 'Hoja', icon: 'ph-leaf', minExp: 100 },
        { name: 'Tallito', icon: 'ph-flower', minExp: 300 }
    ],
    'plus': [
        { name: 'Rama', icon: 'ph-plant', minExp: 0 },
        { name: 'Arbusto', icon: 'ph-tree', minExp: 500 },
        { name: 'Árbol Joven', icon: 'ph-tree-evergreen', minExp: 1000 }
    ],
    'premium': [
        { name: 'Árbol Maduro', icon: 'ph-tree', minExp: 0 },
        { name: 'Árbol Robusto', icon: 'ph-tree-palm', minExp: 2000 },
        { name: 'Árbol Legendario', icon: 'ph-tree-evergreen', minExp: 5000 }
    ]
};

// Mission Database (Mock)
const MISSIONS_DB = [
    { id: 1, type: 'personal', title: 'Reciclaje Semanal', desc: 'Lleva 10 botellas.', rewardMV: 1, rewardEXP: 50, icon: 'ph-recycle' },
    { id: 2, type: 'personal', title: 'Transporte Limpio', desc: '5km en bici.', rewardMV: 1, rewardEXP: 60, icon: 'ph-bicycle' },
    { id: 3, type: 'community', title: 'Limpieza de Parque', desc: 'Ayuda a limpiar el parque central.', rewardMV: 5, rewardEXP: 200, icon: 'ph-users-three' },
    { id: 4, type: 'corporate', title: 'Compra en EcoStore', desc: 'Sube foto de tu compra.', rewardMV: 2, rewardEXP: 100, icon: 'ph-shopping-bag' }
];

const MV_BASE_VALUE = 20; // COP

// Quotation Constants
const PLAN_MULTIPLIERS = {
    'free': 1,
    'silver': 1.5,
    'gold': 1.8,
    'premium': 2.0
};

const LEVEL_BONUSES = [0, 0, 0.10, 0.20, 0.40, 0.60]; // Index 0 unused, 1-5

// Validation Constants
const PLAN_LIMITS = {
    'free': 1,
    'silver': 5,
    'gold': 10,
    'premium': 999
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.dashboard-body')) {
        initUserDashboard();
    }
    // Check if we are in company dashboard to init creator
    if (document.getElementById('mission-creator-form')) {
        initMissionCreator();
    }
    // Init Validation Form
    if (document.getElementById('validation-form')) {
        initValidationForm();
    }
    // Init Social Feed
    if (document.getElementById('social-feed-container')) {
        renderSocialFeed();
    }
    // Init Ranking
    if (document.getElementById('company-ranking-body')) {
        renderCompanyRanking();
    }
    // Init Company Social Dashboard
    if (document.getElementById('company-social-gallery')) {
        renderCompanySocialGallery();
    }
});

function initUserDashboard() {
    updateTreeVisuals();
    startExpirationTimer();
    renderMissions('all');
    updateWalletUI();
    renderActiveTokens(); // New
    updateValidationLimitInfo(); // New
    if (document.getElementById('social-feed-container')) renderSocialFeed(); // Ensure render on dashboard load
}

// --- Social Business Logic ---

function renderCompanySocialGallery() {
    const container = document.getElementById('company-social-gallery');
    if (!container) return;

    // Mock data for posts associated with this company
    const companyPosts = [
        { id: 101, user: 'Maria Gonzalez', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', likes: 45, comments: 12, product: 'Cepillo de Bambú' },
        { id: 102, user: 'Juan Perez', image: 'https://images.unsplash.com/photo-1610419886456-59c33674208a?auto=format&fit=crop&w=800&q=80', likes: 23, comments: 5, product: 'Shampoo Sólido' },
        { id: 103, user: 'Ana Lopez', image: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=800&q=80', likes: 89, comments: 20, product: 'Bolsa Reutilizable' }
    ];

    container.innerHTML = '';

    companyPosts.forEach(post => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${post.image}" alt="User Post">
            <div class="gallery-overlay">
                <h5>${post.user}</h5>
                <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 10px;">${post.product}</p>
                <div class="gallery-stats">
                    <span><i class="ph-heart-fill" style="color: #e91e63;"></i> ${post.likes}</span>
                    <span><i class="ph-chat-circle-fill" style="color: #2196f3;"></i> ${post.comments}</span>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

// MV Calculation Logic
function calculateMVValue() {
    // 1. Base Value
    let value = MV_BASE_VALUE;

    // 2. Plan Multiplier
    const planMult = PLAN_MULTIPLIERS[userState.plan] || 1;
    value *= planMult;

    // 3. Level Bonus (Simulated mapping based on EXP/Level Index)
    // Mapping internal levelIndex (0-2 per plan) to 1-5 scale roughly
    // Simple logic: Base level 1 + index. If plan is higher, start higher.
    let levelScale = 1;
    if (userState.plan === 'free') levelScale = 1 + userState.levelIndex; // 1, 2, 3
    else if (userState.plan === 'silver') levelScale = 2 + userState.levelIndex; // 2, 3, 4
    else levelScale = 3 + userState.levelIndex; // 3, 4, 5

    if (levelScale > 5) levelScale = 5;

    const levelBonus = LEVEL_BONUSES[levelScale] || 0;
    value *= (1 + levelBonus);

    // 4. Activity Bonus
    let activityBonus = 0;
    const missionsCount = userState.fruits.length; // Using fruits count as proxy for weekly missions

    if (missionsCount >= 5) activityBonus += 0.20;
    else if (missionsCount >= 3) activityBonus += 0.10;
    else if (missionsCount >= 1) activityBonus += 0.05;

    if (userState.referrals.free > 0) activityBonus += 0.10;
    if (userState.referrals.paid > 0) activityBonus += 0.30;

    value *= (1 + activityBonus);

    return {
        total: Math.round(value),
        breakdown: {
            base: MV_BASE_VALUE,
            planMult: planMult,
            levelBonus: levelBonus,
            activityBonus: activityBonus,
            levelScale: levelScale
        }
    };
}

// Tab Switching
function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    // Show selected tab
    document.getElementById(`tab-${tabId}`).classList.add('active');

    // Update Sidebar
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Tree & Level Logic
function updateTreeVisuals() {
    const planLevels = LEVEL_SYSTEM[userState.plan] || LEVEL_SYSTEM['free'];

    // Determine current level based on EXP
    let currentLevel = planLevels[0];
    let nextLevel = null;
    let levelIndex = 0;

    for (let i = 0; i < planLevels.length; i++) {
        if (userState.exp >= planLevels[i].minExp) {
            currentLevel = planLevels[i];
            nextLevel = planLevels[i + 1] || null;
            levelIndex = i;
        }
    }
    userState.levelIndex = levelIndex; // Update state

    const treeWrapper = document.getElementById('tree-icon-wrapper');
    const treeIcon = document.getElementById('main-tree-icon');
    const levelName = document.getElementById('tree-level-name');
    const planBadge = document.getElementById('user-plan');
    const expBar = document.getElementById('exp-fill');
    const expText = document.getElementById('exp-text');

    // Update UI
    levelName.textContent = currentLevel.name;
    planBadge.textContent = "Plan " + userState.plan.charAt(0).toUpperCase() + userState.plan.slice(1);
    treeIcon.className = `ph-fill ${currentLevel.icon}`;

    // EXP Progress
    if (nextLevel) {
        const progress = ((userState.exp - currentLevel.minExp) / (nextLevel.minExp - currentLevel.minExp)) * 100;
        if (expBar) expBar.style.width = `${Math.min(progress, 100)}%`;
        if (expText) expText.textContent = `${userState.exp} / ${nextLevel.minExp} EXP`;
    } else {
        if (expBar) expBar.style.width = '100%';
        if (expText) expText.textContent = 'Máximo Nivel';
    }

    renderFruits();
}

function renderFruits() {
    const container = document.getElementById('fruits-container');
    container.innerHTML = ''; // Clear

    userState.fruits.forEach((fruit, index) => {
        const fruitEl = document.createElement('i');
        fruitEl.className = 'ph-fill ph-apple-logo fruit';

        // Random Position within tree area
        const top = 20 + Math.random() * 60;
        const left = 20 + Math.random() * 60;

        fruitEl.style.top = `${top}%`;
        fruitEl.style.left = `${left}%`;
        fruitEl.title = `Expira en: ${getTimeRemaining(fruit.expires_at)}`;

        container.appendChild(fruitEl);
    });

    document.getElementById('tree-fruits-count').textContent = userState.fruits.length;
    document.getElementById('header-balance').textContent = userState.fruits.length;
    document.getElementById('wallet-balance').textContent = userState.fruits.length;
}

function addFruit(mvReward, expReward) {
    const now = new Date();
    const validityHours = 24 + (userState.referrals.free * 24); // Simplified logic
    const expires = new Date(now.getTime() + validityHours * 60 * 60 * 1000);

    // Calculate current dynamic value
    const currentVal = calculateMVValue().total;

    // Add Fruit
    userState.fruits.push({
        id: Date.now(),
        created_at: now,
        expires_at: expires,
        value: currentVal
    });

    // Add EXP
    userState.exp += expReward || 10;

    checkAchievements();
    updateTreeVisuals(); // Re-calc level
    updateWalletUI();
}

// Expiration Logic
function startExpirationTimer() {
    setInterval(() => {
        const now = new Date();
        // Filter out expired fruits
        const initialCount = userState.fruits.length;
        userState.fruits = userState.fruits.filter(f => f.expires_at > now);

        if (userState.fruits.length !== initialCount) {
            renderFruits(); // Re-render if fruits expired
        }

        // Update "Next Expiration" text
        if (userState.fruits.length > 0) {
            // Find soonest expiration
            const soonest = userState.fruits.reduce((prev, curr) => prev.expires_at < curr.expires_at ? prev : curr);
            document.getElementById('next-expiration').textContent = getTimeRemaining(soonest.expires_at);
        } else {
            document.getElementById('next-expiration').textContent = "--:--";
        }

    }, 1000 * 60); // Check every minute
}

function getTimeRemaining(endTime) {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const hours = Math.floor((total / (1000 * 60 * 60)));
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return `${hours}h ${minutes}m`;
}

// Enhanced Missions
function renderMissions(filterType) {
    const container = document.querySelector('.missions-grid');
    if (!container) return;

    container.innerHTML = '';

    const filtered = filterType === 'all' ? MISSIONS_DB : MISSIONS_DB.filter(m => m.type === filterType);

    filtered.forEach(m => {
        const card = document.createElement('div');
        card.className = `mission-card type-${m.type}`;
        card.innerHTML = `
            <div class="mission-icon"><i class="ph-fill ${m.icon}"></i></div>
            <div class="mission-content">
                <h4>${m.title}</h4>
                <p>${m.desc}</p>
                <div class="mission-rewards">
                    <span><i class="ph-leaf"></i> ${m.rewardMV} MV</span>
                    <span><i class="ph-sparkle"></i> ${m.rewardEXP} EXP</span>
                </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="completeMission(${m.id})">Completar</button>
        `;
        container.appendChild(card);
    });
}

function completeMission(missionId) {
    const mission = MISSIONS_DB.find(m => m.id === missionId);
    if (mission) {
        addFruit(mission.rewardMV, mission.rewardEXP);
        alert(`¡Misión "${mission.title}" completada! Ganaste ${mission.rewardMV} MV y ${mission.rewardEXP} EXP.`);
    }
}

// Wallet UI Update
function updateWalletUI() {
    const totalMVValue = userState.fruits.reduce((sum, fruit) => sum + fruit.value, 0);
    document.getElementById('wallet-balance-value').textContent = totalMVValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

    const mvBreakdown = calculateMVValue().breakdown;
    document.getElementById('mv-base-value').textContent = mvBreakdown.base.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    document.getElementById('mv-plan-multiplier').textContent = `${(mvBreakdown.planMult * 100).toFixed(0)}%`;
    document.getElementById('mv-level-bonus').textContent = `${(mvBreakdown.levelBonus * 100).toFixed(0)}%`;
    document.getElementById('mv-activity-bonus').textContent = `${(mvBreakdown.activityBonus * 100).toFixed(0)}%`;
    document.getElementById('mv-current-value').textContent = calculateMVValue().total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
}

// Achievements (Placeholder)
function checkAchievements() {
    // Logic to check for new achievements based on userState
    // e.g., if userState.exp > 1000 and 'first_thousand_exp' not in achievements, add it.
}

// Token Validation (Placeholder)
function renderActiveTokens() {
    const container = document.getElementById('active-tokens-container');
    if (!container) return;

    container.innerHTML = '';
    if (userState.fruits.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No tienes Monedas Verdes activas.</p>';
        return;
    }

    userState.fruits.forEach(fruit => {
        const tokenEl = document.createElement('div');
        tokenEl.className = 'active-token-card';
        tokenEl.innerHTML = `
            <div class="token-value">${fruit.value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</div>
            <div class="token-details">
                <p>Generada: ${new Date(fruit.created_at).toLocaleDateString()}</p>
                <p>Expira: <span class="text-danger">${getTimeRemaining(fruit.expires_at)}</span></p>
            </div>
        `;
        container.appendChild(tokenEl);
    });
}

// Validation Form Logic (Company Dashboard)
function initValidationForm() {
    const form = document.getElementById('validation-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const tokenInput = document.getElementById('token-code').value;
        const missionSelect = document.getElementById('mission-type').value;

        // Simulate validation
        if (tokenInput && missionSelect) {
            alert(`Token "${tokenInput}" validado para misión "${missionSelect}". ¡Recompensa otorgada!`);
            // In a real app, this would involve backend calls and updating user state
            // For demo, we'll just simulate adding a fruit to the current user
            addFruit(1, 20); // Simulate 1 MV and 20 EXP for validation
            form.reset();
            updateValidationLimitInfo();
        } else {
            alert('Por favor, completa todos los campos.');
        }
    });
}

function updateValidationLimitInfo() {
    const limitDisplay = document.getElementById('validation-limit');
    if (!limitDisplay) return;

    const currentPlan = userState.plan; // Assuming company plan is tied to userState for simplicity
    const maxValidations = PLAN_LIMITS[currentPlan] || 1;
    const currentValidations = userState.fruits.length; // Simplified: using fruits as proxy for validations

    limitDisplay.textContent = `${currentValidations} / ${maxValidations} validaciones este mes`;

    if (currentValidations >= maxValidations) {
        limitDisplay.classList.add('text-danger');
        document.getElementById('validation-form-submit').disabled = true;
        document.getElementById('validation-form-submit').textContent = 'Límite Alcanzado';
    } else {
        limitDisplay.classList.remove('text-danger');
        document.getElementById('validation-form-submit').disabled = false;
        document.getElementById('validation-form-submit').textContent = 'Validar Token';
    }
}

// Mission Creator Logic (Company Dashboard)
function initMissionCreator() {
    const form = document.getElementById('mission-creator-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('mission-title').value;
        const description = document.getElementById('mission-description').value;
        const rewardMV = parseInt(document.getElementById('mission-reward-mv').value);
        const rewardEXP = parseInt(document.getElementById('mission-reward-exp').value);
        const type = document.getElementById('mission-type-creator').value;
        const icon = document.getElementById('mission-icon').value;

        if (title && description && rewardMV && rewardEXP && type && icon) {
            const newMission = {
                id: MISSIONS_DB.length + 1,
                type: type,
                title: title,
                desc: description,
                rewardMV: rewardMV,
                rewardEXP: rewardEXP,
                icon: icon
            };
            MISSIONS_DB.push(newMission); // Add to mock DB
            alert('¡Misión creada con éxito!');
            form.reset();
            renderMissions('all'); // Re-render missions to show new one
        } else {
            alert('Por favor, completa todos los campos para crear la misión.');
        }
    });
}

// --- Social Module Logic ---

// Mock Social Data
const SOCIAL_POSTS = [
    { id: 1, user: 'EcoStore Ltda.', handle: '@ecostore', avatar: 'https://ui-avatars.com/api/?name=Eco+Store&background=2e7d32&color=fff', content: '¡Nueva colección de bambú disponible! 🎋 #Sostenible', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', likes: 120, comments: 15, liked: false },
    { id: 2, user: 'Carlos Ruiz', handle: '@carlos_eco', avatar: 'https://ui-avatars.com/api/?name=Carlos+R&background=random', content: 'Completé mi misión de reciclaje semanal. ¡Se siente genial! ♻️', image: null, likes: 45, comments: 8, liked: false },
    { id: 3, user: 'Green Café', handle: '@greencafe', avatar: 'https://ui-avatars.com/api/?name=Green+Cafe&background=795548&color=fff', content: 'Trae tu taza y recibe 10% de descuento extra en MV. ☕', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80', likes: 230, comments: 42, liked: false }
];

function renderSocialFeed() {
    const container = document.getElementById('social-feed-container');
    if (!container) return;

    container.innerHTML = '';

    SOCIAL_POSTS.forEach(post => {
        const card = document.createElement('div');
        card.className = 'social-post-card';
        card.innerHTML = `
            <div class="post-header">
                <img src="${post.avatar}" alt="User">
                <div class="post-info">
                    <h4>${post.user} <span>${post.handle}</span></h4>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn ${post.liked ? 'active' : ''}" onclick="handleLike(${post.id})">
                    <i class="ph-heart${post.liked ? '-fill' : ''}"></i> ${post.likes}
                </button>
                <button class="action-btn" onclick="handleComment(${post.id})">
                    <i class="ph-chat-circle"></i> ${post.comments}
                </button>
                <button class="action-btn" onclick="handleShare(${post.id})">
                    <i class="ph-share-fat"></i> Compartir
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function handleLike(postId) {
    const post = SOCIAL_POSTS.find(p => p.id === postId);
    if (post) {
        if (!post.liked) {
            post.likes++;
            post.liked = true;
            // Reward: +1 EXP, +0.1 MV (Simulated)
            userState.exp += 1;
            // Only add MV every 10 likes in real logic, here we simulate small increment
            alert("¡Like enviado! Ganaste +1 EXP.");
        } else {
            post.likes--;
            post.liked = false;
        }
        renderSocialFeed();
        updateTreeVisuals(); // Update EXP bar
    }
}

function handleComment(postId) {
    const post = SOCIAL_POSTS.find(p => p.id === postId);
    if (post) {
        const comment = prompt("Escribe tu comentario:");
        if (comment) {
            post.comments++;
            // Reward: +3 EXP
            userState.exp += 3;
            alert("¡Comentario publicado! Ganaste +3 EXP.");
            renderSocialFeed();
            updateTreeVisuals();
        }
    }
}

function handleShare(postId) {
    // Reward: +5 EXP, +2 MV
    userState.exp += 5;
    addFruit(2, 0); // Add 2 MV directly
    alert("¡Compartido! Ganaste +5 EXP y +2 MV.");
    updateTreeVisuals();
}

// --- Ranking Logic ---
function renderCompanyRanking() {
    const tbody = document.getElementById('company-ranking-body');
    if (!tbody) return;

    const rankings = [
        { name: 'EcoStore Ltda.', score: 1540, category: 'Tienda', id: 1 },
        { name: 'Green Café', score: 1250, category: 'Restaurante', id: 2 },
        { name: 'BiciTaller Pro', score: 980, category: 'Servicios', id: 3 },
        { name: 'Moda Sostenible', score: 850, category: 'Moda', id: 4 }
    ];

    tbody.innerHTML = '';

    rankings.forEach((company, index) => {
        const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
        const row = `
            <tr>
                <td><div class="rank-badge ${rankClass}">${index + 1}</div></td>
                <td><strong>${company.name}</strong></td>
                <td>${company.score} pts</td>
                <td>${company.category}</td>
                <td><a href="company-profile.html" class="btn btn-sm btn-outline">Ver Perfil</a></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// MV Calculation Logic
function calculateMVValue() {
    // 1. Base Value
    let value = MV_BASE_VALUE;

    // 2. Plan Multiplier
    const planMult = PLAN_MULTIPLIERS[userState.plan] || 1;
    value *= planMult;

    // 3. Level Bonus (Simulated mapping based on EXP/Level Index)
    // Mapping internal levelIndex (0-2 per plan) to 1-5 scale roughly
    // Simple logic: Base level 1 + index. If plan is higher, start higher.
    let levelScale = 1;
    if (userState.plan === 'free') levelScale = 1 + userState.levelIndex; // 1, 2, 3
    else if (userState.plan === 'silver') levelScale = 2 + userState.levelIndex; // 2, 3, 4
    else levelScale = 3 + userState.levelIndex; // 3, 4, 5

    if (levelScale > 5) levelScale = 5;

    const levelBonus = LEVEL_BONUSES[levelScale] || 0;
    value *= (1 + levelBonus);

    // 4. Activity Bonus
    let activityBonus = 0;
    const missionsCount = userState.fruits.length; // Using fruits count as proxy for weekly missions

    if (missionsCount >= 5) activityBonus += 0.20;
    else if (missionsCount >= 3) activityBonus += 0.10;
    else if (missionsCount >= 1) activityBonus += 0.05;

    if (userState.referrals.free > 0) activityBonus += 0.10;
    if (userState.referrals.paid > 0) activityBonus += 0.30;

    value *= (1 + activityBonus);

    return {
        total: Math.round(value),
        breakdown: {
            base: MV_BASE_VALUE,
            planMult: planMult,
            levelBonus: levelBonus,
            activityBonus: activityBonus,
            levelScale: levelScale
        }
    };
}

// Tab Switching
function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    // Show selected tab
    document.getElementById(`tab-${tabId}`).classList.add('active');

    // Update Sidebar
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Tree & Level Logic
function updateTreeVisuals() {
    const planLevels = LEVEL_SYSTEM[userState.plan] || LEVEL_SYSTEM['free'];

    // Determine current level based on EXP
    let currentLevel = planLevels[0];
    let nextLevel = null;
    let levelIndex = 0;

    for (let i = 0; i < planLevels.length; i++) {
        if (userState.exp >= planLevels[i].minExp) {
            currentLevel = planLevels[i];
            nextLevel = planLevels[i + 1] || null;
            levelIndex = i;
        }
    }
    userState.levelIndex = levelIndex; // Update state

    const treeWrapper = document.getElementById('tree-icon-wrapper');
    const treeIcon = document.getElementById('main-tree-icon');
    const levelName = document.getElementById('tree-level-name');
    const planBadge = document.getElementById('user-plan');
    const expBar = document.getElementById('exp-fill');
    const expText = document.getElementById('exp-text');

    // Update UI
    levelName.textContent = currentLevel.name;
    planBadge.textContent = "Plan " + userState.plan.charAt(0).toUpperCase() + userState.plan.slice(1);
    treeIcon.className = `ph-fill ${currentLevel.icon}`;

    // EXP Progress
    if (nextLevel) {
        const progress = ((userState.exp - currentLevel.minExp) / (nextLevel.minExp - currentLevel.minExp)) * 100;
        if (expBar) expBar.style.width = `${Math.min(progress, 100)}%`;
        if (expText) expText.textContent = `${userState.exp} / ${nextLevel.minExp} EXP`;
    } else {
        if (expBar) expBar.style.width = '100%';
        if (expText) expText.textContent = 'Máximo Nivel';
    }

    renderFruits();
}

function renderFruits() {
    const container = document.getElementById('fruits-container');
    container.innerHTML = ''; // Clear

    userState.fruits.forEach((fruit, index) => {
        const fruitEl = document.createElement('i');
        fruitEl.className = 'ph-fill ph-apple-logo fruit';

        // Random Position within tree area
        const top = 20 + Math.random() * 60;
        const left = 20 + Math.random() * 60;

        fruitEl.style.top = `${top}%`;
        fruitEl.style.left = `${left}%`;
        fruitEl.title = `Expira en: ${getTimeRemaining(fruit.expires_at)}`;

        container.appendChild(fruitEl);
    });

    document.getElementById('tree-fruits-count').textContent = userState.fruits.length;
    document.getElementById('header-balance').textContent = userState.fruits.length;
    document.getElementById('wallet-balance').textContent = userState.fruits.length;
}

function addFruit(mvReward, expReward) {
    const now = new Date();
    const validityHours = 24 + (userState.referrals.free * 24); // Simplified logic
    const expires = new Date(now.getTime() + validityHours * 60 * 60 * 1000);

    // Calculate current dynamic value
    const currentVal = calculateMVValue().total;

    // Add Fruit
    userState.fruits.push({
        id: Date.now(),
        created_at: now,
        expires_at: expires,
        value: currentVal
    });

    // Add EXP
    userState.exp += expReward || 10;

    checkAchievements();
    updateTreeVisuals(); // Re-calc level
    updateWalletUI();
}

// Expiration Logic
function startExpirationTimer() {
    setInterval(() => {
        const now = new Date();
        // Filter out expired fruits
        const initialCount = userState.fruits.length;
        userState.fruits = userState.fruits.filter(f => f.expires_at > now);

        if (userState.fruits.length !== initialCount) {
            renderFruits(); // Re-render if fruits expired
        }

        // Update "Next Expiration" text
        if (userState.fruits.length > 0) {
            // Find soonest expiration
            const soonest = userState.fruits.reduce((prev, curr) => prev.expires_at < curr.expires_at ? prev : curr);
            document.getElementById('next-expiration').textContent = getTimeRemaining(soonest.expires_at);
        } else {
            document.getElementById('next-expiration').textContent = "--:--";
        }

    }, 1000 * 60); // Check every minute
}

function getTimeRemaining(endTime) {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const hours = Math.floor((total / (1000 * 60 * 60)));
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return `${hours}h ${minutes}m`;
}

// Enhanced Missions
function renderMissions(filterType) {
    const container = document.querySelector('.missions-grid');
    if (!container) return;

    container.innerHTML = '';

    const filtered = filterType === 'all' ? MISSIONS_DB : MISSIONS_DB.filter(m => m.type === filterType);

    filtered.forEach(m => {
        const card = document.createElement('div');
        card.className = `mission-card type-${m.type}`;
        card.innerHTML = `
            <div class="mission-icon"><i class="ph-duotone ${m.icon}"></i></div>
            <div class="mission-content">
                <div class="mission-header">
                    <h4>${m.title}</h4>
                    <span class="mission-type-badge">${m.type}</span>
                </div>
                <p>${m.desc}</p>
                <div class="rewards">
                    <span class="reward-tag">+${m.rewardMV} MV</span>
                    <span class="reward-tag exp">+${m.rewardEXP} EXP</span>
                </div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="openEvidenceModal('${m.title}', ${m.rewardMV}, ${m.rewardEXP})">Subir Evidencia</button>
        `;
        container.appendChild(card);
    });
}

function filterMissions(type) {
    // Update UI tabs
    document.querySelectorAll('.mission-filter').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderMissions(type);
}

// Evidence Modal Update
let currentMissionReward = { mv: 0, exp: 0 };

function openEvidenceModal(title, mv, exp) {
    currentMissionReward = { mv, exp };
    document.getElementById('evidence-modal').style.display = 'flex';
    document.getElementById('modal-mission-title').textContent = title;
}

function closeEvidenceModal() {
    document.getElementById('evidence-modal').style.display = 'none';
}

function submitEvidence() {
    closeEvidenceModal();
    alert(`¡Misión enviada! Ganaste ${currentMissionReward.mv} MV y ${currentMissionReward.exp} EXP.`);
    addFruit(currentMissionReward.mv, currentMissionReward.exp);

    // History Update
    const tbody = document.getElementById('wallet-history');
    if (tbody) {
        tbody.innerHTML += `<tr>
            <td>Misión: ${document.getElementById('modal-mission-title').textContent}</td>
            <td style="color: green;">+${currentMissionReward.mv} MV</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td><span class="status active">Aprobado</span></td>
        </tr>`;
    }
}

// Referrals
function copyRefLink() {
    const copyText = document.getElementById("ref-link");
    copyText.select();
    document.execCommand("copy");
    alert("Enlace copiado: " + copyText.value);

    // Mock adding a referral for demo purposes
    if (confirm("¿Simular registro de referido GRATIS?")) {
        userState.referrals.free++;
        document.getElementById('ref-count-free').textContent = userState.referrals.free;
        alert("¡Referido Gratis añadido! Tus frutos ahora duran más.");
    }
}

function updateWalletUI() {
    const calculation = calculateMVValue();

    // Update Validity Text
    const validity = PLAN_LEVELS[userState.plan].maxHours + (userState.referrals.free * 24);
    if (document.getElementById('mv-validity')) document.getElementById('mv-validity').textContent = validity;

    // Update Value Text
    if (document.getElementById('mv-value')) document.getElementById('mv-value').textContent = `$${calculation.total}`;

    // Update Quotation Widget if exists
    if (document.getElementById('quote-value-display')) {
        document.getElementById('quote-value-display').textContent = `$${calculation.total} COP`;
        document.getElementById('quote-plan-mult').textContent = `x${calculation.breakdown.planMult}`;
        document.getElementById('quote-level-bonus').textContent = `+${(calculation.breakdown.levelBonus * 100).toFixed(0)}%`;
        document.getElementById('quote-activity-bonus').textContent = `+${(calculation.breakdown.activityBonus * 100).toFixed(0)}%`;

        // Update Level Scale Visual
        document.getElementById('quote-level-scale').textContent = `Nivel ${calculation.breakdown.levelScale}`;
    }
}

function checkAchievements() {
    if (userState.fruits.length >= 1) unlockBadge('badge-first-fruit');
    if (userState.fruits.length >= 10) unlockBadge('badge-ranger');
    if (userState.referrals.free >= 1) unlockBadge('badge-sower');
    if (userState.referrals.paid >= 1) unlockBadge('badge-cultivator');
}

function unlockBadge(id) {
    document.getElementById(id).classList.remove('locked');
}

console.log("Monedas Verdes App Loaded");
