from PIL import Image, ImageFilter
import os

base = r"D:\Others\raah-explorer-v2\raahExplorer-V2\public"
Image.MAX_IMAGE_PIXELS = None

src = Image.open(os.path.join(base, "logo.png")).convert("RGBA")
src.thumbnail((1400, 740), Image.Resampling.LANCZOS)
w, h = src.size
px = src.load()

green = Image.new("L", (w, h), 0)
gp = green.load()
was_black = [[False] * w for _ in range(h)]
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a > 20 and g > 48 and g >= r - 8 and g >= b - 8 and (g - min(r, b)) > 8:
            gp[x, y] = 255
        if a < 8 or (r < 45 and g < 45 and b < 45):
            was_black[y][x] = True


def near_black(c):
    r, g, b, a = c
    return a < 8 or (r < 45 and g < 45 and b < 45)


# Clear exterior background
stack = []
seen = [[False] * w for _ in range(h)]
for x in range(w):
    stack += [(x, 0), (x, h - 1)]
for y in range(h):
    stack += [(0, y), (w - 1, y)]
while stack:
    x, y = stack.pop()
    if x < 0 or y < 0 or x >= w or y >= h or seen[y][x]:
        continue
    seen[y][x] = True
    if not near_black(px[x, y]):
        continue
    px[x, y] = (0, 0, 0, 0)
    stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

# Tight cover over icon only — just enough to reach the R cut-out
# Limit fill to the emblem only (not the wordmark R)
gb = green.getbbox() or (0, 0, w, h)
icon_right = min(int(w * 0.42), gb[0] + int((gb[2] - gb[0]) * 0.55))
cover = green.crop((0, 0, icon_right, h))
for _ in range(3):
    cover = cover.filter(ImageFilter.MaxFilter(9))
cp = cover.load()
DARK = (22, 32, 24, 255)
filled = 0
for y in range(h):
    for x in range(icon_right):
        r, g, b, a = px[x, y]
        if a == 0 and was_black[y][x] and cp[x, y] > 0:
            px[x, y] = DARK
            filled += 1

print(f"restored_cutout={filled}")

bbox = src.getbbox()
if bbox:
    pad = 12
    src = src.crop(
        (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad),
        )
    )

out = os.path.join(base, "logo-on-light.png")
src.save(out, "PNG")
prev = Image.new("RGBA", src.size, (255, 255, 255, 255))
prev.alpha_composite(src)
prev.convert("RGB").save(os.path.join(base, "_preview-logo-on-white.jpg"), quality=92)
print("saved", out, src.size)
