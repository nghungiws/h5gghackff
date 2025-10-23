// Free Fire Hack Functions
class FreeFireHack {
    constructor() {
        this.isConnected = false;
        this.h5ggConnected = false;
        this.activeHacks = new Set();
        this.memoryAddresses = {
            health: '0x12345678',
            ammo: '0x12345679',
            position: '0x1234567A',
            rotation: '0x1234567B',
            speed: '0x1234567C',
            recoil: '0x1234567D',
            wallhack: '0x1234567E',
            enemyPositions: '0x1234567F',
            enemyHealth: '0x12345680',
            enemyDistance: '0x12345681',
            enemyVisibility: '0x12345682',
            aimbotTarget: '0x12345683',
            radarData: '0x12345684'
        };
        this.settings = {
            aimbotFov: 90,
            aimbotSmooth: 5,
            speedMultiplier: 2.0,
            espDistance: 200,
            aimbotBone: 'head'
        };
        this.antiDetection = {
            enabled: true,
            randomizeAddresses: true,
            delayBetweenWrites: 10,
            maxWritesPerSecond: 100,
            lastWriteTime: 0,
            writeCount: 0,
            writeResetTime: 0
        };
        this.levelSystem = {
            currentLevel: 1,
            experience: 0,
            experienceToNext: 100,
            totalExperience: 0,
            unlockedFeatures: ['basicHacks'],
            achievements: [],
            stats: {
                hacksUsed: 0,
                timeActive: 0,
                memoryOperations: 0,
                successfulHacks: 0
            }
        };
        this.logContainer = document.getElementById('logContainer');
    }

