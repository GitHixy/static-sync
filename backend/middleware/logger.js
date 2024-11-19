const loggerMiddleware = (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`[${req.method}] ${req.originalUrl} - IP: ${clientIp}`);
    next();
  };
  
  module.exports = loggerMiddleware;