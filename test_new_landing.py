from pathlib import Path
ROOT = Path(__file__).parent
HTML = (ROOT / "index.html").read_text()
CAL = "https://calendly.com/andrzej-santocki/30min"

def test_on_watch_landing_contract():
    assert (ROOT / "CNAME").read_text().strip() == "kelvara.xyz"
    for text in ("Kelvara is", "on watch.", "a new admin takes the keys", "Powered by", "prefers-reduced-motion:reduce", "color-scheme:dark", "timelock 0", "og-image.png"):
        assert text in HTML, text
    for removed in ("Devnet", "devnet", "Run the demo", 'href="#demo"', 'href="#contact"', "Proposal 41", "hello@kelvara", "fonts.googleapis", "og-image.svg", "feed offline"):
        assert removed not in HTML, removed
    assert HTML.count(f'href="{CAL}"') == 3
    assert HTML.count('href="https://app.kelvara.xyz/"') == 3
    assert 'href="/docs/"' in HTML and 'href="https://status.kelvara.xyz/"' in HTML
    assert 'src="/assets/solana-logo.svg"' in HTML
    for asset in ("assets/kelvara-icon.png", "assets/solana-logo.svg", "og-image.png", "assets/fonts/hanken-grotesk-latin-300-normal.woff2"):
        assert (ROOT / asset).is_file(), asset
