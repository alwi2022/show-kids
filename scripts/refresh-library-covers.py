"""Build self-contained SVG covers at existing seeded asset URLs."""
from base64 import b64encode
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public/assets/demo"

for key in ["reading", "playtime", "routine", "shapes", "counting", "patterns"]:
    encoded = b64encode((DEST / f"{key}-photo.jpg").read_bytes()).decode("ascii")
    (DEST / f"{key}.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600">'
        f'<image width="960" height="600" preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,{encoded}"/></svg>',
        encoding="utf-8",
    )