    // Logging system
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        this.logContainer.appendChild(logEntry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    // H5GG Integration
    async connectToH5GG() {
        try {
            this.log('Attempting to connect to H5GG...', 'info');
            
            // Simulate H5GG connection
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (typeof window.h5gg !== 'undefined') {
                this.h5ggConnected = true;
                this.log('Successfully connected to H5GG!', 'success');
                this.updateStatus('h5ggStatus', 'Connected', true);
                return true;
            } else {
                this.log('H5GG not detected. Please ensure H5GG is running.', 'error');
                return false;
            }
        } catch (error) {
            this.log(`Connection failed: ${error.message}`, 'error');
            return false;
        }
    }

    // Status updates
    updateStatus(elementId, text, isConnected = false) {
        const element = document.getElementById(elementId);
        element.textContent = text;
        element.className = isConnected ? 'status-value connected' : 'status-value';
    }

    // Memory operations
    async readMemory(address) {
        try {
            if (!this.h5ggConnected) {
                this.log('H5GG not connected', 'error');
                return null;
            }

            // Simulate memory read
            const value = Math.floor(Math.random() * 1000);
            this.log(`Read memory at ${address}: ${value}`, 'info');
            this.updateStats('memoryOperations', 1);
            return value;
        } catch (error) {
            this.log(`Memory read failed: ${error.message}`, 'error');
            return null;
        }
    }

    async writeMemory(address, value) {
        try {
            if (!this.h5ggConnected) {
                this.log('H5GG not connected', 'error');
                return false;
            }

            // Simulate memory write
            this.log(`Write memory at ${address}: ${value}`, 'info');
            this.updateStats('memoryOperations', 1);
            return true;
        } catch (error) {
            this.log(`Memory write failed: ${error.message}`, 'error');
            return false;
        }
    }

    async searchMemory(value) {
        try {
            if (!this.h5ggConnected) {
                this.log('H5GG not connected', 'error');
                return [];
            }

            // Simulate memory search
            const results = [];
            for (let i = 0; i < 5; i++) {
                results.push({
                    address: `0x${(0x10000000 + Math.random() * 0x10000000).toString(16).toUpperCase()}`,
                    value: value
                });
            }
            
            this.log(`Found ${results.length} matches for value ${value}`, 'info');
            return results;
        } catch (error) {
            this.log(`Memory search failed: ${error.message}`, 'error');
            return [];
        }
    }

    // Hack implementations
    enableAimbot() {
        this.log('Aimbot enabled', 'success');
        this.activeHacks.add('aimbot');
        this.startAimbotLoop();
        this.setupAimbotHotkeys();
        this.addExperience(10);
        this.updateStats('successfulHacks', 1);
    }

    disableAimbot() {
        this.log('Aimbot disabled', 'info');
        this.activeHacks.delete('aimbot');
        this.removeAimbotHotkeys();
    }

    startAimbotLoop() {
        if (!this.activeHacks.has('aimbot')) return;

        // Advanced aimbot functionality
        this.log(`Aimbot active - FOV: ${this.settings.aimbotFov}°, Smooth: ${this.settings.aimbotSmooth}`, 'info');
        
        // Find nearest enemy
        this.findNearestEnemy();
        
        // Apply aimbot smoothing
        this.applyAimbotSmoothing();
        
        setTimeout(() => {
            if (this.activeHacks.has('aimbot')) {
                this.startAimbotLoop();
            }
        }, 16); // 60 FPS
    }

    // Find nearest enemy for aimbot
    findNearestEnemy() {
        // Simulate enemy detection
        const enemies = this.getEnemyList();
        if (enemies.length > 0) {
            const nearestEnemy = enemies.reduce((closest, enemy) => {
                const distance = this.calculateDistance(enemy.position);
                return distance < closest.distance ? { ...enemy, distance } : closest;
            }, { distance: Infinity });
            
            if (nearestEnemy.distance <= this.settings.aimbotFov) {
                this.aimAtTarget(nearestEnemy);
            }
        }
    }

    // Get enemy list (simulated)
    getEnemyList() {
        return [
            { id: 1, position: { x: 100, y: 50, z: 0 }, health: 80, name: 'Enemy1' },
            { id: 2, position: { x: 200, y: 100, z: 0 }, health: 60, name: 'Enemy2' },
            { id: 3, position: { x: 150, y: 75, z: 0 }, health: 90, name: 'Enemy3' }
        ];
    }

    // Calculate distance to target
    calculateDistance(targetPos) {
        const playerPos = { x: 0, y: 0, z: 0 }; // Simulated player position
        return Math.sqrt(
            Math.pow(targetPos.x - playerPos.x, 2) +
            Math.pow(targetPos.y - playerPos.y, 2) +
            Math.pow(targetPos.z - playerPos.z, 2)
        );
    }

    // Aim at target with smoothing
    aimAtTarget(target) {
        const smoothing = this.settings.aimbotSmooth / 10;
        this.log(`Aiming at ${target.name} (Distance: ${target.distance.toFixed(2)})`, 'info');
        
        // Simulate smooth aiming
        this.writeMemory(this.memoryAddresses.rotation, target.position.x * smoothing);
    }

    // Apply aimbot smoothing
    applyAimbotSmoothing() {
        // Simulate smooth mouse movement
        const currentRotation = this.readMemory(this.memoryAddresses.rotation);
        if (currentRotation !== null) {
            // Apply smoothing algorithm
            const smoothedRotation = currentRotation * (this.settings.aimbotSmooth / 10);
            this.writeMemory(this.memoryAddresses.rotation, smoothedRotation);
        }
    }

    // Setup aimbot hotkeys
    setupAimbotHotkeys() {
        document.addEventListener('keydown', this.aimbotKeyHandler);
    }

    // Remove aimbot hotkeys
    removeAimbotHotkeys() {
        document.removeEventListener('keydown', this.aimbotKeyHandler);
    }

    // Aimbot key handler
    aimbotKeyHandler = (event) => {
        if (event.key === 'F1' && this.activeHacks.has('aimbot')) {
            this.toggleAimbotTarget();
        }
    }

    // Toggle aimbot target
    toggleAimbotTarget() {
        this.log('Aimbot target toggled', 'info');
    }

    enableWallhack() {
        this.log('Wallhack enabled', 'success');
        this.activeHacks.add('wallhack');
        this.startWallhackLoop();
        this.createWallhackOverlay();
        this.addExperience(8);
        this.updateStats('successfulHacks', 1);
    }

    disableWallhack() {
        this.log('Wallhack disabled', 'info');
        this.activeHacks.delete('wallhack');
        this.removeWallhackOverlay();
    }

    startWallhackLoop() {
        if (!this.activeHacks.has('wallhack')) return;

        // Advanced wallhack functionality
        this.updateWallhackData();
        this.renderWallhackOverlay();
        
        setTimeout(() => {
            if (this.activeHacks.has('wallhack')) {
                this.startWallhackLoop();
            }
        }, 16); // 60 FPS
    }

    // Update wallhack data
    updateWallhackData() {
        const enemies = this.getEnemyList();
        
        // Enable wall penetration
        this.writeMemory(this.memoryAddresses.wallhack, 1);
        
        // Update enemy visibility through walls
        enemies.forEach(enemy => {
            this.writeMemory(this.memoryAddresses.enemyVisibility, 1);
        });
    }

    // Create wallhack overlay
    createWallhackOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'wallhackOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9998';
        overlay.style.background = 'transparent';
        document.body.appendChild(overlay);
        
        this.wallhackOverlay = overlay;
    }

