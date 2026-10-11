from pathlib import Path
ROOT = Path(__file__).parent
HTML = (ROOT / "index.html").read_text()
def test_new_landing_contract():
    assert (ROOT / "CNAME").read_text().strip() == "kelvara.xyz"
    for text in ("Protect your DeFi positions", "Kelvara ExitRail", "prefers-reduced-motion:reduce"):
        assert text in HTML
    for removed in ("scenario-note", "Illustrative product scenario.", "availability", "App access is currently limited during scheduled maintenance."):
        assert removed not in HTML
    assert "Inspect your wallet" not in HTML
    assert 'src="https://kelvara.xyz/assets/' not in HTML
    assert HTML.count('href="https://app.kelvara.xyz/"') == 3
    assert 'href="/docs/"' in HTML
    assert "--section-space:104px" in HTML
    assert "section{padding:var(--section-space) 0}" in HTML
    assert ".final{padding:var(--section-space) 0}" in HTML
    mobile = HTML.split("@media(max-width:720px)", 1)[1].split("@media(prefers-reduced-motion", 1)[0]
    assert ".strip{display:none}" in mobile
    assert ".final{padding:78px 0}" in mobile
    assert "#principles{padding-top" not in HTML
    for asset in ("assets/kelvara-icon.png", "assets/solana-logo.svg", "og-image.svg"):
        assert (ROOT / asset).is_file(), asset
