"""Finish existing pixel art without regenerating its silhouette.

The user explicitly authorized Pillow finishing on 2026-11-26.
Run: python3 scripts/media/refine-pixel-assets.py prepare|finish|check
"""

import argparse
import hashlib
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, __version__ as pillow_version


BASELINE = "5bea9201da858c200b0a81b4c965e3eec49edd5a"
ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "assets/concepts/cozy/refinement-20261126"
TARGET = ROOT / "src/assets/cozy"
NAMES = ["tree-summer", "tree-spring", "tree-autumn", "tree-winter", "tree-christmas", "tistory-monument"]
OUTLINE = ["123b3e", "214d40", "2d5944", "396449"]
WOOD = ["62492f", "7b5734", "986a3c", "b57e47", "cf9657", "dfb06d", "f0c78a"]
GREEN = ["365e43", "426f49", "51824e", "659453", "7da75b", "98b968", "b3cb7b", "ccdb98"]
RED = ["b64235", "df513c", "fa6847", "ff9261"]
GOLD = ["ad7b35", "dba744", "f3c65e", "ffe099"]
CREAM = ["d5d8b8", "fff0c7"]
PALETTES = {
    "tree-summer": OUTLINE + WOOD + GREEN + RED + CREAM,
    "tree-spring": OUTLINE + WOOD + ["965e78", "b47791", "d18da5", "e9aabe", "f4c7cf", "ffddd9"] + CREAM,
    "tree-autumn": OUTLINE + WOOD + ["87482e", "aa512f", "ca6332", "e47c37", "f09a43", "f7bc61", "ffdc8c"] + RED + CREAM,
    "tree-winter": OUTLINE + WOOD + ["68867f", "90a99b", "b7c6b1", "d8dfc3", "efedd0", "fff0c7"],
    "tree-christmas": OUTLINE + WOOD + GREEN[:7] + RED + GOLD + CREAM,
    "tistory-monument": ["123b3e", "214d40", "34594b", "566e60", "6f8574", "899a82", "a4b095", "c5ceb0", "e1dfbf", "ff5a3e", "fff0c7", "ffe4a9", "cda36c"],
}


def pixels(image):
    return list(image.get_flattened_data() if hasattr(image, "get_flattened_data") else image.getdata())


def digest(data):
    return hashlib.sha256(data).hexdigest()


def visible_mask(image):
    return bytes(255 if rgba[3] >= 128 else 0 for rgba in pixels(image.convert("RGBA")))


def metrics(path):
    image = Image.open(path).convert("RGBA")
    data = pixels(image)
    return {
        "size": list(image.size),
        "visibleColors": len({rgba[:3] for rgba in data if rgba[3] >= 128}),
        "partialAlphaPixels": sum(0 < rgba[3] < 255 for rgba in data),
        "visiblePixels": sum(rgba[3] >= 128 for rgba in data),
        "maskSha256": digest(visible_mask(image)),
        "bytes": path.stat().st_size,
        "sha256": digest(path.read_bytes()),
    }


def prepare():
    SOURCE.mkdir(parents=True, exist_ok=True)
    for name in NAMES:
        destination = SOURCE / f"{name}.png"
        if not destination.exists():
            data = subprocess.run(
                ["git", "show", f"{BASELINE}:src/assets/cozy/{name}.png"],
                cwd=ROOT, check=True, capture_output=True,
            ).stdout
            destination.write_bytes(data)


