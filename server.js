import express from 'express';
import router from './routes/index';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* views */
app.use('/', router);

const port = 5000;
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
export default app;
