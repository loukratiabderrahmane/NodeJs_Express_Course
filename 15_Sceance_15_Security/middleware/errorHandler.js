const { logEvents } = require('./logEvents')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}`, 'errLog.txt')
    console.error(err.stack)

    const status = err.status || 500
    const isProd = process.env.NODE_ENV === 'production'

    res.status(status).json({
        message: isProd ? 'Internal Server Error' : err.message,
        ...(isProd ? {} : { stack: err.stack })
    })
}

module.exports = { errorHandler }
