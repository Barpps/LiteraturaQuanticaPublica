import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

BASE = "https://ringlighteffect.com.br"
PAGES = [
    ("home", f"{BASE}/home.html"),
    ("links", f"{BASE}/links"),
    ("catalogo", f"{BASE}/catalogo"),
    ("guia", f"{BASE}/guia"),
    ("frequencias", f"{BASE}/frequencias"),
    ("fragmentos", f"{BASE}/fragmentos"),
    ("app", f"{BASE}/app"),
    ("uat", f"{BASE}/UAT"),
    ("debug", f"{BASE}/debug"),
]


async def main():
    out_dir = Path("snapshots_prod")
    out_dir.mkdir(exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--autoplay-policy=no-user-gesture-required"])
        page = await browser.new_page(viewport={"width": 1400, "height": 900})
        for name, url in PAGES:
            try:
                await page.goto(url, wait_until="networkidle", timeout=30000)
                await page.wait_for_timeout(2000)
                await page.screenshot(path=str(out_dir / f"{name}.png"), full_page=True)
                print(f"[OK] {name} -> {url}")
            except Exception as e:
                print(f"[ERRO] {name} -> {url} :: {e}")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
