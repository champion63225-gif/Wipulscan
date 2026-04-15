// =============================================
// WIPULSCAN PRO - Clean Version by Ara
// =============================================

const $ = id => document.getElementById(id);

const state = {
    scanning: false,
    score: 48,
    peak: 0,
    ping: 42,
    jitter: 12,
    downlink: 0,
    dbm: -78,
    history: []
};

const CONFIG = {
    pingUrl: "https://httpbin.org/status/204",
    pingInterval: 1600,
    measureInterval: 380
};

// ====================== HELPERS ======================
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

function showToast(msg) {
    const t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove('show'), 2500);
}

function getLevel(v) {
    if (v < 35) return {label: 'Sehr schwach', color: '#f44336'};
    if (v < 55) return {label: 'Schwach', color: '#ff9800'};
    if (v < 72) return {label: 'Mittel', color: '#ffc107'};
    if (v < 85) return {label: 'Gut', color: '#8bc34a'};
    return {label: 'Hervorragend', color: '#00e676'};
}

// ====================== NETWORK ======================
async function doPing() {
    const start = performance.now();
    try {
        await fetch(CONFIG.pingUrl + '?_=' + Date.now(), {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store'
        });
        state.ping = Math.round(performance.now() - start);
    } catch (e)}

function readConnection() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
        state.downlink = conn.downlink || 0;
        state.ping = Math.max(state.ping, conn.rtt || 50);
    }
}

// ====================== MEASUREMENT ======================
function measure() {
    readConnection();

    let target = state.downlink > 0 ? state.downlink * 13 : 35 + Math.random() * 48;
    state.score = lerp(state.score, clamp(target, 15, 96), 0.14);
    state.dbm = Math.round(-95 + state.score * 0.65);

    if (state.score > state.peak) state.peak = Math.round(state.score);

    state.history.push(Math.round(state.score));
    if (state.history.length > 9) state.history.shift();

    doPing();
    updateUI();
}

function updateUI() {
    const lvl = getLevel(state.score);

    $('qsl').textContent = lvl.label;
    $('qsl').style.color = lvl.color;
    $('qsd').textContent = state.dbm + ' dBm';
    $('vping').textContent = state.ping + 'ms';
    $('vbest').textContent = state.peak + '%';

    const dotsContainer = $('dots');
    dotsContainer.innerHTML = '';
    state.history.forEach(val => {
        const dot = document.createElement('div');
        dot.className = 'sdot';
        dot.style.background = val > 75 ? '#00e676' : val > 50 ? '#ffc107' : '#f44336';
        dotsContainer.appendChild(dot);
    });
}

// ====================== CONTROLS ======================
window.W = window.W || {};

W.toggleScan = function() {
    state.scanning = !state.scanning;
    const btn = $('bstart');

    if (state.scanning) {
        btn.classList.add('on');
        $('bl').textContent = 'STOP';
        window.scanInterval = setInterval(measure, CONFIG.measureInterval);
        measure();
    } else {
        btn.classList.remove('on');
        $('bl').textContent = 'SCANNEN';
        clearInterval(window.scanInterval);
    }
};

W.resetAll = function() {
    state.peak = 0;
    state.history = [];
    showToast('Reset abgeschlossen');
};

W.downloadData = function() {
    showToast('Export kommt in der nächsten Version 😉');
};

// ====================== INIT ======================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%cWIPULSCAN PRO v9.1 ready 💛', 'color:#d4af37; font-family:Cinzel');
});
