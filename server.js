const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
connectDB();

const chatRoute = require('./routes/chat');
const authRoutes = require('./routes/auth');
const trendRoutes = require('./routes/trends');
const fetchGitHubTrending = require('./jobs/githubTrendsJob');
const passport = require('passport');
require('./config/passport');



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoute);
app.use('/api/auth', authRoutes);
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/users', require('./routes/users'));
app.use('/api/trends', trendRoutes);
app.use('/api/roadmap', require('./routes/roadmap'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/pitch', require('./routes/pitch'));
app.use(passport.initialize());


app.get('/', (req, res) => {
  res.send('CareerGPT backend is live!');
});

fetchGitHubTrending();
setInterval(fetchGitHubTrending, 12 * 60 * 60 * 1000); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
