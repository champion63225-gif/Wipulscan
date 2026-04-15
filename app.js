// ====================== WIPULSCAN PRO - Kompatible Version ======================
const W = window.W = {};

const $ = id => document.getElementById(id);

let S = {
    on: false,
    sSig: 42,
    peak: 0,
    tPing: 45,
    tJit: 12,
    tDL: 0,
    tDBm: -82,
    proUnlocked: false
};

function sLvl(v) {
    if (v < 30) return {lbl:'Sehr schwach', col:'#f44336'};
    if (v < 50) return {lbl:'Schwach', col:'#ff9800'};
    if (v < 68) return {lbl:'Mittel', col:'#ffc107'};
    if (v < 82) return {lbl:'Gut', col:'#8bc34a'};
    return {lbl:'Hervorragend', col:'#00e676'};
}

function showToast(msg) {
    const t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

// ====================== CORE MEASUREMENT ======================
function measure() {
    let val = 35 + Math.random() * 52;
    S.sSig = S.sSig * 0.88 + val * 0.12;
    S.tDBm = Math.round(-95 + S.sSig * 0.65);
    S.tPing = Math.round(25 + Math.random() * 65);
    S.tJit = Math.round(4 + Math.random() * 18);

    if (S.sSig > S.peak) S.peak = S.sSig;

    updateUI();
}

function updateUI() {
    const lvl = sLvl(S.sSig);
    const v = Math.round(S.sSig);

    $('sbadge').textContent = lvl.lbl;
    $('sbadge').style.color = lvl.col;

    $('qsl').textContent = lvl.lbl;
    $('qsl').style.color = lvl.col;
    $('qsd').textContent = S.tDBm + ' dBm';
    $('vping').textContent = S.tPing + 'ms';
    $('vjit').textContent = S.tJit + 'ms';
    $('vbest').textContent = Math.round(S.peak) + '%';
}

// ====================== BUTTON FUNCTIONS ======================
W.tapGo = function() {
    $('tapgate').classList.add('gone');
    setTimeout(() => {
        $('consent').style.display = 'flex';
    }, 600);
};

W.acceptConsent = function() {
    if (!$('chk').checked) {
        showToast('Bitte Zustimmung geben');
        return;
    }
    $('consent').style.display = 'none';
    $('sui').style.display = 'block';
};

W.toggleScan = function() {
    S.on = !S.on;
    const btn = $('bstart');
    
    if (S.on) {
        btn.classList.add('on');
        $('bl').textContent = 'STOP';
        window._iv = setInterval(measure, 320);
        measure();
    } else {
        btn.classList.remove('on');
        $('bl').textContent = 'SCANNEN';
        clearInterval(window._iv);
    }
};

W.resetAll = function() {
    S.peak = 0;
    showToast('Reset durchgeführt');
};

W.openPro = function() { $('iov-pro').style.display = 'flex'; };
W.closePro = function() { $('iov-pro').style.display = 'none'; };
W.openInstall = function() { $('iov').style.display = 'flex'; };
W.closeInstall = function() { $('iov').style.display = 'none'; };
W.openInfo = function() { $('iov-info').style.display = 'flex'; };
W.closeInfo = function() { $('iov-info').style.display = 'none'; };

W.unlockPro = function() {
    S.proUnlocked = true;
    showToast('PRO freigeschaltet (Demo)');
    W.closePro();
};

// ====================== START ======================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%cWIPULSCAN PRO gestartet', 'color:#d4af37');
});
