require('dotenv').config();
const connectDatabase = require('./src/config/database');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDatabase();
  app.listen(PORT, () => console.log(`Server @ http://localhost:${PORT}`));
})();
