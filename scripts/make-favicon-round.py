from PIL import Image, ImageDraw
import os

base = r"D:\Others\raah-explorer-v2\raahExplorer-V2\public"
GREEN = (75, 106, 72, 255)
SIZE = 1024

icon = Image.open(os.path.join(base, "FINAL LOGO PNG W.png")).convert("RGBA")
# Fit icon inside the circle with padding
pad = int(SIZE * 0.12)
inner = SIZE - pad * 2
icon = icon.resize((inner, inner), Image.Resampling.LANCZOS)
ip = icon.load()
iw, ih = icon.size

# Build icon layer: green replaces black canvas; keep white mark + black R
layer = Image.new("RGBA", (iw, ih), (0, 0, 0, 0))
lp = layer.load()
xs, ys = [], []
for y in range(ih):
    for x in range(iw):
        r, g, b, a = ip[x, y]
        if a > 20 and r > 180 and g > 180 and b > 180:
            xs.append(x)
            ys.append(y)
x0, x1 = min(xs) - 4, max(xs) + 4
y0, y1 = min(ys) - 4, max(ys) + 4

for y in range(ih):
    for x in range(iw):
        r, g, b, a = ip[x, y]
        if a < 8:
            continue
        if r > 180 and g > 180 and b > 180:
            lp[x, y] = (255, 255, 255, 255)
        elif r < 40 and g < 40 and b < 40 and x0 <= x <= x1 and y0 <= y <= y1:
            lp[x, y] = (0, 0, 0, 255)

# Round green disc
out = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(out)
draw.ellipse((0, 0, SIZE - 1, SIZE - 1), fill=GREEN)
out.paste(layer, (pad, pad), layer)

# Circular mask (clean edges)
mask = Image.new("L", (SIZE, SIZE), 0)
ImageDraw.Draw(mask).ellipse((0, 0, SIZE - 1, SIZE - 1), fill=255)
out.putalpha(mask)

out.save(os.path.join(base, "icon.png"))
for size, name in [
    (32, "favicon.png"),
    (64, "favicon-64.png"),
    (192, "favicon-192.png"),
    (512, "favicon-512.png"),
    (180, "apple-touch-icon.png"),
]:
    out.resize((size, size), Image.Resampling.LANCZOS).save(os.path.join(base, name), "PNG")
print("round favicon ok")
