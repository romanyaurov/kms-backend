import app from './app';
import migration from './migrate'; // temporary

const PORT = process.env.PORT;

// Just for test
(async () => {
  await migration();
})();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
