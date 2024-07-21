import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import songRouter from './src/routes/song.js';
import playlistRouter from './src/routes/playlist.js';

import connectDb from './src/config/mongodb.js'
import connectCloudinary from './src/config/cloudinary.js'
import userRouter from './src/routes/user.js';
import cookieParser from 'cookie-parser';
import refreshRouter from './src/routes/refresh.js';
import logoutRouter from './src/routes/logout.js';

//App config:

const app = express();
const port = 2006;

connectDb();
connectCloudinary();

//middlewares:
app.use(express.json())

//! If something goes wrong with cors:
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', true);
//     next();
// })

app.use(cors({origin: true, credentials: true}));
app.use(cookieParser());

//routes:
app.use('/api/songs', songRouter);
app.use('/api/playlists', playlistRouter);
app.use('/api/users', userRouter);
app.use('/refresh', refreshRouter);
app.use('/logout', logoutRouter);

app.get('/', (req, res) => {
    res.send('Server working')
})

app.listen(port, () => console.log(`Express Server Online in port ${port}`));
