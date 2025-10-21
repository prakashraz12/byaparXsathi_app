interface ResponseHandlerProps{
    message?:string,
    statusCode?:number;
    success?:boolean;
    data?:any
}
export const responseHandler = ({message = "Operation Success", statusCode= 200, success= true, data}:ResponseHandlerProps)=>{
    return{
        message,
        statusCode,
        success,
        data: data ?? null
    }
}