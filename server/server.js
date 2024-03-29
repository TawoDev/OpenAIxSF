import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from My AI Code Demo'
    })
});

app.post('/', async (req, res) => {
    try{
        const prompt = req.body.prompt;
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: `You are a helpful customer representative at JFF Ltd and you are JFF.`},
                {role: "user", content: `
                    - Provide industry news
                    - Provide local news
                    - Provide local weather information
                    - Funny tone
                    - With Emoji

                    Client information:
                    Name: GenePoint
                    Industry: Biotechnology
                    Address: 345 Shoreline Park, Mountain View, CA 94043, USA
                    Description: Genomics company engaged in mapping and sequencing of the human genome and developing gene-based drugs
                    ` 
                    + `${prompt}`}
            ],
            temperature: 0.3,
            max_tokens: 3000,
          });

        // const response = await openai.createCompletion({
        //     model: "gpt-3.5-turbo",
        //     prompt: `${prompt}`,
        //     temperature: 0.3,
        //     max_tokens: 3000,
        //     top_p: 1,
        //     frequency_penalty: 0.5,
        //     presence_penalty: 0
        // });

        res.status(200).send({
            bot: response.data.choices[0].message
        });
    } catch(err) {
        console.log(err);
        res.status(500).send({err});
    }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));