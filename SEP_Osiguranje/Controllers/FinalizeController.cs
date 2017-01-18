using SEP_Osiguranje.Models.DTO;
using SEP_Osiguranje.Models.DTO.Output;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;

namespace SEP_Osiguranje.Controllers
{
    public class FinalizeController : ApiController
    {

        static HttpClient client = new HttpClient();

        public async Task<HttpResponseMessage> Post(ProcessData processData)
        {

            HttpResponseMessage response = await client.GetAsync("http://sepruleapi.azurewebsites.net/rules");
            if (response.IsSuccessStatusCode)
            {
                String a = await response.Content.ReadAsStringAsync();

            }

            Data data = new Data(processData);

            HttpResponseMessage res = new HttpResponseMessage();
            res.Content = new StringContent("<h1>BemTiSvjet</h1>");
            res.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
            return res;
        }


    }
}
