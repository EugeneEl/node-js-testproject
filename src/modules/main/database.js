const CONFIG = require('../../config');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

mongoose.connect(CONFIG.database.connectURI, { useNewUrlParser: true },
    (err) => console.log(
        err || 'App connect to ModgoDB'
    )
);
