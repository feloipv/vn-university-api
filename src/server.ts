import 'module-alias/register';
import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log(`🚀 Server đang chạy tại: \x1b[34m\x1b[4m${serverUrl}\x1b[0m`);
});
