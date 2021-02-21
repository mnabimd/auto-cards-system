const sendRender = (view, res, data = {},) => {
    return res.render(view, {
        data: data
    });
}

module.exports = {
    sendRender
}