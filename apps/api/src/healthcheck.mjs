import http from 'http';

async function checkStatus() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: process.env.PORT || 4069,
        method: 'GET',
      },
      (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Unexpected status code: ${res.statusCode}`));
        } else {
          resolve(`Status OK: ${res.statusCode}`);
        }
      },
    );

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

(async () => {
  try {
    const result = await checkStatus();
    console.log(result);
    process.exit(0);
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
})();
