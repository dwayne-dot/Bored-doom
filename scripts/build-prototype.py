#!/usr/bin/env python3
"""Bundle prototype/source (index.html + assets/) into one self-contained
src/prototype/prototype.html for the in-app WebView.

Run from the repo root:  python3 scripts/build-prototype.py
- inlines every image as a data URI (also images added at runtime)
- adds the native bridge: haptics -> expo-haptics, errors -> console, nav -> expo-router
- hides prototype-only UI (tour panel, phone frame) inside the app
"""
import base64, json, os, re

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'prototype', 'source')
OUT = os.path.join(ROOT, 'src', 'prototype', 'prototype.html')

s = open(os.path.join(SRC, 'index.html'), encoding='utf-8').read()
assets = {}
for dp, _, fs in os.walk(os.path.join(SRC, 'assets')):
    for f in fs:
        if not f.endswith(('.png', '.jpg', '.jpeg', '.svg')):
            continue
        full = os.path.join(dp, f)
        rel = os.path.relpath(full, SRC).replace(os.sep, '/')
        mime = 'image/png' if f.endswith('.png') else 'image/svg+xml' if f.endswith('.svg') else 'image/jpeg'
        assets[rel] = 'data:%s;base64,%s' % (mime, base64.b64encode(open(full, 'rb').read()).decode())

def swap(m):
    return m.group(1) + assets[m.group(2)] + m.group(3) if m.group(2) in assets else m.group(0)

s = re.sub(r'(url\(["\']?)(assets/[^)"\']+)(["\']?\))', swap, s)
s = re.sub(r'(["\'])(assets/[A-Za-z0-9_./-]+\.(?:png|jpg|jpeg|svg))(["\'])', swap, s)

bridge = '''<script>(function(){var RN=window.ReactNativeWebView;window.__A=%s;
function fix(el){if(!el||el.nodeType!==1)return;var a=el.getAttribute&&el.getAttribute('src');if(a&&a.indexOf('assets/')===0&&window.__A[a])el.setAttribute('src',window.__A[a]);var st=el.getAttribute&&el.getAttribute('style');if(st&&st.indexOf('assets/')>=0){el.setAttribute('style',st.replace(/assets\\/[A-Za-z0-9_.\\/-]+/g,function(x){return window.__A[x]||x}))}
 if(el.querySelectorAll){el.querySelectorAll('img[src^="assets/"],[style*="assets/"]').forEach(fix)}}
new MutationObserver(function(ms){ms.forEach(function(r){if(r.type==='attributes'){fix(r.target)}else r.addedNodes.forEach(fix)})}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','style']});
document.addEventListener('DOMContentLoaded',function(){fix(document.body)});
if(!RN)return;document.documentElement.classList.add('native');
navigator.vibrate=function(p){try{RN.postMessage(JSON.stringify({t:'haptic',p:p}))}catch(e){}return true};
window.addEventListener('error',function(e){try{RN.postMessage(JSON.stringify({t:'error',m:String(e.message)}))}catch(x){}});
})();</script>''' % json.dumps(assets)
s = s.replace('<head>', '<head>' + bridge, 1)
s = s.replace('</style>', 'html.native .side,html.native #proto-btn,html.native #proto-pane{display:none!important}'
              'html.native #stage{padding:0}html.native #phone{width:100vw;height:100vh;height:100dvh;border-radius:0;box-shadow:none}</style>', 1)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'w', encoding='utf-8').write(s)
print('wrote', OUT, '%.1f MB' % (len(s) / 1e6), '%d assets' % len(assets))
