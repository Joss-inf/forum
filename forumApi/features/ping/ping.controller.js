export async function getPing(_req,res,next){
    try {
        res.status(200).json({ message: 'pong' });
      } catch (error) {
        next(error);
    }
}