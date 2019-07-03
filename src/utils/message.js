const generationMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}
const generalLocationMessage = (username,longitude, latitude) => {
    return {
        username,
        url: 'https://google.com/maps?q=' + latitude + ',' + longitude,
        createdAt: new Date().getTime()
    }
}
module.exports = { generationMessage, generalLocationMessage }