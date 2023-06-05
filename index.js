import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';
const app = express();
import cors from "cors";
import * as dns from "dns";
import { nanoid } from 'nanoid';
import bodyParser from "body-parser";

const urls = {};

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/StealthURL', (req, res, next) => {
  const url = req.body.url;
  const id = nanoid();
  try {
    const { hostname } = new URL(url);
    dns.lookup(hostname, (err) => {
      if (err) {
        res.json({ 'error': 'Invalid url' });
      } else {
        urls[id] = url;
        res.json({
          original_url: url,
          Stealth_url: `https://urlsh.abdelrahmen1.repl.co/api/StealthURL/${id}`
        });
      }
    });
  } catch (error) {
    res.json({ error: 'invalid url' })
  }
})

app.get('/api/StealthURL/:id', function(req, res) {
  const id = req.params.id;
  const url = urls[id];
  if (url) {
    res.redirect(url);
  } else {
    res.status(404).json({ "error": "No short URL found for the given input" });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
