import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import songRouter from './src/routes/song.js';
import playlistRouter from './src/routes/playlist.js';

import connectDb from './src/config/mongodb.js'
import connectCloudinary from './src/config/cloudinary.js'
import userRouter from './src/routes/user.js';
import cookieParser from 'cookie-parser';

//App config:

const app = express();
const port = process.env.PORT || 2006;

connectDb();
connectCloudinary();

//middlewares:
app.use(express.json())
app.use(cors());
app.use(cookieParser());

//routes:
app.use('/api/songs', songRouter);
app.use('/api/playlists', playlistRouter);
app.use('/api/users', userRouter);

app.get('/', (req, res) => {
    res.send('hi')
})

app.listen(port, () => console.log(`Express Server Online in port ${port}`));
