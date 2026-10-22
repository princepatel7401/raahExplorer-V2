from PIL import Image, ImageDraw
import os

base = r"D:\Others\raah-explorer-v2\raahExplorer-V2\public"
src = Image.open(os.path.join(base, "FINAL LOGO PNG W.png")).convert("RGBA")
w, h = src.size
px = src.load()

THEME = (75, 106, 72, 255)  # #4B6A48 brand
WHITE = (255, 255, 255, 255)
DARK = (20, 28, 22, 255)

# Mask of light mark shapes
light = Image.new("L", (w, h), 0)
lp = light.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a > 20 and r > 180 and g > 180 and b > 180:
            lp[x, y] = 255

bbox = light.getbbox()
# expand slightly so the black R inside is included
if bbox:
    pad = 8
    bbox = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(w, bbox[2] + pad),
        min(h, bbox[3] + pad),
    )

out = Image.new("RGBA", (w, h), WHITE)
op = out.load()

for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        in_mark = bbox and bbox[0] <= x < bbox[2] and bbox[1] <= y < bbox[3]
        is_black = a < 8 or (r < 40 and g < 40 and b < 40)
        is_light = a > 20 and r > 180 and g > 180 and b > 180

        if is_light:
            op[x, y] = THEME
        elif is_black and in_mark:
            op[x, y] = DARK  # letter R
        else:
            op[x, y] = WHITE  # canvas

out.save(os.path.join(base, "icon.png"))
for size, name in [
    (32, "favicon.png"),
    (64, "favicon-64.png"),
    (192, "favicon-192.png"),
    (512, "favicon-512.png"),
    (180, "apple-touch-icon.png"),
]:
    out.resize((size, size), Image.Resampling.LANCZOS).save(os.path.join(base, name), "PNG")

out.resize((256, 256), Image.Resampling.LANCZOS).save(
    os.path.join(base, "_preview-favicon-theme.png")
)
print("done", "mark_bbox", bbox)
