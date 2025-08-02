
namespace agencia.Response
{
     public class ApiResponse
    {
        private bool v1;
        private string v2;

        public object Data { get; set; }
        public ErrorResponse? Error { get; set; }
        public int StatusCode { get; set; }
      

        public ApiResponse(object data, ErrorResponse? error, int statusCode)
        {
            Data = data;
            Error = error;
            StatusCode = statusCode;
        }

        public ApiResponse(bool v1, string v2)
        {
            this.v1 = v1;
            this.v2 = v2;
        }

        internal bool Any()
        {
            throw new NotImplementedException();
        }
    }

}