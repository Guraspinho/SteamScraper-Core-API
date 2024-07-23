const asyncWrapper = (fun: any) =>
{
    return async (req: Request ,res: Response , next: any) =>
        {
            try
            {
                await fun(req,res,next);
            }
            catch (error)
            {
                next(error);
            }
        }
}
    
export default asyncWrapper;