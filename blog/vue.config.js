module.exports = {
    devServer:{
        open: true,
        proxy:{
            "/api":{
                target: "http://localhost:8080"
            },
            "/static":{
                target: "http://localhost:8080"
            }
        }
    }
}