
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

        public ApiResponse(bool success, string message)
        {
            Data = new { success = success, message = message };
            Error = null;
            StatusCode = success ? 200 : 400;
        }

        internal bool Any()
        {
            throw new NotImplementedException();
        }
    }

}