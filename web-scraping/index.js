import { Builder, Browser, By } from 'selenium-webdriver';
import fs from 'node:fs'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const main = async () => {

    const data = []

    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get('https://www.youtube.com/results?search_query=tauz');
    let videosContainer = await driver.findElements(By.css('ytd-item-section-renderer'));

    let indexAtual = 0

    for (let i = 0; i < 100; i++) {
        const videosRenderedContainer = await videosContainer[indexAtual].findElements(By.css('ytd-video-renderer'))
        for (let j = 0; j < videosRenderedContainer.length; j++) {
            const itemAtual = videosRenderedContainer[j]
            const titulo = await itemAtual.findElement(By.id('video-title')).getText()
            const thumbnailEl = await itemAtual.findElement(By.id('thumbnail'))
            const linkCompleto = await thumbnailEl.getAttribute('href')
            const id = /v=([^&]*)/.exec(linkCompleto)[1]
            const link = `https://www.youtube.com/watch?v=${id}`
            const capa = `https://i.ytimg.com/vi/${id}/hq720.jpg`


            console.log({
                id, titulo, link, capa
            })

            data.push({
                id, titulo, link, capa
            })
        }
        console.log(indexAtual)
        await driver.actions()
            .scroll(10, 10, 0, 10000)
            .perform()


        fs.writeFile('./web-scraping/data.json', JSON.stringify(data), err => {
            if (err) {
                console.error(err);
            } else {
                console.log('arquivo atualizado')
            }
        });

        await sleep(10000)

        videosContainer = await driver.findElements(By.css('ytd-item-section-renderer'));
        indexAtual++

    }

}


main()