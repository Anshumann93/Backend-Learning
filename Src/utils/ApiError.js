class ApiError extends Error{
  constructor(
    statusCode,
    message="Some Went Wrong",
    Error=[],
    stack=""
  ){
    super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors
        if(stack){
          stack=this.stack
        }
        else{
          Error.captureStackTrace(this, this.constructor)
        }
  }  
}

export {ApiError}