def finish():
    prepare()
    output = {}
    for name in NAMES:
        original = Image.open(SOURCE / f"{name}.png").convert("RGBA")
        limit = 16 if name == "tistory-monument" else 32
        colors = [tuple(int(value[i:i + 2], 16) for i in (0, 2, 4)) for value in PALETTES[name]]
        palette = [channel for color in colors for channel in color]
        palette.extend(palette[:3] * (256 - len(colors)))
        # Keep small fruit, ribbons and highlights in the palette even though
        # they occupy fewer pixels than foliage. A population-only quantizer
        # loses these accents. Map to the nearest authored ramp without dither.
        cache = {}
        def nearest(rgb):
            if rgb not in cache:
                cache[rgb] = min(range(len(colors)), key=lambda index: sum((a - b) ** 2 for a, b in zip(rgb, colors[index])))
            return cache[rgb]
        indexed = Image.new("P", original.size)
        indexed.putpalette(palette)
        indexed.putdata([nearest(rgba[:3]) if rgba[3] >= 128 else 0 for rgba in pixels(original)])
        clean = indexed.filter(ImageFilter.ModeFilter(3)).convert("RGBA")
        mask = visible_mask(original)
        clean.putdata([(*rgba[:3], 255) if alpha else (0, 0, 0, 0) for rgba, alpha in zip(pixels(clean), mask)])
        clean.save(TARGET / f"{name}.png", optimize=True)
        output[f"src/assets/cozy/{name}.png"] = {
            "before": metrics(SOURCE / f"{name}.png"),
            "after": metrics(TARGET / f"{name}.png"),
            "paletteLimit": limit,
        }
    (SOURCE / "exports.json").write_text(json.dumps(output, indent=2) + "\n")
    (SOURCE / "provenance.json").write_text(json.dumps({
        "baselineCommit": BASELINE,
        "source": "Byte-identical 180px runtime snapshots from the baseline; original generated 1254px art remains in the parent directory.",
        "authorization": "User explicitly approved Python/Pillow pixel, palette and alpha finishing on 2026-11-26.",
        "method": "No spatial resampling. Visible mask threshold128 stays identical. Shared authored forest/wood/cream ramps and protected seasonal accents, at most32 colors per tree/16 for monument; nearest mapping with no dither; one native-grid3x3 mode cleanup; binary alpha and zeroed transparent RGB.",
        "palettes": PALETTES,
        "pillowVersion": pillow_version,
        "rejectedImageEdit": "exec-8231e207-2804-4f6d-857b-a922502073a4: remaining gradients; not used in the product.",
        "originalGenerationRecord": "../prompts.json",
    }, indent=2) + "\n")
    check()
    canvas = Image.new("RGBA", (2160, 800), "#123b3e")
    draw = ImageDraw.Draw(canvas)
    for index, name in enumerate(NAMES):
        draw.text((index * 360 + 16, 8), f"{name} / BEFORE", fill="#fff0c7")
        draw.text((index * 360 + 16, 408), "AFTER", fill="#fff0c7")
        for row, folder in enumerate([SOURCE, TARGET]):
            art = Image.open(folder / f"{name}.png").convert("RGBA").resize((360, 360), Image.Resampling.NEAREST)
            canvas.alpha_composite(art, (index * 360, row * 400 + 32))
    destination = ROOT / "docs/assets/refinement/art-seasons.png"
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(destination)


def check():
    checked = []
    for name in NAMES:
        before = metrics(SOURCE / f"{name}.png")
        after = metrics(TARGET / f"{name}.png")
        limit = 16 if name == "tistory-monument" else 32
        if after["size"] != [180, 180]:
            raise ValueError(f"{name}: expected180x180")
        if after["partialAlphaPixels"]:
            raise ValueError(f"{name}: {after['partialAlphaPixels']} partially transparent pixels remain")
        if after["visibleColors"] > limit:
            raise ValueError(f"{name}: palette exceeds{limit}")
        if after["maskSha256"] != before["maskSha256"]:
            raise ValueError(f"{name}: original visible silhouette changed")
        checked.append({"asset": name, "visibleColors": after["visibleColors"], "bytes": after["bytes"]})
    print(json.dumps({"checked": checked, "binaryAlpha": True, "unchangedSilhouettes": True}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("stage", choices=["prepare", "finish", "check"])
    stage = parser.parse_args().stage
    {"prepare": prepare, "finish": finish, "check": check}[stage]()
