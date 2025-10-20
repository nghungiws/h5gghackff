// Main application controller
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Setup event listeners
    setupEventListeners();
    
    // Initialize UI
    initializeUI();
    
    // Initialize additional features
    initializeAdditionalFeatures();
    
    // Start status monitoring
    startStatusMonitoring();
    
    freeFireHack.log('Application initialized successfully', 'success');
}

function setupEventListeners() {
    // Connection buttons
    document.getElementById('connectBtn').addEventListener('click', connectToH5GG);
    document.getElementById('disconnectBtn').addEventListener('click', disconnectFromH5GG);
    document.getElementById('resetBtn').addEventListener('click', resetAllHacks);

    // Hack toggles
    setupHackToggles();

    // Settings sliders
    setupSettingsSliders();

    // Memory operations
    setupMemoryOperations();
}

function setupHackToggles() {
    const hackToggles = {
        'aimbot': { enable: () => freeFireHack.enableAimbot(), disable: () => freeFireHack.disableAimbot() },
        'wallhack': { enable: () => freeFireHack.enableWallhack(), disable: () => freeFireHack.disableWallhack() },
        'esp': { enable: () => freeFireHack.enableESP(), disable: () => freeFireHack.disableESP() },
        'noRecoil': { enable: () => freeFireHack.enableNoRecoil(), disable: () => freeFireHack.disableNoRecoil() },
        'godMode': { enable: () => freeFireHack.enableGodMode(), disable: () => freeFireHack.disableGodMode() },
        'infiniteHealth': { enable: () => freeFireHack.enableInfiniteHealth(), disable: () => freeFireHack.disableInfiniteHealth() },
        'infiniteAmmo': { enable: () => freeFireHack.enableInfiniteAmmo(), disable: () => freeFireHack.disableInfiniteAmmo() },
        'speedHack': { enable: () => freeFireHack.enableSpeedHack(), disable: () => freeFireHack.disableSpeedHack() }
    };

    Object.keys(hackToggles).forEach(hackId => {
        const checkbox = document.getElementById(hackId);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    hackToggles[hackId].enable();
                } else {
                    hackToggles[hackId].disable();
                }
            });
        }
    });
}

function setupSettingsSliders() {
    const sliders = ['aimbotFov', 'aimbotSmooth', 'speedMultiplier'];
    
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', function() {
                freeFireHack.updateSettings();
            });
        }
    });
}

function setupMemoryOperations() {
    // Memory write
    document.getElementById('writeMemory').addEventListener('click', async function() {
        const address = document.getElementById('memoryAddress').value;
        const value = document.getElementById('memoryValue').value;
        
        if (!address || !value) {
            freeFireHack.log('Please enter both address and value', 'error');
            return;
        }

        const result = await freeFireHack.writeMemory(address, value);
        if (result) {
            freeFireHack.log(`Successfully wrote ${value} to ${address}`, 'success');
        }
    });

    // Memory read
    document.getElementById('readMemory').addEventListener('click', async function() {
        const address = document.getElementById('memoryAddress').value;
        
        if (!address) {
            freeFireHack.log('Please enter an address', 'error');
            return;
        }

        const value = await freeFireHack.readMemory(address);
        if (value !== null) {
            document.getElementById('memoryValue').value = value;
            freeFireHack.log(`Read value ${value} from ${address}`, 'success');
        }
    });

    // Memory search
    document.getElementById('searchMemory').addEventListener('click', async function() {
        const value = document.getElementById('searchValue').value;
        
        if (!value) {
            freeFireHack.log('Please enter a search value', 'error');
            return;
        }

        const results = await freeFireHack.searchMemory(value);
        displayMemoryResults(results);
    });
}

function displayMemoryResults(results) {
    const resultsContainer = document.getElementById('memoryResults');
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.textContent = 'No results found';
        return;
    }

    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.textContent = `Address: ${result.address} | Value: ${result.value}`;
        resultsContainer.appendChild(resultDiv);
    });
}

