"""Convert .tmp-shots/<slug>/<name>.png (and legacy assets/shots PNGs) to JPEG q80 at 1600w and @800 thumbs."""
import os, sys, glob
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def conv(src, dstdir, name):
    im = Image.open(src).convert("RGB")
    os.makedirs(dstdir, exist_ok=True)
    for w, suf in ((1600, ""), (800, "@800")):
        if im.width > w:
            r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        else:
            r = im
        r.save(os.path.join(dstdir, name + suf + ".jpg"), "JPEG", quality=80, optimize=True, progressive=True)
tmp = os.path.join(root, ".tmp-shots")
for p in sorted(glob.glob(os.path.join(tmp, "*", "*.png"))):
    slug = os.path.basename(os.path.dirname(p)); name = os.path.splitext(os.path.basename(p))[0]
    conv(p, os.path.join(root, "assets", "shots", slug), name)
