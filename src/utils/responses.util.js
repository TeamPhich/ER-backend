module.exports.success = ({data}) => {
    if(!data) { throw new Error("missing data") }
    return {
        success: true,
        status: 20,
        data
    }
};

module.exports.fail = ({reason}) => ({
    success: false,
    status: 21,
    reason
});

module.exports.authenticationFail = ({reason}) => ({
    success: false,
    status: 22,
    reason
});