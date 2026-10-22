from PIL import Image
import os

base = r"D:\Others\raah-explorer-v2\raahExplorer-V2\public"
src_path = os.path.join(base, "FINAL LOGO PNG W.png")
src = Image.open(src_path).convert("RGBA")
print("source", src.size)

# Keep original as icon master
src.save(os.path.join(base, "icon.png"))

for size, name in [
    (32, "favicon.png"),
    (64, "favicon-64.png"),
    (192, "favicon-192.png"),
    (512, "favicon-512.png"),
    (180, "apple-touch-icon.png"),
]:
    src.resize((size, size), Image.Resampling.LANCZOS).save(os.path.join(base, name), "PNG")
    print("wrote", name)
