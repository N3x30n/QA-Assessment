const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

let id;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit()
})

async function botsDisplayed() {
  for (let i = 0; i < 5; i++) {
    const botId = Math.floor(Math.random() * 10)
    const botSelector = `button[onclick="chooseBot(${botId})"]`

    try {
      const button = await driver.findElement(By.css(botSelector))
      await driver.wait(until.elementIsVisible(button), 10000)
      await button.click();
      return { success: true, botId }
    } catch (error) {
      console.log(`Attempt ${i + 1} failed: ${error.message}`)
    }
  }
  return { success: false, botId: -1 }
}

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
    await driver.sleep(500)
    
  });
  test('draw button displays the div with the id="choices"', async () => {
    await driver.get("http://localhost:8000");
    await driver.findElement(By.css('button[id="draw"]')).click()
    await driver.findElement(By.css('section'))

    const divChoices = driver.findElement(By.css('div[id="choices"]')).getAttribute('id')
    expect( await divChoices).toBe('choices')
  })
  test('add to duo button displays the div with id="player-duo"', async() => {
    await driver.get("http://localhost:8000")
    await driver.findElement(By.css('button[id="draw"]')).click()
    await driver.sleep(2000)
    const addBots = await botsDisplayed()
    const playerId = await driver.findElement(By.css('div[id="player-duo"]')).getAttribute('id')
    expect(addBots.success).toBe(true)
    expect( await playerId).toBe('player-duo')
  })
  test('clicking remove from duo puts bot back to choices', async () => {
    await driver.get("http://localhost:8000")
    await driver.findElement(By.css('button[id="draw"]')).click()
    const selectBotResult = await botsDisplayed()
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`button[onclick="putBotBack(${selectBotResult.botId})`)), 10000))
    const putBack = await driver.findElement(By.css(`button[onclick="putBotBack(${selectBotResult.botId})`)).getAttribute('onclick')
    await driver.findElement(By.css(`button[onclick="putBotBack(${selectBotResult.botId})`)).click()
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`button[onclick="chooseBot(${selectBotResult.botId})`)), 10000))
    const select = await driver.findElement(By.css(`button[onclick="chooseBot(${selectBotResult.botId})`)).getAttribute('onclick')
    expect(selectBotResult.success).toBe(true)
    expect(select).not.toEqual(putBack)
  })
});