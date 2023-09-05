import unittest
import os
import platform
import logging
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

class TestGoogleSearch(unittest.TestCase):

    def setUp(self):
        logging.basicConfig(filename='./logs/google_test.log', level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
        logging.info("Setting up test...")

        system = platform.system()
        architecture = platform.architecture()[0]
        if platform.system() == 'Windows':
            chromedriver_path = os.path.join('.chromedriver', 'chromedriver.exe')
        elif platform.system() == 'Linux':
            chromedriver_path = os.path.join('.chromedriver', 'chromedriver-linux64')
        elif system == 'Darwin':
            if architecture == '64bit':
                chromedriver_path = os.path.join('.chromedriver', 'chromedriver-mac-x64')
            elif architecture == 'arm64':
                chromedriver_path = os.path.join('.chromedriver', 'chromedriver-mac-arm64')
        else:
            raise Exception("Unsupported operating system")

        os.environ['PATH'] = os.path.abspath(os.path.dirname(__file__)) + os.pathsep + os.environ['PATH']
        self.driver = webdriver.Chrome()
        logging.info("WebDriver initialized")

    def test_search_ducks(self):
        logging.info("Executing test_search_ducks...")

        driver = self.driver
        driver.get("https://www.google.com")
        logging.info("Navigated to Google")

        search_box = driver.find_element(By.NAME, "q")
        search_box.send_keys("Ducks")
        search_box.send_keys(Keys.RETURN)
        logging.info("Performed search for 'Ducks'")

        results_container = driver.find_element(By.ID, "rso")
        results = results_container.find_elements(By.XPATH, ".//*[contains(@class, 'g')]")

        self.assertGreater(len(results), 0)
        logging.info(f"Number of search results: {len(results)}")

        found_ducks = False
        for result in results:
            result_text = result.text.lower()
            if "ducks" in result_text:
                found_ducks = True
                break
        logging.info(f"Found 'Ducks' in search results: {found_ducks}")
        self.assertTrue(found_ducks, "No search result contains the word 'ducks'")

        current_url = driver.current_url
        self.assertIn("q=Ducks", current_url)
        logging.info("Verified URL contains 'q=ducks'")

    def test_pagination(self):
        logging.info("Executing test_pagination...")

        driver = self.driver
        driver.get("https://www.google.com")
        logging.info("Navigated to Google")

        search_box = driver.find_element(By.NAME, "q")
        search_box.send_keys("Ducks")
        search_box.send_keys(Keys.RETURN)
        logging.info("Performed search for 'Ducks'")

        pagination_links = driver.find_elements(By.XPATH, "//a[@aria-label='Page navigation']")
        if pagination_links:
            last_pagination_link = pagination_links[-1]
            last_pagination_link.click()
            logging.info("Clicked on the last pagination link")

            new_results = driver.find_elements(By.XPATH, ".//*[contains(@class, 'g')]")
            self.assertGreater(len(new_results), 0)
            logging.info("Verified pagination: More results loaded on the next page")
        else:
            logging.warning("No pagination links found")

    def tearDown(self):
        self.driver.quit()
        logging.info("WebDriver closed")

if __name__ == "__main__":
    unittest.main()
