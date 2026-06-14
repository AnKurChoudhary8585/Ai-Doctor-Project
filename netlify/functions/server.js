import serverless from 'serverless-http';
import app from '../../backend/app.js';

const handler = serverless(app);

export { handler };
