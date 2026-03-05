# Fix remaining mojibake: en-dash and arrow
path = 'index.html'
with open(path, 'r', encoding='utf-8') as f:
    s = f.read()
# Mojibake: UTF-8 bytes for – (U+2013) decoded as Latin-1 give â€"
bad_dash = '\u00e2\u20ac\u201c'  # â € "
if bad_dash in s:
    s = s.replace(bad_dash, '\u2013')
else:
    bad_dash2 = '\u00e2\u20ac\u2013'  # â € –
    if bad_dash2 in s:
        s = s.replace(bad_dash2, '\u2013')
# Arrow: → U+2192 = E2 86 92 -> â † '
bad_arrow = '\u00e2\u2020\u2019'  # â † '
if bad_arrow in s:
    s = s.replace(bad_arrow, '\u2192')
with open(path, 'w', encoding='utf-8', newline='') as f:
    f.write(s)
print('Done')
