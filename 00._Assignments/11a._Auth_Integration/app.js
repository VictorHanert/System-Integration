import express from 'express';
import pkg from "express-openid-connect"
import dotenv from 'dotenv';

const { auth, requiresAuth } = pkg;

dotenv.config();

const app = express();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    authorizationParams: {
      response_type: 'code',
      response_mode: 'query',
      scope: 'openid profile email',
    }
  };

app.use(auth(config)); // express-openid-connect middleware 

// Public route
app.get('/', (req, res) => {
  res.send(`
    <h1>Home OAUTH</h1>
    ${req.oidc.isAuthenticated() ? `
      <p>Welcome ${req.oidc.user.name}</p>
      <a href="/profile">Profile</a> |
      <a href="/logout">Logout</a>
    ` : `<a href="/login">Login</a>`}  
  `); // /login and /logout are handled by express-openid-connect
});

// Protected route
app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user, null, 2));
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server running on port', PORT));
