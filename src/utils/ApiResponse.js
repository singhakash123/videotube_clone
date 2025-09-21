class ApiResponse{
      constructor(
            statusCode , 
             data , 
             message = "success"
      ){
        this.statusCode = statusCode ; 
        this.data = data ; 
        this.success = statusCode < 300 ; 
        this.message = message

      }
}


/*
Agar statusCode 200–399 (success range) hoga to success = true hona chahiye.
Agar statusCode >= 400 hoga to success = false hona chahiye.
*/