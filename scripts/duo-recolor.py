#!/usr/bin/env python3
"""Recolor the whole prototype to the Duolingo brand palette.

Run from the repo root:  python scripts/duo-recolor.py
Idempotent: strips its previous output and regenerates it.

How: every CSS declaration that uses one of the app's old colors is copied,
recolored and prefixed with html.duo (the app always runs with that class), and
attribute/inline-style overrides recolor icons and illustrations drawn in SVG.
"""
import os, re

ROOT = os.path.join(os.path.dirname(__file__), '..')
P = os.path.join(ROOT, 'prototype', 'source', 'index.html')

# Duolingo brand palette
SNOW, POLAR, SWAN, HARE, WOLF, EEL = 'FFFFFF', 'F7F7F7', 'E5E5E5', 'AFAFAF', '777777', '4B4B4B'
FEATHER, MASK, TREE_FROG, SEA_SPONGE = '58CC02', '89E219', '58A700', 'D7FFB8'
MACAW, WHALE, HUMPBACK, BLUE_JAY, IGUANA = '1CB0F6', '1899D6', '2B70C9', '84D8FF', 'DDF4FF'
CARDINAL, FIRE_ANT, WALKING_FISH = 'FF4B4B', 'EA2B2B', 'FFDFE0'
BEE, BEE_DARK, CANARY = 'FFC800', 'E5B400', 'FFF5D3'
FOX, FOX_DARK, FOX_LIGHT, FOX_TINT = 'FF9600', 'CD7900', 'FFC380', 'FFEFD9'
BEETLE, BEETLE_DARK, BEETLE_LIGHT, BEETLE_TINT = 'CE82FF', 'A560E8', 'E5C2FF', 'F3E5FF'
DARK_SURFACE = '131F24'

M = {
    # oranges (Milo's accent) -> Fox
    'E88D4F': FOX, 'F0985A': FOX, 'E07B3A': FOX, 'E9A06C': FOX, 'F09A5A': FOX, 'EBA07E': FOX,
    'D9702F': FOX_DARK, 'C26E36': FOX_DARK, 'A8541E': FOX_DARK, 'C65A2E': FOX_DARK, 'C9744A': FOX_DARK, 'B85F2E': FOX_DARK, 'C9702F': FOX_DARK,
    'F4B27F': FOX_LIGHT, 'F6B98F': FOX_LIGHT,
    'FCE3D1': FOX_TINT, 'FDE7D6': FOX_TINT, 'FBE3CF': FOX_TINT, 'F6D9C3': FOX_TINT, 'FEF4E8': FOX_TINT, 'FFE9C7': FOX_TINT,
    # yellows -> Bee
    'F2CC6B': BEE, 'F2B23A': BEE, 'E9C46A': BEE, 'F5B335': BEE, 'F7D774': BEE, 'FFD24D': BEE, 'EFB06E': BEE, 'E3C27A': BEE, 'E9B53C': BEE, 'E39A3B': BEE_DARK,
    'E0A21F': BEE_DARK, '8A6A12': 'A57D00', '9A6C08': 'A57D00',
    'FFF3C4': CANARY, 'FFF0CC': CANARY, 'FBEDC2': CANARY, 'FCF1D0': CANARY,
    # greens -> Feather / Mask
    '7BC47F': FEATHER, '4FA884': FEATHER, '4CC59A': FEATHER, '2E7A5A': TREE_FROG, '23845C': TREE_FROG, '7FA89C': FEATHER, 'B9CFA0': MASK, '9FD0BD': MASK,
    'E2F0EA': SEA_SPONGE, 'DCEFE6': SEA_SPONGE, 'D8F1E3': SEA_SPONGE,
    # reds -> Cardinal
    'E9958A': CARDINAL, 'E5604D': CARDINAL, 'D61F0A': CARDINAL, 'E5484D': CARDINAL, 'E9726C': CARDINAL, 'FF7A6E': CARDINAL, 'F59E9A': CARDINAL,
    'B5473A': FIRE_ANT, 'B83238': FIRE_ANT, 'D93A44': FIRE_ANT,
    'FBE0DC': WALKING_FISH, 'FDE3E3': WALKING_FISH, 'FFDFE1': WALKING_FISH,
    # blues -> Macaw / Humpback
    '5C8FD6': MACAW, '6FA6DB': MACAW, '5C9FD8': MACAW, '4FA9EE': MACAW, '8DBCE0': BLUE_JAY, '9FB8D9': BLUE_JAY, 'A8D4F7': BLUE_JAY,
    '2F5E9E': HUMPBACK, '23407A': HUMPBACK,
    # purples -> Beetle
    '8F84D6': BEETLE, '8F7BE6': BEETLE, '9A86F0': BEETLE, 'A99DE6': BEETLE, '7D70CF': BEETLE_DARK, '5E5891': BEETLE_DARK, '5E4FD0': BEETLE_DARK,
    'BDB8DD': BEETLE_LIGHT, 'BDB4E6': BEETLE_LIGHT, 'C8BFF3': BEETLE_LIGHT, 'D9D3F7': BEETLE_LIGHT, 'B9AEF0': BEETLE_LIGHT,
    'ECEAF6': BEETLE_TINT, 'E6E0FF': BEETLE_TINT,
    # deep greens (old ink / dark surfaces) -> Eel / dark surface
    '16302B': EEL, '1E3A35': EEL, '24453F': EEL, '1E3D37': EEL, '22433C': EEL, '1E3F38': EEL, '0F2420': DARK_SURFACE, '0E211D': DARK_SURFACE, '09140F': DARK_SURFACE,
    '2E6B5E': WHALE, '2E4F48': SWAN,
    # neutrals
    '4A635D': WOLF, '6E7F79': WOLF, '7A8C88': WOLF, 'A9BDB7': HARE, 'C9D6D2': HARE, 'DDD6C8': SWAN,
    'E4DDCF': SWAN, 'EFE9DE': SWAN, 'E2D6C3': SWAN, 'F1E6D7': SWAN,
    'F4EEE4': POLAR, 'F7EFE2': POLAR, 'F6F1E7': POLAR, 'F3E9DB': POLAR,
    'F9F6F0': SNOW,
}

