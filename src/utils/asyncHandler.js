export const asynHandler = (requestHandler) => {
    return (req , res , next) => {
           Promise.resolve(requestHandler(req , res , next)).catch((err) => next(err))
    }
}


/*
1. Purpose
This is a higher-order function (a function that returns another function).
It is used in Express.js to handle errors in asynchronous route controllers without writing try...catch in every function.

*/