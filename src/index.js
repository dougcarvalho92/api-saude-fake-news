const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.saude.gov.br/fakenews?limit=0";
const path = "https://www.saude.gov.br";
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // PERMITIR QUE ENVIA DADOS EM JSON PARA APLICAÇÃO

app.get('/fakes', (require, response) => {

    axios.get(url).then((res) => {
        const fakes = [];
        const $ = cheerio.load(res.data)
        $(".tileContent").each((index, element) => {
            let title = $(element).children('h2').first().text().trim();
            let link  = path + $(element).children('h2').children('a').attr('href');
            let description = $(element).children('.description').text().trim();
            let image = path + $(element).find('img').attr('src');
            let tag = $(element).find('.tag-848').text().trim();
            if(tag == "Novo Coronavírus Fake News"){
                fakes.push({ title, description, image , link, tag});
            }
           
        });
        response.json(fakes);
    });

})


app.listen(process.env.PORT || 3000);

