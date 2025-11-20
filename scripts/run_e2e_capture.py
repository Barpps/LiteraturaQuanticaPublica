import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright


async def main():
    out = Path("ringlight_e2e_report_latest.json")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--autoplay-policy=no-user-gesture-required"]
        )
        page = await browser.new_page(viewport={"width": 1400, "height": 900})
        await page.goto("http://127.0.0.1:5000/debug?autorun=1&autoexport=1", wait_until="networkidle")
        # aguarda a variável ser populada
        await page.wait_for_function("() => window.__E2E_REPORT__ && window.__E2E_REPORT__.results && window.__E2E_REPORT__.results.length > 0", timeout=60000)
        rep = await page.evaluate("() => window.__E2E_REPORT__")
        out.write_text(json.dumps(rep, indent=2), encoding="utf-8")
        await browser.close()
    print(f"[OK] E2E capturado em {out}")


if __name__ == "__main__":
    asyncio.run(main())
