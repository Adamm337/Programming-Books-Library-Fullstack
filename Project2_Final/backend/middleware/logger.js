const logger = (req, res, next) => {
   
    if (req.method === 'POST') {
        console.log(`[${new Date().toISOString()}] POST request by User: ${req.session.userId || 'Guest'}`);
    }
    next();
};

module.exports = logger;