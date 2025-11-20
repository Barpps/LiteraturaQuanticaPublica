import asyncio
from pathlib import Path
from playwright.async_api import async_playwright


PAGES = [
    ("home", "http://127.0.0.1:5000/home.html"),
    ("links", "http://127.0.0.1:5000/links"),
    ("catalogo", "http://127.0.0.1:5000/catalogo"),
    ("guia", "http://127.0.0.1:5000/guia"),
    ("frequencias", "http://127.0.0.1:5000/frequencias"),
    ("fragmentos", "http://127.0.0.1:5000/fragmentos"),
    ("app", "http://127.0.0.1:5000/app"),
    ("uat", "http://127.0.0.1:5000/UAT"),
    ("debug", "http://127.0.0.1:5000/debug"),
]


async def shoot():
    out_dir = Path("snapshots")
    out_dir.mkdir(exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1400, "height": 900})
        for name, url in PAGES:
            await page.goto(url, wait_until="networkidle")
            await page.screenshot(path=str(out_dir / f"{name}.png"), full_page=True)
        await browser.close()


if __name__ == "__main__":
    asyncio.run(shoot())
