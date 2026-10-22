from PIL import Image
from collections import Counter

im = Image.open(r"D:\Others\raah-explorer-v2\raahExplorer-V2\public\favicon-512.png")
c = Counter()
for p in im.getdata():
    r, g, b = p[:3]
    if r > 240 and g > 240 and b > 240:
        c["white"] += 1
    elif r < 30 and g < 30 and b < 30:
        c["black"] += 1
    elif 50 < g < 130 and r < 100:
        c["green"] += 1
    else:
        c["other"] += 1
print(dict(c))
w, h = im.size
for y in range(180, 360, 40):
    print(y, [im.getpixel((x, y))[:3] for x in range(200, 320, 25)])