async function connectToH5GG() {
    const connectBtn = document.getElementById('connectBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    
    connectBtn.disabled = true;
    connectBtn.textContent = 'Connecting...';
    
    try {
        const connected = await freeFireHack.connectToH5GG();
        
        if (connected) {
            freeFireHack.isConnected = true;
            freeFireHack.updateStatus('gameStatus', 'Connected', true);
            
            connectBtn.style.display = 'none';
            disconnectBtn.style.display = 'inline-block';
            
            // Enable all controls
            enableAllControls();
        } else {
            connectBtn.disabled = false;
            connectBtn.textContent = 'Connect to H5GG';
        }
    } catch (error) {
        freeFireHack.log(`Connection error: ${error.message}`, 'error');
        connectBtn.disabled = false;
        connectBtn.textContent = 'Connect to H5GG';
    }
}

function disconnectFromH5GG() {
    freeFireHack.disconnect();
    
    const connectBtn = document.getElementById('connectBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    
    connectBtn.style.display = 'inline-block';
    disconnectBtn.style.display = 'none';
    connectBtn.disabled = false;
    connectBtn.textContent = 'Connect to H5GG';
    
    // Disable all controls
    disableAllControls();
}

function resetAllHacks() {
    if (confirm('Are you sure you want to reset all hacks?')) {
        freeFireHack.resetAll();
    }
}

function enableAllControls() {
    const controls = document.querySelectorAll('input, button');
    controls.forEach(control => {
        if (control.id !== 'connectBtn') {
            control.disabled = false;
        }
    });
}

function disableAllControls() {
    const controls = document.querySelectorAll('input, button');
    controls.forEach(control => {
        if (control.id !== 'connectBtn') {
            control.disabled = true;
        }
    });
}

function initializeUI() {
    // Set initial values
    freeFireHack.updateSettings();
    
    // Hide disconnect button initially
    document.getElementById('disconnectBtn').style.display = 'none';
    
    // Disable all controls initially
    disableAllControls();
    
    // Enable connect button
    document.getElementById('connectBtn').disabled = false;
}

function startStatusMonitoring() {
    // Monitor connection status
    setInterval(() => {
        if (freeFireHack.isConnected && !freeFireHack.h5ggConnected) {
            freeFireHack.updateStatus('h5ggStatus', 'Connection Lost');
            freeFireHack.log('H5GG connection lost', 'error');
        }
    }, 5000);
    
    // Update level display
    setInterval(() => {
        updateLevelDisplay();
    }, 1000);
}

function updateLevelDisplay() {
    const levelInfo = freeFireHack.getLevelInfo();
    
    // Update level and XP displays
    document.getElementById('userLevel').textContent = levelInfo.level;
    document.getElementById('userXP').textContent = `${levelInfo.experience}/${levelInfo.experienceToNext}`;
    document.getElementById('levelDisplay').textContent = levelInfo.level;
    document.getElementById('xpDisplay').textContent = `${levelInfo.experience}/${levelInfo.experienceToNext}`;
    document.getElementById('hacksUsedDisplay').textContent = levelInfo.stats.hacksUsed;
    
    // Update XP progress bar
    const xpProgress = (levelInfo.experience / levelInfo.experienceToNext) * 100;
    document.getElementById('xpProgress').style.width = `${xpProgress}%`;
    
    // Update achievements
    updateAchievementsDisplay(levelInfo.achievements);
}

function updateAchievementsDisplay(achievements) {
    const achievementItems = document.querySelectorAll('.achievement-item');
    const achievementMap = {
        'first_hack': 0,
        'hack_master': 1,
        'memory_expert': 2,
        'level_10': 3,
        'perfect_hack': 4
    };
    
    achievementItems.forEach((item, index) => {
        const achievementId = Object.keys(achievementMap).find(key => achievementMap[key] === index);
        if (achievementId && achievements.includes(achievementId)) {
            item.classList.remove('locked');
            item.classList.add('unlocked');
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl + R to reset all hacks
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        resetAllHacks();
    }
    
    // Ctrl + D to disconnect
    if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        disconnectFromH5GG();
    }
    
    // Ctrl + C to connect
    if (event.ctrlKey && event.key === 'c') {
        event.preventDefault();
        if (!freeFireHack.isConnected) {
            connectToH5GG();
        }
    }
    
    // F1 - Toggle Aimbot
    if (event.key === 'F1') {
        event.preventDefault();
        const aimbotCheckbox = document.getElementById('aimbot');
        aimbotCheckbox.checked = !aimbotCheckbox.checked;
        aimbotCheckbox.dispatchEvent(new Event('change'));
    }
    
    // F2 - Toggle Wallhack
    if (event.key === 'F2') {
        event.preventDefault();
        const wallhackCheckbox = document.getElementById('wallhack');
        wallhackCheckbox.checked = !wallhackCheckbox.checked;
        wallhackCheckbox.dispatchEvent(new Event('change'));
    }
    
    // F3 - Toggle ESP
    if (event.key === 'F3') {
        event.preventDefault();
        const espCheckbox = document.getElementById('esp');
        espCheckbox.checked = !espCheckbox.checked;
        espCheckbox.dispatchEvent(new Event('change'));
    }
    
    // F4 - Toggle No Recoil
    if (event.key === 'F4') {
        event.preventDefault();
        const noRecoilCheckbox = document.getElementById('noRecoil');
        noRecoilCheckbox.checked = !noRecoilCheckbox.checked;
        noRecoilCheckbox.dispatchEvent(new Event('change'));
    }
    
    // F5 - Toggle God Mode
    if (event.key === 'F5') {
        event.preventDefault();
        const godModeCheckbox = document.getElementById('godMode');
        godModeCheckbox.checked = !godModeCheckbox.checked;
        godModeCheckbox.dispatchEvent(new Event('change'));
    }
    
    // F6 - Toggle Infinite Health
    if (event.key === 'F6') {
        event.preventDefault();
        const infiniteHealthCheckbox = document.getElementById('infiniteHealth');
        infiniteHealthCheckbox.checked = !infiniteHealthCheckbox.checked;
        infiniteHealthCheckbox.dispatchEvent(new Event('change'));
    }
    
    // F7 - Toggle Infinite Ammo
    if (event.key === 'F7') {
        event.preventDefault();
        const infiniteAmmoCheckbox = document.getElementById('infiniteAmmo');
        infiniteAmmoCheckbox.checked = !infiniteAmmoCheckbox.checked;
        infiniteAmmoCheckbox.dispatchEvent(new Event('change'));
    }
    
    // F8 - Toggle Speed Hack
    if (event.key === 'F8') {
        event.preventDefault();
        const speedHackCheckbox = document.getElementById('speedHack');
        speedHackCheckbox.checked = !speedHackCheckbox.checked;
        speedHackCheckbox.dispatchEvent(new Event('change'));
    }
    
    // F9 - Toggle Radar
    if (event.key === 'F9') {
        event.preventDefault();
        toggleRadar();
    }
    
    // F10 - Toggle Anti-Detection
    if (event.key === 'F10') {
        event.preventDefault();
        toggleAntiDetection();
    }
});

// Auto-save settings
function saveSettings() {
    const settings = {
        aimbotFov: freeFireHack.settings.aimbotFov,
        aimbotSmooth: freeFireHack.settings.aimbotSmooth,
        speedMultiplier: freeFireHack.settings.speedMultiplier
    };
    
    localStorage.setItem('freeFireHackSettings', JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = localStorage.getItem('freeFireHackSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        freeFireHack.settings = { ...freeFireHack.settings, ...settings };
        
        // Update UI
        document.getElementById('aimbotFov').value = settings.aimbotFov || 90;
        document.getElementById('aimbotSmooth').value = settings.aimbotSmooth || 5;
        document.getElementById('speedMultiplier').value = settings.speedMultiplier || 2.0;
        
        freeFireHack.updateSettings();
    }
}

// Load settings on startup
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
});

// Save settings when changed
document.addEventListener('input', function(event) {
    if (['aimbotFov', 'aimbotSmooth', 'speedMultiplier'].includes(event.target.id)) {
        saveSettings();
    }
});

// Toggle radar
function toggleRadar() {
    if (freeFireHack.activeHacks.has('radar')) {
        freeFireHack.disableRadar();
    } else {
        freeFireHack.enableRadar();
    }
}

// Toggle anti-detection
function toggleAntiDetection() {
    if (freeFireHack.antiDetection.enabled) {
        freeFireHack.disableAntiDetection();
    } else {
        freeFireHack.enableAntiDetection();
    }
}

// Add radar toggle button
function addRadarToggle() {
    const radarSection = document.createElement('div');
    radarSection.className = 'hack-section';
    radarSection.innerHTML = `
        <h3><i class="fas fa-radar"></i> Advanced Features</h3>
        <div class="hack-grid">
            <div class="hack-item">
                <label class="switch">
                    <input type="checkbox" id="radar">
                    <span class="slider"></span>
                </label>
                <span class="hack-label">Radar</span>
            </div>
            <div class="hack-item">
                <label class="switch">
                    <input type="checkbox" id="antiDetection" checked>
                    <span class="slider"></span>
                </label>
                <span class="hack-label">Anti-Detection</span>
            </div>
        </div>
    `;
    
    const hackPanel = document.querySelector('.hack-panel');
    hackPanel.appendChild(radarSection);
    
    // Add event listeners
    document.getElementById('radar').addEventListener('change', function() {
        if (this.checked) {
            freeFireHack.enableRadar();
        } else {
            freeFireHack.disableRadar();
        }
    });
    
    document.getElementById('antiDetection').addEventListener('change', function() {
        if (this.checked) {
            freeFireHack.enableAntiDetection();
        } else {
            freeFireHack.disableAntiDetection();
        }
    });
}

// Add hotkey display
function addHotkeyDisplay() {
    const hotkeyPanel = document.createElement('div');
    hotkeyPanel.className = 'hotkey-panel';
    hotkeyPanel.innerHTML = `
        <h3><i class="fas fa-keyboard"></i> Hotkeys</h3>
        <div class="hotkey-grid">
            <div class="hotkey-item">
                <span class="hotkey-key">F1</span>
                <span class="hotkey-desc">Toggle Aimbot</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">F2</span>
                <span class="hotkey-desc">Toggle Wallhack</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">F3</span>
                <span class="hotkey-desc">Toggle ESP</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">F4</span>
                <span class="hotkey-desc">Toggle No Recoil</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">F5</span>
                <span class="hotkey-desc">Toggle God Mode</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">F6</span>
                <span class="hotkey-desc">Toggle Infinite Health</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">F7</span>
                <span class="hotkey-desc">Toggle Infinite Ammo</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">F8</span>
                <span class="hotkey-desc">Toggle Speed Hack</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">F9</span>
                <span class="hotkey-desc">Toggle Radar</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">F10</span>
                <span class="hotkey-desc">Toggle Anti-Detection</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">Ctrl+R</span>
                <span class="hotkey-desc">Reset All</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">Ctrl+C</span>
                <span class="hotkey-desc">Connect</span>
            </div>
            <div class="hotkey-item">
                <span class="hotkey-key">Ctrl+D</span>
                <span class="hotkey-desc">Disconnect</span>
            </div>
        </div>
    `;
    
    const hackPanel = document.querySelector('.hack-panel');
    hackPanel.appendChild(hotkeyPanel);
}

// Initialize additional features
function initializeAdditionalFeatures() {
    addRadarToggle();
    addHotkeyDisplay();
}

// Export functions for global access
window.freeFireHack = freeFireHack;
window.h5ggIntegration = h5ggIntegration;
window.toggleRadar = toggleRadar;
window.toggleAntiDetection = toggleAntiDetection;