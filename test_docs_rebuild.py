from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).parent
HTML=(ROOT/"docs/index.html").read_text()
def test_docs_contract():
    HTMLParser().feed(HTML)
    required=("Overview","Positions","Governance","Safeguards","Protection","Kelvara ExitRail","Evidence & monitoring health","Supported integrations","Account, wallet & network","Security model","Limitations","Developer overview","ExitRail API","Data contracts","Local executor","Devnet test environment","Capability status","Self-custodial","Position-specific","Evidence-backed","Kamino Institutional Commodity Yield","Steakhouse USDG High Yield","Squads V4","Current versus last verified")
    for text in required: assert text in HTML,text
    for stale in ("Armed fast close","Current production coverage is one exact Kamino Earn vault","Mainnet is live.</strong>"): assert stale not in HTML,stale
    for anchor in ("overview","positions","governance","safeguards","protection","evidence","integrations","account","security","limitations","developer","exit-rail-api","data-contracts","webhooks","errors","devnet","identifiers","status-legend"):
        assert HTML.count(f'id="{anchor}"')==1,anchor
        assert f'href="#{anchor}"' in HTML,anchor
    assert "@media(prefers-color-scheme:dark)" in HTML
    assert "@media(max-width:760px)" in HTML
    assert "aria-expanded" in HTML
    for asset in ("assets/kelvara-icon.png","og-image.svg"): assert (ROOT/asset).is_file(),asset
