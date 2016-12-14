using System.Net.Http;
using System.Web.Http;

namespace SEP_Osiguranje.Controllers
{
    public class RuleEngineController : ApiController
    {

        [Route("api/ruleengine")]
        [HttpGet]
        public HttpResponseMessage RuleEngine()
        {

            /*XmlDocument rules = new XmlDocument();

            string directory = AppDomain.CurrentDomain.BaseDirectory + @"\TaxCalculator.xml";

            rules.Load(directory);
            //model
            XmlDocument model = new XmlDocument();
            model.LoadXml(@"<Employee><GrossSalary>900000</GrossSalary>
            <HRA>50000</HRA><Tax></Tax><NetSalary>
            </NetSalary></Employee>");

            ROM rom = Compiler.Compile(rules);
            rom.AddModel("Employee", model);
            rom.Evaluate();
            var tax = model["Employee"]["Tax"].InnerText;
            var NetSalary = model["Employee"]["NetSalary"].InnerText;
            var message = string.Format("Tax: {0} and Net take home salary :{1}", tax, NetSalary);*/

            return null;
        }


    }
}