    // Remove wallhack overlay
    removeWallhackOverlay() {
        const overlay = document.getElementById('wallhackOverlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Render wallhack overlay
    renderWallhackOverlay() {
        if (!this.wallhackOverlay) return;

        const enemies = this.getEnemyList();
        let overlayHTML = '';
        
        enemies.forEach(enemy => {
            const screenPos = this.worldToScreen(enemy.position);
            if (screenPos) {
                overlayHTML += `
                    <div style="
                        position: absolute;
                        left: ${screenPos.x - 15}px;
                        top: ${screenPos.y - 15}px;
                        width: 30px;
                        height: 30px;
                        border: 2px solid #FF0000;
                        border-radius: 50%;
                        background: rgba(255, 0, 0, 0.2);
                        animation: pulse 1s infinite;
                    "></div>
                `;
            }
        });
        
        this.wallhackOverlay.innerHTML = overlayHTML;
    }

    enableESP() {
        this.log('ESP enabled', 'success');
        this.activeHacks.add('esp');
        this.startESPLoop();
        this.createESPCanvas();
        this.addExperience(12);
        this.updateStats('successfulHacks', 1);
    }

    disableESP() {
        this.log('ESP disabled', 'info');
        this.activeHacks.delete('esp');
        this.removeESPCanvas();
    }

    startESPLoop() {
        if (!this.activeHacks.has('esp')) return;

        // Advanced ESP functionality
        this.updateESPData();
        this.renderESPOverlay();
        
        setTimeout(() => {
            if (this.activeHacks.has('esp')) {
                this.startESPLoop();
            }
        }, 16); // 60 FPS
    }

    // Update ESP data
    updateESPData() {
        const enemies = this.getEnemyList();
        const teammates = this.getTeammateList();
        
        // Update enemy positions
        enemies.forEach(enemy => {
            this.writeMemory(this.memoryAddresses.enemyPositions, enemy.position.x);
            this.writeMemory(this.memoryAddresses.enemyHealth, enemy.health);
            this.writeMemory(this.memoryAddresses.enemyDistance, enemy.distance);
        });
    }

    // Get teammate list (simulated)
    getTeammateList() {
        return [
            { id: 1, position: { x: 50, y: 25, z: 0 }, health: 100, name: 'Teammate1' },
            { id: 2, position: { x: 75, y: 40, z: 0 }, health: 85, name: 'Teammate2' }
        ];
    }

    // Create ESP canvas overlay
    createESPCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'espCanvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        canvas.style.background = 'transparent';
        document.body.appendChild(canvas);
        
        this.espCanvas = canvas;
        this.espContext = canvas.getContext('2d');
    }

    // Remove ESP canvas
    removeESPCanvas() {
        const canvas = document.getElementById('espCanvas');
        if (canvas) {
            canvas.remove();
        }
    }

    // Render ESP overlay
    renderESPOverlay() {
        if (!this.espContext) return;

        const canvas = this.espCanvas;
        this.espContext.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Draw enemy ESP
        const enemies = this.getEnemyList();
        enemies.forEach(enemy => {
            this.drawESPBox(enemy, '#FF0000', 'Enemy');
        });

        // Draw teammate ESP
        const teammates = this.getTeammateList();
        teammates.forEach(teammate => {
            this.drawESPBox(teammate, '#00FF00', 'Teammate');
        });
    }

    // Draw ESP box
    drawESPBox(player, color, type) {
        const ctx = this.espContext;
        const screenPos = this.worldToScreen(player.position);
        
        if (screenPos) {
            // Draw box
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(screenPos.x - 25, screenPos.y - 50, 50, 100);
            
            // Draw name
            ctx.fillStyle = color;
            ctx.font = '12px Arial';
            ctx.fillText(player.name, screenPos.x - 25, screenPos.y - 55);
            
            // Draw health bar
            const healthWidth = (player.health / 100) * 50;
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(screenPos.x - 25, screenPos.y + 55, healthWidth, 5);
            
            // Draw distance
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${player.distance.toFixed(1)}m`, screenPos.x - 25, screenPos.y + 75);
        }
    }

    // Convert world position to screen position
    worldToScreen(worldPos) {
        // Simulate 3D to 2D projection
        const screenX = (worldPos.x / 100) * window.innerWidth;
        const screenY = (worldPos.y / 100) * window.innerHeight;
        
        return {
            x: Math.max(0, Math.min(screenX, window.innerWidth)),
            y: Math.max(0, Math.min(screenY, window.innerHeight))
        };
    }

    enableNoRecoil() {
        this.log('No Recoil enabled', 'success');
        this.activeHacks.add('noRecoil');
        this.startNoRecoilLoop();
        this.addExperience(8);
        this.updateStats('successfulHacks', 1);
    }

    disableNoRecoil() {
        this.log('No Recoil disabled', 'info');
        this.activeHacks.delete('noRecoil');
    }

    startNoRecoilLoop() {
        if (!this.activeHacks.has('noRecoil')) return;

        // Advanced no recoil with weapon-specific settings
        this.applyNoRecoil();
        
        setTimeout(() => {
            if (this.activeHacks.has('noRecoil')) {
                this.startNoRecoilLoop();
            }
        }, 16); // 60 FPS
    }

    applyNoRecoil() {
        // Set recoil to 0 for all weapons
        this.writeMemory(this.memoryAddresses.recoil, 0);
        
        // Also disable weapon sway
        this.writeMemory(this.memoryAddresses.recoil + 4, 0);
        
        // Disable camera shake
        this.writeMemory(this.memoryAddresses.recoil + 8, 0);
    }

    enableGodMode() {
        this.log('God Mode enabled', 'success');
        this.activeHacks.add('godMode');
        this.startGodModeLoop();
        this.addExperience(15);
        this.updateStats('successfulHacks', 1);
    }

    disableGodMode() {
        this.log('God Mode disabled', 'info');
        this.activeHacks.delete('godMode');
    }

    startGodModeLoop() {
        if (!this.activeHacks.has('godMode')) return;

        // Advanced god mode with multiple protections
        this.applyGodMode();
        
        setTimeout(() => {
            if (this.activeHacks.has('godMode')) {
                this.startGodModeLoop();
            }
        }, 100);
    }

    applyGodMode() {
        // Set health to maximum
        this.writeMemory(this.memoryAddresses.health, 100);
        
        // Set armor to maximum
        this.writeMemory(this.memoryAddresses.armor, 100);
        
        // Disable damage
        this.writeMemory(this.memoryAddresses.health + 8, 0);
        
        // Disable fall damage
        this.writeMemory(this.memoryAddresses.health + 12, 0);
    }

    enableInfiniteHealth() {
        this.log('Infinite Health enabled', 'success');
        this.activeHacks.add('infiniteHealth');
        this.startHealthLoop();
    }

    disableInfiniteHealth() {
        this.log('Infinite Health disabled', 'info');
        this.activeHacks.delete('infiniteHealth');
    }

    startHealthLoop() {
        if (!this.activeHacks.has('infiniteHealth')) return;

        this.writeMemory(this.memoryAddresses.health, 100);
        
        setTimeout(() => {
            if (this.activeHacks.has('infiniteHealth')) {
                this.startHealthLoop();
            }
        }, 100);
    }

    enableInfiniteAmmo() {
        this.log('Infinite Ammo enabled', 'success');
        this.activeHacks.add('infiniteAmmo');
        this.startAmmoLoop();
    }

    disableInfiniteAmmo() {
        this.log('Infinite Ammo disabled', 'info');
        this.activeHacks.delete('infiniteAmmo');
    }

    startAmmoLoop() {
        if (!this.activeHacks.has('infiniteAmmo')) return;

        this.writeMemory(this.memoryAddresses.ammo, 999);
        
        setTimeout(() => {
            if (this.activeHacks.has('infiniteAmmo')) {
                this.startAmmoLoop();
            }
        }, 50);
    }

    enableSpeedHack() {
        this.log(`Speed Hack enabled - Multiplier: ${this.settings.speedMultiplier}x`, 'success');
        this.activeHacks.add('speedHack');
        this.startSpeedHackLoop();
        this.setupSpeedHackHotkeys();
    }

    disableSpeedHack() {
        this.log('Speed Hack disabled', 'info');
        this.activeHacks.delete('speedHack');
        this.writeMemory(this.memoryAddresses.speed, 1.0);
        this.removeSpeedHackHotkeys();
    }

    startSpeedHackLoop() {
        if (!this.activeHacks.has('speedHack')) return;

        // Advanced speed hack with keybind support
        this.applySpeedMultiplier();
        
        setTimeout(() => {
            if (this.activeHacks.has('speedHack')) {
                this.startSpeedHackLoop();
            }
        }, 50);
    }

    // Apply speed multiplier
    applySpeedMultiplier() {
        const currentSpeed = this.readMemory(this.memoryAddresses.speed);
        if (currentSpeed !== null) {
            const newSpeed = currentSpeed * this.settings.speedMultiplier;
            this.writeMemory(this.memoryAddresses.speed, newSpeed);
        }
    }

    // Setup speed hack hotkeys
    setupSpeedHackHotkeys() {
        document.addEventListener('keydown', this.speedHackKeyHandler);
        document.addEventListener('keyup', this.speedHackKeyHandler);
    }

    // Remove speed hack hotkeys
    removeSpeedHackHotkeys() {
        document.removeEventListener('keydown', this.speedHackKeyHandler);
        document.removeEventListener('keyup', this.speedHackKeyHandler);
    }

    // Speed hack key handler
    speedHackKeyHandler = (event) => {
        if (event.key === 'Shift' && this.activeHacks.has('speedHack')) {
            if (event.type === 'keydown') {
                this.activateSpeedBoost();
            } else if (event.type === 'keyup') {
                this.deactivateSpeedBoost();
            }
        }
    }

    // Activate speed boost
    activateSpeedBoost() {
        const boostMultiplier = this.settings.speedMultiplier * 1.5;
        this.writeMemory(this.memoryAddresses.speed, boostMultiplier);
        this.log(`Speed boost activated: ${boostMultiplier}x`, 'info');
    }

    // Deactivate speed boost
    deactivateSpeedBoost() {
        this.writeMemory(this.memoryAddresses.speed, this.settings.speedMultiplier);
        this.log('Speed boost deactivated', 'info');
    }

    // Add radar system
    enableRadar() {
        this.log('Radar enabled', 'success');
        this.activeHacks.add('radar');
        this.createRadarOverlay();
    }

    disableRadar() {
        this.log('Radar disabled', 'info');
        this.activeHacks.delete('radar');
        this.removeRadarOverlay();
    }

    // Create radar overlay
    createRadarOverlay() {
        const radar = document.createElement('div');
        radar.id = 'radarOverlay';
        radar.style.position = 'fixed';
        radar.style.top = '20px';
        radar.style.right = '20px';
        radar.style.width = '200px';
        radar.style.height = '200px';
        radar.style.border = '2px solid #00FF00';
        radar.style.borderRadius = '50%';
        radar.style.background = 'rgba(0, 0, 0, 0.7)';
        radar.style.zIndex = '10000';
        radar.style.pointerEvents = 'none';
        document.body.appendChild(radar);
        
        this.radarOverlay = radar;
        this.startRadarLoop();
    }

    // Remove radar overlay
    removeRadarOverlay() {
        const radar = document.getElementById('radarOverlay');
        if (radar) {
            radar.remove();
        }
    }

    // Start radar loop
    startRadarLoop() {
        if (!this.activeHacks.has('radar')) return;

        this.updateRadar();
        
        setTimeout(() => {
            if (this.activeHacks.has('radar')) {
                this.startRadarLoop();
            }
        }, 100);
    }

    // Update radar
    updateRadar() {
        if (!this.radarOverlay) return;

        const enemies = this.getEnemyList();
        const teammates = this.getTeammateList();
        
        let radarHTML = '<div style="position: relative; width: 100%; height: 100%;">';
        
        // Draw center point (player)
        radarHTML += '<div style="position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; background: #00FF00; border-radius: 50%; transform: translate(-50%, -50%);"></div>';
        
        // Draw enemies
        enemies.forEach(enemy => {
            const radarPos = this.worldToRadar(enemy.position);
            radarHTML += `<div style="position: absolute; left: ${radarPos.x}%; top: ${radarPos.y}%; width: 6px; height: 6px; background: #FF0000; border-radius: 50%; transform: translate(-50%, -50%);"></div>`;
        });
        
        // Draw teammates
        teammates.forEach(teammate => {
            const radarPos = this.worldToRadar(teammate.position);
            radarHTML += `<div style="position: absolute; left: ${radarPos.x}%; top: ${radarPos.y}%; width: 4px; height: 4px; background: #0000FF; border-radius: 50%; transform: translate(-50%, -50%);"></div>`;
        });
        
        radarHTML += '</div>';
        this.radarOverlay.innerHTML = radarHTML;
    }

    // Convert world position to radar position
    worldToRadar(worldPos) {
        const maxDistance = 100; // Maximum radar range
        const distance = Math.min(this.calculateDistance(worldPos), maxDistance);
        const angle = Math.atan2(worldPos.y, worldPos.x);
        
        const x = 50 + (distance / maxDistance) * 40 * Math.cos(angle);
        const y = 50 + (distance / maxDistance) * 40 * Math.sin(angle);
        
        return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
    }

    // Settings update
    updateSettings() {
        this.settings.aimbotFov = parseInt(document.getElementById('aimbotFov').value);
        this.settings.aimbotSmooth = parseInt(document.getElementById('aimbotSmooth').value);
        this.settings.speedMultiplier = parseFloat(document.getElementById('speedMultiplier').value);
        this.settings.espDistance = parseInt(document.getElementById('espDistance').value);
        this.settings.aimbotBone = document.getElementById('aimbotBone').value;

        // Update display values
        document.getElementById('fovValue').textContent = `${this.settings.aimbotFov}°`;
        document.getElementById('smoothValue').textContent = this.settings.aimbotSmooth;
        document.getElementById('speedValue').textContent = `${this.settings.speedMultiplier}x`;
        document.getElementById('espDistanceValue').textContent = `${this.settings.espDistance}m`;

        this.log('Settings updated', 'info');
    }

    // Reset all hacks
    resetAll() {
        this.activeHacks.clear();
        
        // Disable all checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset settings
        document.getElementById('aimbotFov').value = 90;
        document.getElementById('aimbotSmooth').value = 5;
        document.getElementById('speedMultiplier').value = 2;
        this.updateSettings();

        this.log('All hacks reset', 'info');
    }

    // Anti-detection methods
    randomizeAddress(address) {
        if (!this.antiDetection.randomizeAddresses) return address;
        
        // Add small random offset to address
        const offset = Math.floor(Math.random() * 100) - 50;
        const baseAddress = parseInt(address, 16);
        return '0x' + (baseAddress + offset).toString(16).toUpperCase();
    }

    // Check write rate limit
    canWrite() {
        if (!this.antiDetection.enabled) return true;
        
        const now = Date.now();
        
        // Reset write count every second
        if (now - this.antiDetection.writeResetTime >= 1000) {
            this.antiDetection.writeCount = 0;
            this.antiDetection.writeResetTime = now;
        }
        
        // Check if we can write
        if (this.antiDetection.writeCount >= this.antiDetection.maxWritesPerSecond) {
            return false;
        }
        
        // Check delay between writes
        if (now - this.antiDetection.lastWriteTime < this.antiDetection.delayBetweenWrites) {
            return false;
        }
        
        return true;
    }

    // Safe memory write with anti-detection
    async safeWriteMemory(address, value, dataType = 'int32') {
        if (!this.canWrite()) {
            this.log('Write rate limited for anti-detection', 'warning');
            return false;
        }
        
        const randomizedAddress = this.randomizeAddress(address);
        const result = await this.writeMemory(randomizedAddress, value, dataType);
        
        if (result) {
            this.antiDetection.writeCount++;
            this.antiDetection.lastWriteTime = Date.now();
        }
        
        return result;
    }

    // Safe memory read with anti-detection
    async safeReadMemory(address, dataType = 'int32') {
        const randomizedAddress = this.randomizeAddress(address);
        return await this.readMemory(randomizedAddress, dataType);
    }

    // Enable anti-detection
    enableAntiDetection() {
        this.antiDetection.enabled = true;
        this.log('Anti-detection enabled', 'success');
    }

    // Disable anti-detection
    disableAntiDetection() {
        this.antiDetection.enabled = false;
        this.log('Anti-detection disabled', 'info');
    }

    // Update anti-detection settings
    updateAntiDetectionSettings(settings) {
        this.antiDetection = { ...this.antiDetection, ...settings };
        this.log('Anti-detection settings updated', 'info');
    }

    // Level system methods
    addExperience(amount) {
        this.levelSystem.experience += amount;
        this.levelSystem.totalExperience += amount;
        this.levelSystem.stats.hacksUsed++;
        
        this.log(`Gained ${amount} XP (Total: ${this.levelSystem.experience}/${this.levelSystem.experienceToNext})`, 'info');
        
        if (this.levelSystem.experience >= this.levelSystem.experienceToNext) {
            this.levelUp();
        }
    }

    levelUp() {
        this.levelSystem.currentLevel++;
        this.levelSystem.experience = 0;
        this.levelSystem.experienceToNext = Math.floor(this.levelSystem.experienceToNext * 1.2);
        
        this.log(`Level up! Now level ${this.levelSystem.currentLevel}`, 'success');
        
        // Unlock new features based on level
        this.unlockLevelFeatures();
        
        // Check for achievements
        this.checkAchievements();
    }

    unlockLevelFeatures() {
        const newFeatures = [];
        
        if (this.levelSystem.currentLevel >= 2 && !this.levelSystem.unlockedFeatures.includes('advancedAimbot')) {
            this.levelSystem.unlockedFeatures.push('advancedAimbot');
            newFeatures.push('Advanced Aimbot');
        }
        
        if (this.levelSystem.currentLevel >= 3 && !this.levelSystem.unlockedFeatures.includes('radar')) {
            this.levelSystem.unlockedFeatures.push('radar');
            newFeatures.push('Radar System');
        }
        
        if (this.levelSystem.currentLevel >= 5 && !this.levelSystem.unlockedFeatures.includes('advancedESP')) {
            this.levelSystem.unlockedFeatures.push('advancedESP');
            newFeatures.push('Advanced ESP');
        }
        
        if (this.levelSystem.currentLevel >= 7 && !this.levelSystem.unlockedFeatures.includes('memoryEditor')) {
            this.levelSystem.unlockedFeatures.push('memoryEditor');
            newFeatures.push('Memory Editor');
        }
        
        if (this.levelSystem.currentLevel >= 10 && !this.levelSystem.unlockedFeatures.includes('patternScanner')) {
            this.levelSystem.unlockedFeatures.push('patternScanner');
            newFeatures.push('Pattern Scanner');
        }
        
        if (newFeatures.length > 0) {
            this.log(`Unlocked features: ${newFeatures.join(', ')}`, 'success');
        }
    }

    checkAchievements() {
        const achievements = [
            {
                id: 'first_hack',
                name: 'First Hack',
                description: 'Use your first hack',
                condition: () => this.levelSystem.stats.hacksUsed >= 1,
                reward: 50
            },
            {
                id: 'hack_master',
                name: 'Hack Master',
                description: 'Use 100 hacks',
                condition: () => this.levelSystem.stats.hacksUsed >= 100,
                reward: 200
            },
            {
                id: 'memory_expert',
                name: 'Memory Expert',
                description: 'Perform 1000 memory operations',
                condition: () => this.levelSystem.stats.memoryOperations >= 1000,
                reward: 300
            },
            {
                id: 'level_10',
                name: 'Level 10',
                description: 'Reach level 10',
                condition: () => this.levelSystem.currentLevel >= 10,
                reward: 500
            },
            {
                id: 'perfect_hack',
                name: 'Perfect Hack',
                description: 'Successfully use 50 hacks in a row',
                condition: () => this.levelSystem.stats.successfulHacks >= 50,
                reward: 400
            }
        ];
        
        achievements.forEach(achievement => {
            if (!this.levelSystem.achievements.includes(achievement.id) && achievement.condition()) {
                this.levelSystem.achievements.push(achievement.id);
                this.addExperience(achievement.reward);
                this.log(`Achievement unlocked: ${achievement.name} (+${achievement.reward} XP)`, 'success');
            }
        });
    }

    getLevelInfo() {
        return {
            level: this.levelSystem.currentLevel,
            experience: this.levelSystem.experience,
            experienceToNext: this.levelSystem.experienceToNext,
            totalExperience: this.levelSystem.totalExperience,
            unlockedFeatures: this.levelSystem.unlockedFeatures,
            achievements: this.levelSystem.achievements,
            stats: this.levelSystem.stats
        };
    }

    // Update stats
    updateStats(stat, value) {
        if (this.levelSystem.stats.hasOwnProperty(stat)) {
            this.levelSystem.stats[stat] += value;
        }
    }

    // New hack functions for additional features
    enableAutoShoot() {
        this.log('Auto Shoot enabled', 'success');
        this.activeHacks.add('autoShoot');
        this.startAutoShootLoop();
        this.addExperience(12);
        this.updateStats('successfulHacks', 1);
    }

    disableAutoShoot() {
        this.log('Auto Shoot disabled', 'info');
        this.activeHacks.delete('autoShoot');
    }

    startAutoShootLoop() {
        if (!this.activeHacks.has('autoShoot')) return;

        // Advanced auto shoot with target detection
        this.findAndShootTarget();
        
        setTimeout(() => {
            if (this.activeHacks.has('autoShoot')) {
                this.startAutoShootLoop();
            }
        }, 50);
    }

    findAndShootTarget() {
        const enemies = this.getEnemyList();
        if (enemies.length > 0) {
            const nearestEnemy = enemies.reduce((closest, enemy) => {
                const distance = this.calculateDistance(enemy.position);
                return distance < closest.distance ? { ...enemy, distance } : closest;
            }, { distance: Infinity });
            
            if (nearestEnemy.distance <= 200) { // Within shooting range
                this.autoShootAtTarget(nearestEnemy);
            }
        }
    }

    autoShootAtTarget(target) {
        // Simulate auto shooting
        this.log(`Auto shooting at ${target.name} (Distance: ${target.distance.toFixed(2)}m)`, 'info');
        
        // Trigger shooting mechanism
        this.writeMemory(this.memoryAddresses.autoShoot, 1);
    }

    enableHeadshot() {
        this.log('Headshot mode enabled', 'success');
        this.activeHacks.add('headshot');
        this.startHeadshotLoop();
        this.addExperience(10);
        this.updateStats('successfulHacks', 1);
    }

    disableHeadshot() {
        this.log('Headshot mode disabled', 'info');
        this.activeHacks.delete('headshot');
    }

    startHeadshotLoop() {
        if (!this.activeHacks.has('headshot')) return;

        // Advanced headshot targeting
        this.aimForHead();
        
        setTimeout(() => {
            if (this.activeHacks.has('headshot')) {
                this.startHeadshotLoop();
            }
        }, 16);
    }

    aimForHead() {
        const enemies = this.getEnemyList();
        if (enemies.length > 0) {
            const nearestEnemy = enemies.reduce((closest, enemy) => {
                const distance = this.calculateDistance(enemy.position);
                return distance < closest.distance ? { ...enemy, distance } : closest;
            }, { distance: Infinity });
            
            if (nearestEnemy.distance <= this.settings.aimbotFov) {
                // Aim for head position (adjust Y coordinate)
                const headPosition = {
                    x: nearestEnemy.position.x,
                    y: nearestEnemy.position.y + 1.8, // Head is ~1.8m above body
                    z: nearestEnemy.position.z
                };
                this.aimAtTarget({ ...nearestEnemy, position: headPosition });
            }
        }
    }

    enableInfiniteArmor() {
        this.log('Infinite Armor enabled', 'success');
        this.activeHacks.add('infiniteArmor');
        this.startArmorLoop();
        this.addExperience(8);
        this.updateStats('successfulHacks', 1);
    }

    disableInfiniteArmor() {
        this.log('Infinite Armor disabled', 'info');
        this.activeHacks.delete('infiniteArmor');
    }

    startArmorLoop() {
        if (!this.activeHacks.has('infiniteArmor')) return;

        this.writeMemory(this.memoryAddresses.armor, 100);
        
        setTimeout(() => {
            if (this.activeHacks.has('infiniteArmor')) {
                this.startArmorLoop();
            }
        }, 100);
    }

    enableNoFallDamage() {
        this.log('No Fall Damage enabled', 'success');
        this.activeHacks.add('noFallDamage');
        this.startNoFallDamageLoop();
        this.addExperience(6);
        this.updateStats('successfulHacks', 1);
    }

    disableNoFallDamage() {
        this.log('No Fall Damage disabled', 'info');
        this.activeHacks.delete('noFallDamage');
    }

    startNoFallDamageLoop() {
        if (!this.activeHacks.has('noFallDamage')) return;

        // Disable fall damage
        this.writeMemory(this.memoryAddresses.noFallDamage, 1);
        
        setTimeout(() => {
            if (this.activeHacks.has('noFallDamage')) {
                this.startNoFallDamageLoop();
            }
        }, 50);
    }

    // Update hack status display
    updateHackStatus(hackName, status) {
        const statusElement = document.getElementById(`${hackName}Status`);
        if (statusElement) {
            statusElement.textContent = status ? 'ON' : 'OFF';
            statusElement.className = `hack-status ${status ? 'active' : 'inactive'}`;
        }
    }

    // Enhanced memory operations with better error handling
    async safeMemoryOperation(operation, address, value, dataType = 'int32') {
        try {
            if (!this.h5ggConnected) {
                this.log('H5GG not connected', 'error');
                return false;
            }

            // Use H5GG integration for better compatibility
            if (typeof h5ggIntegration !== 'undefined') {
                if (operation === 'read') {
                    const result = await h5ggIntegration.readMemory(address, dataType);
                    return result ? result.value : null;
                } else if (operation === 'write') {
                    const result = await h5ggIntegration.writeMemory(address, value, dataType);
                    return result ? result.success : false;
                }
            } else {
                // Fallback to original method
                if (operation === 'read') {
                    return await this.readMemory(address);
                } else if (operation === 'write') {
                    return await this.writeMemory(address, value);
                }
            }
        } catch (error) {
            this.log(`Memory operation failed: ${error.message}`, 'error');
            return false;
        }
    }

    // Disconnect
    disconnect() {
        this.resetAll();
        this.h5ggConnected = false;
        this.isConnected = false;
        this.updateStatus('h5ggStatus', 'Not Connected');
        this.updateStatus('gameStatus', 'Disconnected');
        this.log('Disconnected from H5GG', 'info');
    }
}

// Initialize hack instance
const freeFireHack = new FreeFireHack();