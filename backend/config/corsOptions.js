const whiteList = [
    'http://localhost:3270',
    'http://localhost:5120',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whiteList.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,  // Enable cookies/authentication
    optionsSuccessStatus: 200
};

module.exports = corsOptions;
