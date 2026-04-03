const rateLimitWindowMS = 60 * 1000;
const maxRequestsPerWindow = 10; 

const ipRequestLogs = new Map();

function rateLimiter(req, res, next) {
  const now = Date.now();
  const ip = req.ip;

  if (!ipRequestLogs.has(ip)) {
    ipRequestLogs.set(ip, []);
  }

  const timestamps = ipRequestLogs.get(ip);

  while (timestamps.length > 0 && timestamps[0] <= now - rateLimitWindowMS) {
    timestamps.shift();
  }

  if (timestamps.length >= maxRequestsPerWindow) {
    return res.status(429).json({
      error: `Rate limit exceeded. Max ${maxRequestsPerWindow} requests per minute.`,
    });
  }

  timestamps.push(now);
  next();
}

module.exports = rateLimiter;
