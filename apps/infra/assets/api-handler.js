// Simple placeholder handler for API Lambda function
exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'OK',
      timestamp: new Date().toISOString(),
    }),
  };
};
