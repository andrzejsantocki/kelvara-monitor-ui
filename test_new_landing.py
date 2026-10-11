from pathlib import Path
ROOT = Path(__file__).parent
HTML = (ROOT / "index.html").read_text()
def test_new_landing_contract():
    assert (ROOT / "CNAME").read_text().strip() == "kelvara.xyz"
    for text in ("Protect your DeFi positions", "Kelvara ExitRail", "Illustrative product scenario.", "not live customer data or a claim of a historical evacuation", "App access is currently limited during scheduled maintenance.", "prefers-reduced-motion:reduce"):
        assert text in HTML
    assert "Inspect your wallet" not in HTML
    assert 'src="https://kelvara.xyz/assets/' not in HTML
    assert HTML.count('href="https://app.kelvara.xyz/"') == 3
    assert 'href="/docs/"' in HTML
    for asset in ("assets/kelvara-icon.png", "assets/solana-logo.svg", "og-image.svg"):
        assert (ROOT / asset).is_file(), asset
