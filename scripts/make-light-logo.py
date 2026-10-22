from PIL import Image
import os

base = r"D:\Others\raah-explorer-v2\raahExplorer-V2\public"
src = Image.open(os.path.join(base, "logo.png")).convert("RGBA")
src.thumbnail((1400, 740), Image.Resampling.LANCZOS)
w, h = src.size
pixels = src.load()


def is_bg(c):
    r, g, b, a = c
    return a < 8 or (r < 40 and g < 40 and b < 40)


# Flood-fill near-black from image edges only (keeps black letterforms inside the mark)
stack = []
visited = [[False] * w for _ in range(h)]
for x in range(w):
    stack.append((x, 0))
    stack.append((x, h - 1))
for y in range(h):
    stack.append((0, y))
    stack.append((w - 1, y))

while stack:
    x, y = stack.pop()
    if x < 0 or y < 0 or x >= w or y >= h or visited[y][x]:
        continue
    visited[y][x] = True
    if not is_bg(pixels[x, y]):
        continue
    pixels[x, y] = (0, 0, 0, 0)
    stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

out = os.path.join(base, "logo-on-light.png")
src.save(out, "PNG")
print("saved", out, src.size)

# Icon favicon: flood-fill black bg only
ic = Image.open(os.path.join(base, "favicon-512.png")).convert("RGBA")
# re-crop from processed logo left square for cleaner icon
side = min(src.height, int(src.width * 0.38))
icon = src.crop((0, 0, side, side))
icon.save(os.path.join(base, "icon.png"), "PNG")
icon.save(os.path.join(base, "favicon-512.png"), "PNG")
for size, name in [
    (32, "favicon.png"),
    (64, "favicon-64.png"),
    (192, "favicon-192.png"),
    (180, "apple-touch-icon.png"),
]:
    icon.resize((size, size), Image.Resampling.LANCZOS).save(os.path.join(base, name), "PNG")
print("favicon updated")
