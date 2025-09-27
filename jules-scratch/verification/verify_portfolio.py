from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # 1. Navigate to the React app.
            # The dev server usually runs on port 3000.
            page.goto("http://localhost:3000", timeout=60000)

            # 2. Wait for the 'About Me' title to be visible.
            # This confirms that the page has loaded and the API call (even with mock data) has completed.
            about_title = page.get_by_role("heading", name="About Me")
            expect(about_title).to_be_visible(timeout=30000)

            # 3. Wait for the skills to render to ensure all components are there
            expect(page.get_by_text("PHP")).to_be_visible()
            expect(page.get_by_text("React.js")).to_be_visible()

            # 4. Take a screenshot of the entire page.
            page.screenshot(path="jules-scratch/verification/verification.png", full_page=True)

            print("Screenshot taken successfully.")

        except Exception as e:
            print(f"An error occurred during verification: {e}")
            # In case of an error, take a screenshot anyway to help with debugging.
            page.screenshot(path="jules-scratch/verification/error.png")

        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()