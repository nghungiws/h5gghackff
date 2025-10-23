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
        'speedHack': { enable: () => freeFireHack.enableSpeedHack(), disable: () => freeFireHack.disableSpeedHack() },
        'autoShoot': { enable: () => freeFireHack.enableAutoShoot(), disable: () => freeFireHack.disableAutoShoot() },
        'headshot': { enable: () => freeFireHack.enableHeadshot(), disable: () => freeFireHack.disableHeadshot() },
        'infiniteArmor': { enable: () => freeFireHack.enableInfiniteArmor(), disable: () => freeFireHack.disableInfiniteArmor() },
        'noFallDamage': { enable: () => freeFireHack.enableNoFallDamage(), disable: () => freeFireHack.disableNoFallDamage() }
    };

    Object.keys(hackToggles).forEach(hackId => {
        const checkbox = document.getElementById(hackId);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    hackToggles[hackId].enable();
                    freeFireHack.updateHackStatus(hackId, true);
                } else {
                    hackToggles[hackId].disable();
                    freeFireHack.updateHackStatus(hackId, false);
                }
            });
        }
    });
}

function setupSettingsSliders() {
    const sliders = ['aimbotFov', 'aimbotSmooth', 'speedMultiplier', 'espDistance'];
    
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', function() {
                freeFireHack.updateSettings();
                updateSliderDisplay(sliderId);
            });
        }
    });

    // Setup aimbot bone selector
    const aimbotBone = document.getElementById('aimbotBone');
    if (aimbotBone) {
        aimbotBone.addEventListener('change', function() {
            freeFireHack.settings.aimbotBone = this.value;
            freeFireHack.log(`Aimbot bone set to: ${this.value}`, 'info');
        });
    }

    // Setup anti-detection toggle
    const antiDetection = document.getElementById('antiDetection');
    if (antiDetection) {
        antiDetection.addEventListener('change', function() {
            if (this.checked) {
                freeFireHack.enableAntiDetection();
            } else {
                freeFireHack.disableAntiDetection();
            }
        });
    }
}

function updateSliderDisplay(sliderId) {
    const slider = document.getElementById(sliderId);
    const displayId = sliderId + 'Value';
    const display = document.getElementById(displayId);
    
    if (display) {
        let value = slider.value;
        switch (sliderId) {
            case 'aimbotFov':
                display.textContent = `${value}°`;
                break;
            case 'aimbotSmooth':
                display.textContent = value;
                break;
            case 'speedMultiplier':
                display.textContent = `${value}x`;
                break;
            case 'espDistance':
                display.textContent = `${value}m`;
                break;
        }
    }
}

