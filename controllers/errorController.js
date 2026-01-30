const triggerError = async (req, res, next) => {
    // This function will intentionally trigger an error for testing purposes
    throw new Error("This is a test error triggered intentionally.");
}
module.exports = { triggerError };