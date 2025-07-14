namespace agencia.Response
{
     public class ApiResponse
    {
        public object? Data { get; set; }
        public ErrorResponse? Error { get; set; }
        public int StatusCode { get; set; }

        public ApiResponse(object? data, ErrorResponse? error, int statusCode)
        {
            Data = data;
            Error = error;
            StatusCode = statusCode;
        }
    }

}