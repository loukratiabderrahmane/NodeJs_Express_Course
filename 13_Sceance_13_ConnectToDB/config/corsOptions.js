const whitelist = [
    'https://www.monsite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500'
]
const corsOptions = {
    origin : (origin, callback) =>{
        if(whitelist.includes(origin) || !origin) {
            callback(null, true)
            // callback(error, allow)
        }else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionSuccessStatus: 200
}

module.exports = corsOptions