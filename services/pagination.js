


export const pagination=(page=1,limit=10)=>{


    page = Math.max(parseInt(page), 1);
    limit = Math.min(Math.max(parseInt(limit), 1), 100);
  

    const skip=(page-1)*limit
    return {skip:skip,limit:limit}
}