"""Green background + FINAL LOGO PNG W icon (white mark, black R)."""
from PIL import Image
import os

base = r"D:\Others\raah-explorer-v2\raahExplorer-V2\public"
GREEN = (75, 106, 72, 255)

icon = Image.open(os.path.join(base, "FINAL LOGO PNG W.png")).convert("RGBA")
w, h = icon.size
px = icon.load()

# bounds of the white mark
xs, ys = [], []
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a > 20 and r > 180 and g > 180 and b > 180:
            xs.append(x)
            ys.append(y)
pad = 6
x0, x1 = max(0, min(xs) - pad), min(w, max(xs) + pad)
y0, y1 = max(0, min(ys) - pad), min(h, max(ys) + pad)

out = Image.new("RGBA", (w, h), GREEN)
op = out.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a < 8:
            continue
        # white mark
        if r > 180 and g > 180 and b > 180:
            op[x, y] = (255, 255, 255, 255)
        # black R inside the mark box
        elif r < 40 and g < 40 and b < 40 and x0 <= x < x1 and y0 <= y < y1:
            op[x, y] = (0, 0, 0, 255)

out.save(os.path.join(base, "icon.png"))
for size, name in [
    (32, "favicon.png"),
    (64, "favicon-64.png"),
    (192, "favicon-192.png"),
    (512, "favicon-512.png"),
    (180, "apple-touch-icon.png"),
]:
    out.resize((size, size), Image.Resampling.LANCZOS).save(os.path.join(base, name), "PNG")
print("ok")
