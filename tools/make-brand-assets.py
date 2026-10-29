"""Dev-only: derive optimized brand assets from the official Agentix logo.

Usage: python tools/make-brand-assets.py [path/to/trs_logo.png]
Writes assets/brand/agentix-{logo,mark,wordmark,wordmark-light}[@2x].png and favicon.png.
"""
import os
import sys

from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else r"D:/monum/Downloads/new_agentix_site-v2/new_agentix_site-v2/assets/trs_logo.png"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "brand")
PAPER = (246, 244, 239)


def solid_bbox(im, thr=40):
    """Bounding box of pixels whose alpha exceeds thr (ignores faint halo noise)."""
    a = im.getchannel("A").point(lambda v: 255 if v > thr else 0)
    return a.getbbox()


def rows_with_ink(im, thr=40):
    a = im.getchannel("A")
    w, h = im.size
    px = a.load()
    segs, start = [], None
    for y in range(h):
        hit = any(px[x, y] > thr for x in range(0, w, 2))
        if hit and start is None:
            start = y
        if not hit and start is not None:
            segs.append((start, y))
            start = None
    if start is not None:
        segs.append((start, h))
    return segs


def fit(im, max_w=None, h=None):
    w0, h0 = im.size
    if h is not None:
        nw = round(w0 * h / h0)
        return im.resize((nw, h), Image.LANCZOS)
    if max_w is not None and w0 > max_w:
        return im.resize((max_w, round(h0 * max_w / w0)), Image.LANCZOS)
    return im


def square(im, size, pad=0.04):
    w0, h0 = im.size
    inner = round(size * (1 - 2 * pad))
    k = inner / max(w0, h0)
    r = im.resize((max(1, round(w0 * k)), max(1, round(h0 * k))), Image.LANCZOS)
    c = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    c.paste(r, ((size - r.size[0]) // 2, (size - r.size[1]) // 2), r)
    return c


def save(im, name, colors=None):
    path = os.path.join(OUT, name)
    if colors:
        q = im.quantize(colors=colors, method=Image.FASTOCTREE, dither=Image.NONE)
        q.save(path, optimize=True)
    else:
        im.save(path, optimize=True)
    print(f"{name:32s} {im.size[0]}x{im.size[1]}  {os.path.getsize(path)/1024:.1f} KB")


def lighten_navy(im):
    """Recolour the navy letters to paper, keep the orange A and i."""
    px = im.copy()
    data = []
    for r, g, b, a in px.getdata():
        if a and b >= r and r < 120:  # navy-ish (blue >= red), not orange
            data.append(PAPER + (a,))
        else:
            data.append((r, g, b, a))
    px.putdata(data)
    return px


def main():
    im = Image.open(SRC).convert("RGBA")
    im = im.crop(solid_bbox(im))
    segs = rows_with_ink(im)
    # first band = brain mark, last band = wordmark
    mark_band, word_band = segs[0], segs[-1]
    mark = im.crop((0, mark_band[0], im.size[0], mark_band[1]))
    mark = mark.crop(solid_bbox(mark))
    word = im.crop((0, word_band[0], im.size[0], word_band[1]))
    word = word.crop(solid_bbox(word))

    save(fit(im, max_w=480), "agentix-logo.png", colors=96)
    save(fit(im, max_w=960), "agentix-logo@2x.png", colors=128)
    save(square(mark, 128), "agentix-mark.png", colors=96)
    save(square(mark, 256), "agentix-mark@2x.png", colors=128)
    save(fit(word, h=64), "agentix-wordmark.png", colors=96)
    save(fit(word, h=128), "agentix-wordmark@2x.png", colors=128)
    light = lighten_navy(word)
    save(fit(light, h=64), "agentix-wordmark-light.png", colors=96)
    save(fit(light, h=128), "agentix-wordmark-light@2x.png", colors=128)
    save(square(mark, 64, pad=0.02), "favicon.png")


if __name__ == "__main__":
    main()
