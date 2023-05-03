module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    // Custom app error response format
    console.log(err);
    if (err.code && err.message) {
        return res.status(err.code).json({ message: err.message });
    }
    
    // Handle 500 with message if no code is provided
    if (err.message) {
        return res.status(500).json({ message: err.message });
    }

    // default to 404 server error
    return res.status(404).json({ message: 'Not Found' });
}