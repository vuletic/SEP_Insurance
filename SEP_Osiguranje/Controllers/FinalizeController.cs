using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace SEP_Osiguranje.Controllers
{
    public class FinalizeController : ApiController
    {

        static HttpClient client = new HttpClient();

        public async Task Get()
        {
            HttpResponseMessage response = await client.GetAsync("http://sepruleapi.azurewebsites.net/rules");
            if (response.IsSuccessStatusCode)
            {
                String a = await response.Content.ReadAsStringAsync();

            }
        }


    }
}
