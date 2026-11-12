(function () {
    var KEY = 'carta-romantica-v2', app = document.getElementById('app'), body = document.body;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
    var state = {};
    try { state = JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) { state = {} }
    state.t = state.t || {}; state.img = state.img || {};
    function save() { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch (e) { } }

    // ---- textos guardados
    document.querySelectorAll('[data-save]').forEach(function (el) {
        var k = el.getAttribute('data-save'), v = state.t[k];
        if (v != null) {
            if (k === 'msg') { el.innerHTML = ''; v.split(/\n+/).forEach(function (l) { if (l.trim()) { var p = document.createElement('p'); p.textContent = l; el.appendChild(p) } }) }
            else el.textContent = v;
        }
        el.addEventListener('input', function () { state.t[k] = (k === 'msg' ? el.innerText : el.textContent); save() });
        if (k !== 'msg') el.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault() });
    });

    // ---- imágenes guardadas
    function setImg(slot, src) { var b = document.querySelector('[data-slot="' + slot + '"]'); if (b) b.innerHTML = '<img alt="Imagen elegida" src="' + src + '">' }
    Object.keys(state.img).forEach(function (k) { setImg(k, state.img[k]) });
    var file = document.getElementById('file'), target = null;
    document.querySelectorAll('.slot[data-slot]').forEach(function (b) {
        b.addEventListener('click', function () { target = b.getAttribute('data-slot'); file.value = ''; file.click() });
    });
    file.addEventListener('change', function () {
        var f = file.files[0]; if (!f || !target) return;
        var r = new FileReader(), slot = target;
        r.onload = function () {
            var im = new Image(); im.onload = function () {
                var s = Math.min(1, 480 / Math.max(im.width, im.height)), c = document.createElement('canvas');
                c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
                var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
                var d = c.toDataURL('image/jpeg', .85); state.img[slot] = d; save(); setImg(slot, d);
            }; im.src = r.result
        };
        r.readAsDataURL(f);
    });

    // ---- decoración: estrellas, pétalos, corazones, flores, chispas
    var cols = ['#e8456b', '#ff7a9c', '#ff9ebb', '#ff5c8a', '#ffb3c7'];
    var st = document.getElementById('stars');
    for (var i = 0; i < 60; i++) { var b = document.createElement('b'); b.style.left = Math.random() * 100 + '%'; b.style.top = Math.random() * 100 + '%'; b.style.animationDelay = (-Math.random() * 3) + 's'; st.appendChild(b) }
    var hearts = document.getElementById('hearts'), fx = document.getElementById('fx'), petals = document.getElementById('petals');
    function heart() {
        var s = document.createElement('span'); s.className = 'h'; s.textContent = '♥';
        s.style.left = Math.random() * 100 + '%'; s.style.fontSize = (14 + Math.random() * 26) + 'px';
        s.style.color = cols[Math.floor(Math.random() * cols.length)]; s.style.animationDuration = (5 + Math.random() * 5) + 's';
        hearts.appendChild(s); setTimeout(function () { s.remove() }, 10500);
    }
    function petal() {
        var p = document.createElement('span'), pc = ['#ff9ebb', '#ffb3c7', '#ff7a9c', '#ffd0dc'];
        p.className = 'petal'; p.style.left = Math.random() * 100 + '%'; p.style.background = pc[Math.floor(Math.random() * 4)];
        p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px'); p.style.animationDuration = (8 + Math.random() * 7) + 's';
        petals.appendChild(p); setTimeout(function () { p.remove() }, 15500);
    }
    setInterval(function () { if (!document.hidden) { heart(); if (Math.random() < .8) petal() } }, 800);
    function burst(n) { for (var i = 0; i < n; i++)setTimeout(heart, i * 60) }
    function fireworks() {
        for (var w = 0; w < 3; w++)setTimeout(function () {
            var ox = (Math.random() * 40 + 30) + '%', oy = (Math.random() * 30 + 25) + '%';
            for (var i = 0; i < 34; i++) {
                var s = document.createElement('span'), a = Math.random() * 6.283, d = 80 + Math.random() * 190;
                s.textContent = Math.random() < .8 ? '♥' : '✦'; s.style.cssText = 'position:absolute;left:' + ox + ';top:' + oy + ';color:' + cols[i % 5] + ';font-size:' + (14 + Math.random() * 20) + 'px';
                fx.appendChild(s);
                var an = s.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + Math.cos(a) * d + 'px),calc(-50% + ' + (Math.sin(a) * d + 60) + 'px)) scale(1.1)', opacity: 0 }], { duration: 1400 + Math.random() * 900, easing: 'cubic-bezier(.1,.8,.3,1)' });
                an.onfinish = (function (n) { return function () { n.remove() } })(s);
            }
        }, w * 700);
    }
    var last = 0;
    document.addEventListener('pointermove', function (e) {
        if (reduce || e.pointerType === 'touch' || Date.now() - last < 70) return; last = Date.now();
        var s = document.createElement('span'); s.className = 'sp'; s.textContent = '✦';
        s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; s.style.color = cols[Math.floor(Math.random() * 5)];
        document.body.appendChild(s); setTimeout(function () { s.remove() }, 800);
    });
    document.addEventListener('pointerdown', function (e) {
        if (e.target.closest('[contenteditable],button')) return;
        var s = document.createElement('span'); s.className = 'h'; s.textContent = '♥';
        s.style.cssText = 'left:' + e.clientX + 'px;top:' + e.clientY + 'px;bottom:auto;font-size:24px;color:' + cols[Math.floor(Math.random() * 5)] + ';animation-duration:3s';
        hearts.appendChild(s); setTimeout(function () { s.remove() }, 3200);
    });
    var pet = ['#f58eae', '#f6c6d0', '#d9a6c7', '#f4a78d', '#f7d58a',
        '#e9a8bb', '#c9b0df', '#f5b8a7', '#f3c6a1', '#e99ab4'], g = document.getElementById('garden');
    for (i = 0; i < 10; i++) {
        var d = document.createElement('div');
        d.className = 'fl';
        d.style.setProperty('--p', pet[i]);
        d.style.setProperty('--delay', (-Math.random() * 4) + 's');
        d.style.setProperty('--sway', (3.5 + Math.random() * 1.8) + 's');
        d.innerHTML = '<svg viewBox="0 0 100 180" width="100%" style="overflow:visible"><use href="#flower"/></svg>';
        g.appendChild(d);
    }

    // ---- sobre y respuesta
    document.getElementById('envBtn').addEventListener('click', function () {
        app.classList.add('opened'); burst(16);
        setTimeout(function () { document.querySelector('.letter').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }) }, 500);
    });
    var no = document.getElementById('no'), yes = document.getElementById('yes'), tries = 0;
    function dodge(e) {
        e.preventDefault(); tries++;
        var x = (Math.random() - .5) * Math.min(260, window.innerWidth - 150), y = (Math.random() - .5) * 90;
        no.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + Math.max(.6, 1 - tries * .06) + ')';
        yes.style.transform = 'scale(' + Math.min(1.5, 1 + tries * .07) + ')';
    }
    no.addEventListener('pointerenter', dodge); no.addEventListener('click', dodge);

    // ---- música: caja de música sintetizada (Canon en re, de dominio público)
    var AC = window.AudioContext || window.webkitAudioContext, ac, master, timer, synthOn = false, nextT = 0, ci = 0;
    // CONFIGURACIÓN DE MÚSICA: cambia estos valores para usar tu propio archivo.
    // Guarda el audio dentro de la carpeta 'audio' del proyecto.
    var DEFAULT_SONG = 'audio/mi-cancion.mp3';
    var DEFAULT_SONG_NAME = 'Nuestra canción';
    var custom = null, audioEl = null, playing = false, positiveMusicTimer = null;
    var CH = [[50, 57, 62, 66], [45, 52, 57, 61], [47, 54, 59, 62], [42, 49, 54, 57], [43, 50, 55, 59], [50, 57, 62, 66], [43, 50, 55, 59], [45, 52, 57, 61]];
    var ME = [[78, 76], [74, 73], [71, 69], [71, 73], [71, 69], [67, 66], [67, 71], [69, 73]];
    var BEAT = 60 / 66, ARP = [0, 1, 2, 3, 2, 1, 2, 3];
    function f(m) { return 440 * Math.pow(2, (m - 69) / 12) }
    function tone(t, m, dur, vol) {
        var o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), g2 = ac.createGain();
        o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = f(m); o2.frequency.value = f(m + 12); g2.gain.value = .22;
        o2.connect(g2); g2.connect(g); o.connect(g);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
        g.connect(master); o.start(t); o2.start(t); o.stop(t + dur + .05); o2.stop(t + dur + .05);
    }
    function bar(t, i) {
        var c = CH[i], m = ME[i];
        tone(t, c[0] - 12, BEAT * 3.5, .14);
        for (var k = 0; k < 8; k++)tone(t + k * BEAT / 2, c[ARP[k]] + 12, BEAT * 1.3, .07);
        tone(t, m[0], BEAT * 2, .12); tone(t + 2 * BEAT, m[1], BEAT * 2, .12);
    }
    function tick() {
        while (nextT < ac.currentTime + 1.5) { bar(nextT, ci); ci = (ci + 1) % CH.length; nextT += 4 * BEAT }
    }
    function startSynth() {
        if (!AC) return;
        if (!ac) {
            ac = new AC(); master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
            var dl = ac.createDelay(1), fb = ac.createGain(), wet = ac.createGain(); dl.delayTime.value = .34; fb.gain.value = .38; wet.gain.value = .35;
            master.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(ac.destination);
        }
        if (ac.state === 'suspended') ac.resume();
        if (!synthOn) { synthOn = true; nextT = ac.currentTime + .1; ci = 0; tick(); timer = setInterval(tick, 300) }
        master.gain.cancelScheduledValues(ac.currentTime); master.gain.linearRampToValueAtTime(.9, ac.currentTime + 2);
    }
    function stopSynth() { if (ac && master) { master.gain.cancelScheduledValues(ac.currentTime); master.gain.linearRampToValueAtTime(0, ac.currentTime + .4) } clearInterval(timer); synthOn = false; if (ac) ac.suspend() }
    function ui() {
        document.getElementById('music').textContent = playing ? '🔊' : '🔇';
        document.getElementById('now').classList.toggle('paused', !playing);
    }
    function play() {
        var songUrl = custom ? custom.url : DEFAULT_SONG;
        if (songUrl) {
            if (!audioEl) {
                audioEl = new Audio(songUrl);
                audioEl.loop = true;
            }
            audioEl.play().catch(function (error) {
                console.log('No se pudo reproducir el audio. Revisa la ruta del archivo:', error);
            });
        } else {
            startSynth();
        }
        playing = true;
        ui();
    }
    function pause() {
        if (positiveMusicTimer) { clearTimeout(positiveMusicTimer); positiveMusicTimer = null; }
        if (audioEl) { audioEl.pause(); audioEl.currentTime = 0; }
        stopSynth(); playing = false; ui();
    }
    document.getElementById('music').addEventListener('click', function () { playing ? pause() : play() });
    document.getElementById('yes').addEventListener('click', function () {
        body.classList.add('won');
        play();
        fireworks();
        burst(30);
        if (positiveMusicTimer) clearTimeout(positiveMusicTimer);
        positiveMusicTimer = setTimeout(function () {
            if (playing) pause();
        }, 57200);
        setTimeout(function () { document.getElementById('close').focus() }, 300);
    });
    document.getElementById('close').addEventListener('click', function () { body.classList.remove('won') });

    // ---- canción propia (se guarda en el navegador)
    function idb(mode, fn) {
        return new Promise(function (res, rej) {
            try {
                var q = indexedDB.open('carta-db', 1);
                q.onupgradeneeded = function () { q.result.createObjectStore('k') };
                q.onsuccess = function () { var tx = q.result.transaction('k', mode), r = fn(tx.objectStore('k')); tx.oncomplete = function () { res(r && r.result) }; tx.onerror = function () { rej(tx.error) } };
                q.onerror = function () { rej(q.error) };
            } catch (e) { rej(e) }
        })
    }
    function useSong(blob, name) {
        if (custom && custom.isBlob) URL.revokeObjectURL(custom.url);
        custom = { url: URL.createObjectURL(blob), name: name, isBlob: true };
        audioEl = null;
        document.getElementById('songname').textContent = name;
    }
    document.getElementById('songname').textContent = DEFAULT_SONG_NAME;
    idb('readonly', function (s) { return s.get('song') }).then(function (v) {
        if (v && v.blob) useSong(v.blob, v.name);
    }).catch(function () { });
    var sf = document.getElementById('songfile');
    document.getElementById('song').addEventListener('click', function () { sf.value = ''; sf.click() });
    sf.addEventListener('change', function () {
        var f = sf.files[0]; if (!f) return;
        var was = playing; if (was) pause();
        useSong(f, f.name.replace(/\.[^.]+$/, ''));
        idb('readwrite', function (s) { return s.put({ blob: f, name: custom.name }, 'song') }).catch(function () { });
        if (was) play();
    });

    // ---- tema y restablecer
    var t = document.getElementById('theme');
    t.addEventListener('click', function () {
        var r = document.documentElement, dark = getComputedStyle(r).getPropertyValue('--ink').trim() === '#ffe3ec';
        r.setAttribute('data-theme', dark ? 'light' : 'dark'); t.textContent = dark ? '🌙' : '☀️';
    });
    var rs = document.getElementById('reset'), armed = false;
    rs.addEventListener('click', function () {
        if (!armed) { armed = true; rs.textContent = '¿Seguro?'; setTimeout(function () { armed = false; rs.textContent = '↺' }, 3000); return }
        try { localStorage.removeItem(KEY) } catch (e) { }
        idb('readwrite', function (s) { return s.delete('song') }).catch(function () { }).then(function () { location.reload() });
    });
})();