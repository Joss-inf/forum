
/**
 * Handles a ping request and responds with a JSON message 'pong'.
 * 
 * @async
 * @function getPing
 * @param {Object} res - Express response object.
 * @returns {void}
 */
export async function getPing(res){
    res.status(200).json({ message: 'pong' });
}