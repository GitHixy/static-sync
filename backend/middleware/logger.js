const loggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${clientIp}`);
    console.log('Body:', req.body || 'No body');
    next();
  };
  
  module.exports = loggerMiddleware;