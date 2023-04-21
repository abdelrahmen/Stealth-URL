import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';
const app = express();
import cors from "cors";
import * as dns from "dns";
import {nanoid} from 'nanoid';
import bodyParser from "body-parser";

const urls = {};
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res, next) => {
  const url = req.body.url;
  const id = nanoid();
  try {
    const { hostname } = new URL(url);
    dns.lookup(hostname, (err) => {
    if (err) {
      res.json({ 'error': 'Invalid url' });
    } else {
      urls[id] = url;
      res.json({ original_url: url, short_url: id });
    }
  });
  } catch (error) {
    res.json({ error: 'invalid url' })
  }
})

app.get('/api/shorturl/:id', function(req, res) {
  const id = req.params.id;
  const url = urls[id];
  if (url) {
    res.redirect(url);
  } else {
    res.status(404).json({"error":"No short URL found for the given input"});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
