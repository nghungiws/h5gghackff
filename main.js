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

// Export functions for global access
window.freeFireHack = freeFireHack;
window.h5ggIntegration = h5ggIntegration;