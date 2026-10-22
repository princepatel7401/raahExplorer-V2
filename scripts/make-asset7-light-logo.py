"""Prepare Asset 7.png for light theme header/footer (downscale only)."""
from PIL import Image
import os

Image.MAX_IMAGE_PIXELS = None

base = r"D:\Others\raah-explorer-v2\raahExplorer-V2\public"
src_path = os.path.join(base, "Asset 7.png")
out_path = os.path.join(base, "logo-on-light.png")

im = Image.open(src_path).convert("RGBA")
im.thumbnail((1200, 640), Image.Resampling.LANCZOS)

bbox = im.getbbox()
if bbox:
    pad = 4
    w, h = im.size
    im = im.crop(
        (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad),
        )
    )

im.save(out_path, "PNG")
preview = Image.new("RGBA", im.size, (255, 255, 255, 255))
preview.alpha_composite(im)
preview.convert("RGB").save(os.path.join(base, "_preview-logo-on-white.jpg"), quality=92)
print("wrote", out_path, im.size)
