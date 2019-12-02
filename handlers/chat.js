var users = (req, res) => {
        res.sendfile(path.join(__dirname, '/index.html'))
};



module.exports = {
        users
};