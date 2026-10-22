from PIL import Image

im = Image.open(r"D:\Others\raah-explorer-v2\raahExplorer-V2\public\_preview-logo-on-white.jpg")
print("size", im.size)
w, h = im.size
for y in range(h // 4, 3 * h // 4, h // 8):
    row = []
    for x in range(w // 10, w // 2, max(1, w // 14)):
        row.append(im.getpixel((x, y)))
    print(y, row)

# count near-black vs green vs white
from collections import Counter
c = Counter()
for p in im.getdata():
    r, g, b = p[:3]
    if r > 240 and g > 240 and b > 240:
        c["white"] += 1
    elif r < 50 and g < 50 and b < 50:
        c["black"] += 1
    elif g > r and g > 50:
        c["green"] += 1
    else:
        c["other"] += 1
print(dict(c))