function setupMemoryOperations() {
    // Memory write
    document.getElementById('writeMemory').addEventListener('click', async function() {
        const address = document.getElementById('memoryAddress').value;
        const value = document.getElementById('memoryValue').value;
        const dataType = document.getElementById('dataType').value;
        
        if (!address || !value) {
            freeFireHack.log('Please enter both address and value', 'error');
            return;
        }

        const result = await freeFireHack.safeMemoryOperation('write', address, value, dataType);
        if (result) {
            freeFireHack.log(`Successfully wrote ${value} to ${address} (${dataType})`, 'success');
        } else {
            freeFireHack.log(`Failed to write ${value} to ${address}`, 'error');
        }
    });

    // Memory read
    document.getElementById('readMemory').addEventListener('click', async function() {
        const address = document.getElementById('memoryAddress').value;
        const dataType = document.getElementById('dataType').value;
        
        if (!address) {
            freeFireHack.log('Please enter an address', 'error');
            return;
        }

        const value = await freeFireHack.safeMemoryOperation('read', address, null, dataType);
        if (value !== null) {
            document.getElementById('memoryValue').value = value;
            freeFireHack.log(`Read value ${value} from ${address} (${dataType})`, 'success');
        } else {
            freeFireHack.log(`Failed to read from ${address}`, 'error');
        }
    });

    // Memory search
    document.getElementById('searchMemory').addEventListener('click', async function() {
        const value = document.getElementById('searchValue').value;
        const dataType = document.getElementById('searchDataType').value;
        
        if (!value) {
            freeFireHack.log('Please enter a search value', 'error');
            return;
        }

        const results = await freeFireHack.searchMemory(value);
        displayMemoryResults(results);
    });

    // Clear search results
    document.getElementById('clearSearch').addEventListener('click', function() {
        document.getElementById('memoryResults').innerHTML = '';
        freeFireHack.log('Search results cleared', 'info');
    });

    // Dump memory
    document.getElementById('dumpMemory').addEventListener('click', async function() {
        const address = document.getElementById('memoryAddress').value;
        if (!address) {
            freeFireHack.log('Please enter an address to dump', 'error');
            return;
        }

        freeFireHack.log('Dumping memory...', 'info');
        if (typeof h5ggIntegration !== 'undefined') {
            const dump = await h5ggIntegration.dumpMemory(parseInt(address, 16), 1024);
            if (dump) {
                displayMemoryDump(dump, address);
                freeFireHack.log('Memory dump completed', 'success');
            } else {
                freeFireHack.log('Memory dump failed', 'error');
            }
        } else {
            freeFireHack.log('H5GG integration not available', 'error');
        }
    });

    // Scan pattern
    document.getElementById('scanPattern').addEventListener('click', async function() {
        const pattern = prompt('Enter pattern (hex):', '48 65 6C 6C 6F');
        const mask = prompt('Enter mask (x = wildcard):', 'xx xx xx xx xx');
        
        if (pattern && mask) {
            freeFireHack.log('Scanning for pattern...', 'info');
            if (typeof h5ggIntegration !== 'undefined') {
                const results = await h5ggIntegration.scanPattern(pattern, mask);
                displayMemoryResults(results);
                freeFireHack.log(`Found ${results.length} pattern matches`, 'success');
            } else {
                freeFireHack.log('H5GG integration not available', 'error');
            }
        }
    });

    // Freeze value
    document.getElementById('freezeValue').addEventListener('click', function() {
        const address = document.getElementById('memoryAddress').value;
        const value = document.getElementById('memoryValue').value;
        const dataType = document.getElementById('dataType').value;
        
        if (!address || !value) {
            freeFireHack.log('Please enter address and value to freeze', 'error');
            return;
        }

        if (!freeFireHack.freezeInterval) {
            freeFireHack.freezeInterval = setInterval(async () => {
                await freeFireHack.safeMemoryOperation('write', address, value, dataType);
            }, 100);
            freeFireHack.log(`Freezing value ${value} at ${address}`, 'success');
            this.textContent = 'Unfreeze Value';
        } else {
            clearInterval(freeFireHack.freezeInterval);
            freeFireHack.freezeInterval = null;
            freeFireHack.log('Value unfrozen', 'info');
            this.textContent = 'Freeze Value';
        }
    });
}

function displayMemoryResults(results) {
    const resultsContainer = document.getElementById('memoryResults');
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.textContent = 'No results found';
        return;
    }

    results.forEach((result, index) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'memory-result-item';
        resultDiv.innerHTML = `
            <div class="result-address">${result.address}</div>
            <div class="result-value">${result.value}</div>
            <div class="result-actions">
                <button onclick="selectAddress('${result.address}', '${result.value}')" class="btn btn-sm btn-primary">Select</button>
                <button onclick="writeToAddress('${result.address}')" class="btn btn-sm btn-success">Write</button>
            </div>
        `;
        resultsContainer.appendChild(resultDiv);
    });
}

function displayMemoryDump(dump, address) {
    const dumpContainer = document.getElementById('memoryDump');
    dumpContainer.innerHTML = '';
    
    const dumpDiv = document.createElement('div');
    dumpDiv.className = 'memory-dump-content';
    dumpDiv.innerHTML = `
        <h4>Memory Dump at ${address}</h4>
        <div class="dump-hex">${formatHexDump(dump)}</div>
    `;
    dumpContainer.appendChild(dumpDiv);
}

function formatHexDump(data) {
    let hex = '';
    for (let i = 0; i < Math.min(data.length, 256); i += 16) {
        let line = '';
        for (let j = 0; j < 16; j++) {
            if (i + j < data.length) {
                line += data[i + j].toString(16).padStart(2, '0') + ' ';
            } else {
                line += '   ';
            }
        }
        hex += line + '\n';
    }
    return hex;
}

function selectAddress(address, value) {
    document.getElementById('memoryAddress').value = address;
    document.getElementById('memoryValue').value = value;
    freeFireHack.log(`Selected address ${address} with value ${value}`, 'info');
}

