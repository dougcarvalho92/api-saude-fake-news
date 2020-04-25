const axios = require('axios');
const cheerio = require('cheerio');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // PERMITIR QUE ENVIA DADOS EM JSON PARA APLICAÇÃO


app.get('/fato-ou-fake', async (require, response) => {
    const fakes = [];
    // ============MINISTÉRIO DA SAÚDE============
    const url_ministerio_da_saude = "https://www.saude.gov.br/fakenews?limit=0";
    const path = "https://www.saude.gov.br";
    await axios.get(url_ministerio_da_saude).then((res) => {
        const $ = cheerio.load(res.data)
        $(".tileContent").each((index, element) => {
            let title = $(element).children('h2').first().text().trim();
            if (title.includes("VERDADE")) {
                var category = "É VERDADE";
            } else {
                var category = "É FAKE";
            }
            let link = path + $(element).children('h2').children('a').attr('href');
            let description = $(element).children('.description').text().trim();
            let image = path + $(element).find('img').attr('src');
            let tag = $(element).find('.tag-848').text().trim();
            let origin = "Ministério da Saúde";
            if (tag == "Novo Coronavírus Fake News") {
                fakes.push({ title, description, image, link, tag, category, origin });
            }

        });

    });
    response.json(fakes);
})

app.listen(process.env.PORT || 3000);

