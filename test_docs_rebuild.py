from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).parent
DOCS=ROOT/'docs'
SLUGS=['','how-it-works','supported-positions','positions','governance','safeguards','protection','exitrail','wallet-exposure','evidence','monitoring-health','self-custody','security','limitations','developers/exitrail-api','developers/webhooks','developers/local-execution','developers/contracts','developers/test-environment','reference/kamino','reference/squads-v4','reference/networks-addresses']
def page(slug): return (DOCS/slug/'index.html').read_text()
def test_docs_contract():
    for slug in SLUGS:
        html=page(slug);HTMLParser().feed(html)
        assert '/docs/docs.css' in html and '/docs/docs.js' in html
        assert 'Getting started' in html and 'Product' in html and 'Trust' in html and 'Developers' in html and 'Reference' in html
        assert 'Devnet proof</a>' not in html
        assert 'Last updated: 27 September 2026' not in html
    home=page('')
    for text in ('Protect the conditions behind your position.','Position-specific','Evidence-backed','Self-custodial','How Kelvara fits together','Position','Governance','Safeguards','Incident','Protection / ExitRail'):
        assert text in home,text
    assert len(home)<18000
    assert 'Next</small>How Kelvara works →' in home
    assert 'Append-only safeguard transitions, daily worst state, and 90-day history remain planned' in page('safeguards')
    assert 'Sign once. Keep your exact exit ready.' in page('exitrail')
    assert 'Automatic delegation verification' in page('wallet-exposure')
    assert 'Provisioning' not in page('supported-positions')
    assert 'ProgramData' not in home
    assert 'ProgramData' in page('reference/kamino')
    assert 'Devnet journey' not in home
    assert 'Devnet journey' in page('developers/test-environment')
    css=(DOCS/'docs.css').read_text();js=(DOCS/'docs.js').read_text()
    for marker in ('@media(max-width:760px)','@media(prefers-color-scheme:dark)','@media(prefers-reduced-motion:reduce)','.cards','.product-map','.callout','.badge','.toc'): assert marker in css
    for marker in ('navigator.clipboard','aria-expanded'): assert marker in js
    assert (ROOT/'assets/kelvara-icon.png').is_file()
