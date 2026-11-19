import re
M={
'E88D4F':'6C47FF','F0985A':'7C5CFF','D9702F':'5835E5','C26E36':'5835E5','A8541E':'4B2BC9','C65A2E':'5835E5','F4B27F':'B5A1FF','E07B3A':'5835E5','F6B98F':'C9BEFF',
'FCE3D1':'EFEAFF','FDE7D6':'EFEAFF','FBE3CF':'EFEAFF','F6D9C3':'E3DBFF','FCF1D0':'FFF7DB',
'F2CC6B':'FFC82C','F2B23A':'FFC82C','E9C46A':'FFC82C','F5B335':'FFC82C','F7D774':'FFC82C','FFD24D':'FFC82C','E0A21F':'F0B400','8A6A12':'7A5A00','FFF3C4':'FFF7DB','FFF0CC':'FFF7DB','FBEDC2':'FFF7DB',
'9FD0BD':'4ADE80','7BC47F':'16A34A','4FA884':'16A34A','7FA89C':'16A34A','2E7A5A':'16A34A','4CC59A':'16A34A','E2F0EA':'DCFCE7','DCEFE6':'DCFCE7',
'E9958A':'E11D48','E5604D':'E11D48','B5473A':'BE123C','D61F0A':'E11D48','E5484D':'E11D48','E9726C':'E11D48','FF7A6E':'E11D48','F59E9A':'FB7185','EBA07E':'F472B6','EFB06E':'C084FC','E3C27A':'A78BFA','B9CFA0':'8B6BFF','E9A06C':'7C5CFF','F09A5A':'7C5CFF','FBE0DC':'FFE4E6',
'5C8FD6':'8B6BFF','2F5E9E':'5835E5','23407A':'4B2BC9','6FA6DB':'9B85FF','A8D4F7':'D3C7FF','8DBCE0':'B5A1FF','5C9FD8':'8B6BFF','4FA9EE':'8B6BFF',
'8F84D6':'8B6BFF','BDB8DD':'C9BEFF','5E5891':'4B2BC9','BDB4E6':'C9BEFF','C8BFF3':'C9BEFF','8F7BE6':'7C5CFF','9A86F0':'7C5CFF',
'16302B':'1E1B2E','2E6B5E':'3A3360','1E3A35':'2E2945','24453F':'2E2945','1E3D37':'1E1B2E','0F2420':'13111C','22433C':'2E2945','1E3F38':'251D47',
'4A635D':'5E5873','A9BDB7':'A8A2C2','C9D6D2':'D6D1EA','7A8C88':'8A84A3','6E7F79':'8A84A3',
'E4DDCF':'E6E2F5','EFE9DE':'F2EFFC','F4EEE4':'F2EFFC','F7EFE2':'F2EFFC','F6F1E7':'F2EFFC','F9F6F0':'F8F7FF',
}
p='/home/claude/proto/index.html';s=open(p).read()
# strip previous generated block
s=re.sub(r'/\* ARCADE-ASSETS-START \*/.*?/\* ARCADE-ASSETS-END \*/','',s,flags=re.S)
style_end=s.index('</style>')
css=s[s.index('<style>')+7:style_end]
hexre=re.compile(r'#([0-9A-Fa-f]{6})\b')
out=[]
# walk top-level rules, skipping @blocks
i=0;depth=0;n=len(css)
def prefix(sel):
    parts=[]
    for x in sel.split(','):
        x=x.strip()
        if not x: continue
        if x.startswith('html.arcade'): return None
        if x.startswith(':root'): x='html.arcade'+x[5:]
        elif x.startswith('html'): x='html.arcade'+x[4:]
        else: x='html.arcade '+x
        parts.append(x)
    return ','.join(parts)
while i<n:
    j=css.find('{',i)
    if j<0: break
    sel=css[i:j].strip()
    sel=re.sub(r'/\*.*?\*/','',sel,flags=re.S).strip()
    if sel.startswith('@'):
        # skip whole block
        d=0;k=j
        while k<n:
            if css[k]=='{':d+=1
            elif css[k]=='}':
                d-=1
                if d==0:break
            k+=1
        i=k+1;continue
    k=css.find('}',j)
    body=css[j+1:k]
    decls=[]
    for d in body.split(';'):
        if ':' not in d: continue
        prop,val=d.split(':',1)
        if prop.strip().startswith('--'): continue
        if hexre.search(val) and any(h.upper() in M for h in hexre.findall(val)):
            nv=hexre.sub(lambda m:'#'+M.get(m.group(1).upper(),m.group(1)),val).replace('!important','')
            decls.append(prop.strip()+':'+nv.strip()+'!important')
    if decls:
        ps=prefix(sel)
        if ps: out.append(ps+'{'+';'.join(decls)+'}')
    i=k+1
# attribute-level overrides for inline SVG/HTML
for a,b in M.items():
    for at in ['fill','stroke','stop-color']:
        prop=at
        out.append('html.arcade [%s="#%s" i]{%s:#%s!important}'%(at,a,prop,b))
    out.append('html.arcade [style*="background:#%s" i]{background:#%s!important}'%(a,b))
    out.append('html.arcade [style*="background-color:#%s" i]{background-color:#%s!important}'%(a,b))
    out.append('html.arcade [style*=";color:#%s" i],html.arcade [style^="color:#%s" i]{color:#%s!important}'%(a,a,b))
    out.append('html.arcade [style*="stroke:#%s" i]{stroke:#%s!important}'%(a,b))
    r,g,bb=int(a[0:2],16),int(a[2:4],16),int(a[4:6],16)
    out.append('html.arcade [style*="background: rgb(%d, %d, %d)"]{background:#%s!important}'%(r,g,bb,b))
    out.append('html.arcade [style*="color: rgb(%d, %d, %d)"]{color:#%s!important}'%(r,g,bb,b))
block='/* ARCADE-ASSETS-START */\n'+'\n'.join(out)+'\n/* ARCADE-ASSETS-END */\n'
# insert before arcade theme block so explicit arcade rules still win
k=s.index('/* ===== Arcade Pop (review) ===== */')
s=s[:k]+block+s[k:]
open(p,'w').write(s);print(len(out),'rules')
