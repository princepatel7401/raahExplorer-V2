from PIL import Image
from collections import Counter
import os

Image.MAX_IMAGE_PIXELS = None
paths = [
    r"D:\Others\raah-explorer-v2\raahExplorer-V2\public\Asset 7.png",
    r"D:\Others\raah-explorer-v2\raahExplorer-V2\public\logo-on-light.png",
    r"C:\Users\princep_satvasolutio\.cursor\projects\d-Others-raah-explorer-v2-raahExplorer-V2\assets\d__Others_raah-explorer-v2_raahExplorer-V2_public_Asset_7.png",
]
for p in paths:
    if not os.path.exists(p):
        print("MISSING", p)
        continue
    im = Image.open(p).convert("RGBA")
    im.thumbnail((800, 400), Image.Resampling.LANCZOS)
    px = im.load()
    w, h = im.size
    c = Counter()
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            r, g, b, a = px[x, y]
            if a < 10:
                c["trans"] += 1
            elif r < 30 and g < 30 and b < 30:
                c["black"] += 1
            elif r > 200 and g > 200 and b > 200:
                c["white"] += 1
            elif g > r + 10 and g > b + 10 and g > 60:
                c["green"] += 1
            else:
                c["other"] += 1
    print(os.path.basename(p), "size_orig_thumb", Image.open(p).size, "->", (w, h), dict(c))
