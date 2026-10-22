from PIL import Image
import os

Image.MAX_IMAGE_PIXELS = None
p = r"D:\Others\raah-explorer-v2\raahExplorer-V2\public\Asset 7.png"
im = Image.open(p).convert("RGBA")
im.thumbnail((1200, 640), Image.Resampling.LANCZOS)
w, h = im.size
px = im.load()

# Find non-transparent content bbox and sample bright / dark pixels on right half
xs, ys = [], []
whiteish = 0
bright_samples = []
dark_in_content = 0
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a < 10:
            continue
        xs.append(x)
        ys.append(y)
        if r > 180 and g > 180 and b > 180:
            whiteish += 1
            if len(bright_samples) < 5:
                bright_samples.append((x, y, r, g, b, a))
        if r < 40 and g < 40 and b < 40:
            dark_in_content += 1

print("thumb", w, h)
print("content_bbox", min(xs), min(ys), max(xs), max(ys))
print("whiteish", whiteish, "samples", bright_samples)
print("dark_in_content", dark_in_content)

# Save a quick white-bg preview of the SOURCE (no processing) for visual check
src = Image.open(p).convert("RGBA")
src.thumbnail((900, 480), Image.Resampling.LANCZOS)
prev = Image.new("RGBA", src.size, (255, 255, 255, 255))
prev.alpha_composite(src)
out = r"D:\Others\raah-explorer-v2\raahExplorer-V2\public\_preview-asset7-src.jpg"
prev.convert("RGB").save(out, quality=92)
print("preview", out)

# Also preview the chat-attached copy
att = r"C:\Users\princep_satvasolutio\.cursor\projects\d-Others-raah-explorer-v2-raahExplorer-V2\assets\d__Others_raah-explorer-v2_raahExplorer-V2_public_Asset_7.png"
if os.path.exists(att):
    a = Image.open(att).convert("RGBA")
    # knock near-black for preview only
    ap = a.load()
    aw, ah = a.size
    for y in range(ah):
        for x in range(aw):
            r, g, b, aa = ap[x, y]
            if r < 28 and g < 28 and b < 28:
                ap[x, y] = (0, 0, 0, 0)
            elif r > 200 and g > 200 and b > 200:
                ap[x, y] = (18, 22, 18, 255)
    prev2 = Image.new("RGBA", a.size, (255, 255, 255, 255))
    prev2.alpha_composite(a)
    out2 = r"D:\Others\raah-explorer-v2\raahExplorer-V2\public\_preview-asset7-attached.jpg"
    prev2.convert("RGB").save(out2, quality=92)
    print("attached preview", out2, a.size)