s = open(P, encoding='utf-8', newline='').read()
s = re.sub(r'/\* DUO-ASSETS-START \*/.*?/\* DUO-ASSETS-END \*/\r?\n?', '', s, flags=re.S)
style_start = s.index('<style>') + 7
style_end = s.index('</style>')
css = s[style_start:style_end]
# leave the generated Arcade block and the other dormant review looks alone
css = re.sub(r'/\* ARCADE-ASSETS-START \*/.*?/\* ARCADE-ASSETS-END \*/', '', css, flags=re.S)
hexre = re.compile(r'#([0-9A-Fa-f]{6})\b')
SKIP = ('.arcade', '.finch', '.calm', 'html:not(.light)', '.dark ', '.dark,', '.night')


def prefix(sel):
    parts = []
    for x in sel.split(','):
        x = x.strip()
        if not x:
            continue
        if any(k in x for k in SKIP):
            continue
        if x.startswith(':root'):
            x = 'html.duo' + x[5:]
        elif x.startswith('html.duo'):
            pass
        elif x.startswith('html'):
            x = 'html.duo' + x[4:]
        else:
            x = 'html.duo ' + x
        parts.append(x)
    return ','.join(parts) or None


out = []
i, n = 0, len(css)
while i < n:
    j = css.find('{', i)
    if j < 0:
        break
    sel = re.sub(r'/\*.*?\*/', '', css[i:j], flags=re.S).strip()
    if sel.startswith('@'):
        d, k = 0, j
        while k < n:
            if css[k] == '{':
                d += 1
            elif css[k] == '}':
                d -= 1
                if d == 0:
                    break
            k += 1
        i = k + 1
        continue
    k = css.find('}', j)
    decls = []
    for d in css[j + 1:k].split(';'):
        if ':' not in d:
            continue
        prop, val = d.split(':', 1)
        if prop.strip().startswith('--'):
            continue
        if any(h.upper() in M for h in hexre.findall(val)):
            nv = hexre.sub(lambda m: '#' + M.get(m.group(1).upper(), m.group(1)), val).replace('!important', '')
            decls.append(prop.strip() + ':' + nv.strip() + '!important')
    if decls:
        ps = prefix(sel)
        if ps:
            out.append(ps + '{' + ';'.join(decls) + '}')
    i = k + 1

for a, b in M.items():
    for at in ('fill', 'stroke', 'stop-color'):
        out.append('html.duo [%s="#%s" i]{%s:#%s!important}' % (at, a, at, b))
    out.append('html.duo [style*="background:#%s" i]{background:#%s!important}' % (a, b))
    out.append('html.duo [style*="background-color:#%s" i]{background-color:#%s!important}' % (a, b))
    out.append('html.duo [style*=";color:#%s" i],html.duo [style^="color:#%s" i]{color:#%s!important}' % (a, a, b))
    out.append('html.duo [style*="stroke:#%s" i]{stroke:#%s!important}' % (a, b))
    r, g, bb = int(a[0:2], 16), int(a[2:4], 16), int(a[4:6], 16)
    out.append('html.duo [style*="background: rgb(%d, %d, %d)"]{background:#%s!important}' % (r, g, bb, b))
    out.append('html.duo [style*="color: rgb(%d, %d, %d)"]{color:#%s!important}' % (r, g, bb, b))

block = '/* DUO-ASSETS-START */\n' + '\n'.join(out) + '\n/* DUO-ASSETS-END */\n'
# goes before the hand-written Duolingo block so explicit rules there still win
k = s.index('/* ===== Duolingo palette + Finch flat buttons ===== */')
s = s[:k] + block + s[k:]
open(P, 'w', encoding='utf-8', newline='').write(s)
print(len(out), 'rules')
