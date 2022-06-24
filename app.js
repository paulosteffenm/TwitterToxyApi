import express from "express";
import axios from "axios";
import 'dotenv/config';
import * as toxicity from '@tensorflow-models/toxicity';
import cors from 'cors'

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false
  })
)
const cleanData = ((tweet) => {
  const clearText = (text) => {
    return text.replace(/[^\w\s]/gi, "");
  }

  const removeLinks = (text) => {
    return text.replace(/https.*/, '');
  }

  return {
    text: clearText(removeLinks(tweet.text)),
    metrics: tweet.public_metrics,
    id: tweet.id,
    createdAt: tweet.created_at,
  };
});

const getTwitterData = async (query) => {
  const url = `${process.env.BASE_URL}/search/recent?query=${query} lang:en&tweet.fields=created_at,author_id,public_metrics&max_results=100`;
  const { data } = await axios({
    method: "GET",
    url,
    headers: { Authorization: `Bearer ${process.env.Bearer_Token}` },
  });

  const finalData = data.data.map((tweet) => cleanData(tweet));
  return finalData;
}

const getPrediction = async (tweets) => {
  const model = await toxicity.load(0.5, ['toxicity']);

  const texts = tweets.map((tweet) => tweet.text);

  const predictions = await model.classify(texts);

  const messagesAndPredictions = predictions[0].results.map((result, index) => {
    return {
      text: tweets[index].text,
      metrics: tweets[index].metrics,
      id: tweets[index].id,
      createdAt: tweets[index].createdAt,
      results: result,
    }
  });

  return messagesAndPredictions;
}

app.get('/api', async (req, res) => {
  const { query } = req.query;
  const messages = await getTwitterData(query);
  const predictions = await getPrediction(messages.slice(0, 5));
  const returnData = { tweets: predictions };
  return res.send(returnData).status(200);
})

app.listen(4002, () => console.log('Server is running on port 4002'));