function writeToAddress(address) {
    document.getElementById('memoryAddress').value = address;
    freeFireHack.log(`Address ${address} selected for writing`, 'info');
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
    
    // F11 - Toggle Auto Shoot
    if (event.key === 'F11') {
        event.preventDefault();
        const autoShootCheckbox = document.getElementById('autoShoot');
        autoShootCheckbox.checked = !autoShootCheckbox.checked;
        autoShootCheckbox.dispatchEvent(new Event('change'));
    }
    
    // F12 - Toggle Headshot
    if (event.key === 'F12') {
        event.preventDefault();
        const headshotCheckbox = document.getElementById('headshot');
        headshotCheckbox.checked = !headshotCheckbox.checked;
        headshotCheckbox.dispatchEvent(new Event('change'));
    }
    
    // Ctrl + 1 - Toggle Infinite Armor
    if (event.ctrlKey && event.key === '1') {
        event.preventDefault();
        const infiniteArmorCheckbox = document.getElementById('infiniteArmor');
        infiniteArmorCheckbox.checked = !infiniteArmorCheckbox.checked;
        infiniteArmorCheckbox.dispatchEvent(new Event('change'));
    }
    
    // Ctrl + 2 - Toggle No Fall Damage
    if (event.ctrlKey && event.key === '2') {
        event.preventDefault();
        const noFallDamageCheckbox = document.getElementById('noFallDamage');
        noFallDamageCheckbox.checked = !noFallDamageCheckbox.checked;
        noFallDamageCheckbox.dispatchEvent(new Event('change'));
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
    setupConfigButtons();
}

// Setup config save/load buttons
function setupConfigButtons() {
    document.getElementById('saveConfigBtn').addEventListener('click', saveConfig);
    document.getElementById('loadConfigBtn').addEventListener('click', loadConfig);
}

// Save configuration
function saveConfig() {
    const config = {
        settings: freeFireHack.settings,
        hacks: Array.from(freeFireHack.activeHacks),
        memoryAddresses: freeFireHack.memoryAddresses,
        antiDetection: freeFireHack.antiDetection,
        levelSystem: freeFireHack.levelSystem
    };
    
    const configString = JSON.stringify(config, null, 2);
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'freefire_h5gg_config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    freeFireHack.log('Configuration saved successfully', 'success');
}

// Load configuration
function loadConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const config = JSON.parse(e.target.result);
                    
                    // Load settings
                    if (config.settings) {
                        freeFireHack.settings = { ...freeFireHack.settings, ...config.settings };
                        updateSettingsUI();
                    }
                    
                    // Load hacks
                    if (config.hacks) {
                        config.hacks.forEach(hackName => {
                            const checkbox = document.getElementById(hackName);
                            if (checkbox) {
                                checkbox.checked = true;
                                checkbox.dispatchEvent(new Event('change'));
                            }
                        });
                    }
                    
                    // Load memory addresses
                    if (config.memoryAddresses) {
                        freeFireHack.memoryAddresses = { ...freeFireHack.memoryAddresses, ...config.memoryAddresses };
                    }
                    
                    // Load anti-detection settings
                    if (config.antiDetection) {
                        freeFireHack.antiDetection = { ...freeFireHack.antiDetection, ...config.antiDetection };
                    }
                    
                    freeFireHack.log('Configuration loaded successfully', 'success');
                } catch (error) {
                    freeFireHack.log(`Failed to load configuration: ${error.message}`, 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Update settings UI
function updateSettingsUI() {
    document.getElementById('aimbotFov').value = freeFireHack.settings.aimbotFov || 90;
    document.getElementById('aimbotSmooth').value = freeFireHack.settings.aimbotSmooth || 5;
    document.getElementById('speedMultiplier').value = freeFireHack.settings.speedMultiplier || 2.0;
    document.getElementById('espDistance').value = freeFireHack.settings.espDistance || 200;
    
    if (freeFireHack.settings.aimbotBone) {
        document.getElementById('aimbotBone').value = freeFireHack.settings.aimbotBone;
    }
    
    updateSliderDisplay('aimbotFov');
    updateSliderDisplay('aimbotSmooth');
    updateSliderDisplay('speedMultiplier');
    updateSliderDisplay('espDistance');
}

// Export functions for global access
window.freeFireHack = freeFireHack;
window.h5ggIntegration = h5ggIntegration;
window.toggleRadar = toggleRadar;
window.toggleAntiDetection = toggleAntiDetection;