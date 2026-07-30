import 'dotenv/config.js';
import express from 'express';
import { expressjwt } from 'express-jwt';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwksRsa from 'jwks-rsa';

const app = express();

// OIDC Client ID registered in Keycloak
const clientId = process.env.OIDC_CLIENT_ID || 'web-client';

// OIDC Discovery Endpoint (Well-Known Configuration)
const discoveryUrl = `${process.env.OIDC_AUTHORITY}/.well-known/openid-configuration`;

// API URL to proxy to
const target = process.env.API_URL || 'http://localhost:4069';

// Port for the API Gateway to listen on
const port = process.env.PORT || 4068;

// Public route that bypass JWT verification
const publicRoute = process.env.PUBLIC_ROUTE
  ? new RegExp(process.env.PUBLIC_ROUTE)
  : undefined;

// Initialize and start server
async function startServer() {
  try {
    // Healthcheck endpoint
    app.get('/api-gtw-health', (req, res) => {
      res.status(200).json({ status: 'ok', message: 'API Gateway healthy' });
    });

    // Fetch OIDC discovery configuration
    let discoveryResponse;
    try {
      discoveryResponse = await fetch(discoveryUrl);
      if (!discoveryResponse.ok) throw new Error(discoveryResponse.statusText);
    } catch (error) {
      throw new Error(`Failed to fetch discovery endpoint: ${error.message}`);
    }

    // Check jwksUri exists
    const discoveryConfig = await discoveryResponse.json();
    const jwksUri = discoveryConfig.jwks_uri;
    if (!jwksUri) throw new Error('Missing jwks_uri in discovery configuration');
    console.log(`Loaded jwks_uri: ${jwksUri}`);

    // Initialize JWT validation middleware
    // https://www.npmjs.com/package/express-jwt
    let checkJwt = expressjwt({
      // Dynamically provide signing key based on kid in the header and JWKs from Keycloak
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: false,
        jwksUri: jwksUri,
      }),
      algorithms: ['RS256'], // Keycloak typically uses RS256
      audience: clientId, // replace with your client_id if needed
    });

    // Exclude public routes
    if (publicRoute) {
      checkJwt = checkJwt.unless({ path: [publicRoute, '/api-gtw-health'] });
    }

    // Apply JWT validation middleware
    app.use(checkJwt);

    // Error handling middleware for JWT errors
    app.use(function (err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        res.status(401).send(err.message);
      } else {
        next(err);
      }
    });

    // Proxy all requests if JWT is valid
    app.use(
      '/',
      createProxyMiddleware({
        target: target,
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
          console.log(`Proxying request: ${req.method} ${req.originalUrl}`);
        },
        onError: (err, req, res) => {
          console.error('Proxy error:', err);
          res.status(500).send('Proxy error');
        },
      }),
    );

    app.listen(port, () => {
      console.log(
        `Proxy server running at http://localhost:${port}, forwarding to ${target}`,
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
