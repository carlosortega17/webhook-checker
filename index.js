const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: '*',
}));

let webhooks = [];

const appendWebhook = (req, res) => {
  webhooks = [
    {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
    },
    ...webhooks,
  ];
  res.status(200).send();
};

app.get('/', (req, res) => {
  res.render('index', { webhooks });
});

app.get('/favicon.ico', (req, res) => {
  res.status(200).send();
});

app.get('*', appendWebhook);

app.post('*', appendWebhook);

app.delete('*', appendWebhook);

app.put('*', appendWebhook);

app.listen(process.env.PORT ?? 4001);
