from PIL import Image
import os
from collections import Counter

base = r"D:\Others\raah-explorer-v2\raahExplorer-V2\public"
Image.MAX_IMAGE_PIXELS = None

for name in ["logo.png", "logo-on-light.png", "logo-light.png", "FINAL LOGO PNG W.png"]:
    p = os.path.join(base, name)
    if not os.path.exists(p):
        print(name, "MISSING")
        continue
    im = Image.open(p).convert("RGBA")
    im.thumbnail((800, 400), Image.Resampling.LANCZOS)
    px = list(im.getdata())
    opaque = [c for c in px if c[3] > 20]
    # bucket colors
    buckets = Counter()
    for r, g, b, a in opaque:
        buckets[((r // 32) * 32, (g // 32) * 32, (b // 32) * 32)] += 1
    top = buckets.most_common(8)
    bbox = im.getbbox()
    print(f"\n{name}: size={im.size} bbox={bbox} opaque={len(opaque)}")
    for c, n in top:
        print(f"  {c}: {n}")
    # save preview on white for light logo
    if name == "logo-on-light.png":
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        bg.alpha_composite(im)
        bg.convert("RGB").save(os.path.join(base, "_preview-logo-on-white.jpg"), quality=90)
        print("  wrote _preview-logo-on-white.jpg")
    if name == "logo-light.png":
        bg = Image.new("RGBA", im.size, (10, 16, 13, 255))
        bg.alpha_composite(im)
        bg.convert("RGB").save(os.path.join(base, "_preview-logo-on-dark.jpg"), quality=90)
        print("  wrote _preview-logo-on-dark.jpg")
