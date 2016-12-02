using PayPal.PayPalAPIInterfaceService;
using PayPal.PayPalAPIInterfaceService.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace SEP_Osiguranje.Controllers
{
    public class PayPalController : ApiController
    {
        [Route("api/paypal/getbutton")]
        [HttpGet]
        public HttpResponseMessage Paypal()
        {
            // Create request object
            BMCreateButtonRequestType request = new BMCreateButtonRequestType();

            //  (Required) The kind of button you want to create. It is one of the following values:
            //    BUYNOW - Buy Now button
            //    CART - Add to Cart button
            //    GIFTCERTIFICATE - Gift Certificate button
            //    SUBSCRIBE - Subscribe button
            //    DONATE - Donate button
            //    UNSUBSCRIBE - Unsubscribe button
            //    VIEWCART - View Cart button
            //    PAYMENTPLAN - Installment Plan button; since version 63.0
            //    AUTOBILLING - Automatic Billing button; since version 63.0
            //    PAYMENT - Pay Now button; since version 65.1
            // Note: Do not specify BUYNOW if BUTTONCODE=TOKEN; specify PAYMENT instead. 
            // Do not specify PAYMENT if BUTTONCODE=HOSTED. 
            ButtonTypeType selectedButtonType = ButtonTypeType.BUYNOW;
            request.ButtonType = selectedButtonType;

            // (Optional) The kind of button code to create. It is one of the following values:
            // HOSTED - A secure button stored on PayPal; default for all buttons except View Cart, Unsubscribe, and Pay Now
            // ENCRYPTED - An encrypted button, not stored on PayPal; default for View Cart button
            // CLEARTEXT - nije preporucljivo - An unencrypted button, not stored on PayPal; default for Unsubscribe button
            // TOKEN - ne odgovara - A secure button, not stored on PayPal, used only to initiate the Hosted Solution checkout flow; 
            // default for Pay Now button. Since version 65.1
            request.ButtonCode = ButtonCodeType.ENCRYPTED;

            /* Add HTML standard button variables that control what is posted to 
             * PayPal when a user clicks on the created button. Refer the
             * "HTML Variables for Website Payments Standard" guide for more.
             */
            String itemName = "Moje Najbolje Osiguranje ;)";
            String returnUrl = "https://github.com/vuletic/SEP_Insurance";
            String accountEMail = "projekat.sep@gmail.com";
            String ipnAddress = "no_need_for_now";
            String price = "143";
            String currency = "USD";

            List<string> buttonVars = new List<string>();
            buttonVars.Add("item_name=" + itemName);
            buttonVars.Add("return=" + returnUrl);
            buttonVars.Add("business=" + accountEMail);
            buttonVars.Add("notify_url=" + ipnAddress);
            buttonVars.Add("amount=" + price);
            buttonVars.Add("currency_code=" + currency);
            request.ButtonVar = buttonVars;

            // Invoke the API
            BMCreateButtonReq wrapper = new BMCreateButtonReq();
            wrapper.BMCreateButtonRequest = request;

            // Configuration map containing signature credentials and other required configuration.
            // For a full list of configuration parameters refer in wiki page 
            // (https://github.com/paypal/sdk-core-dotnet/wiki/SDK-Configuration-Parameters)
            Dictionary<string, string> configurationMap = SEP_Osiguranje.PayPalData.PayPalConfiguration.GetAcctAndConfig();

            // Creating service wrapper object to make an API call by loading configuration map. 
            PayPalAPIInterfaceServiceService service = new PayPalAPIInterfaceServiceService(configurationMap);
            BMCreateButtonResponseType response = service.BMCreateButton(wrapper);
            string code = response.Website;

            HttpResponseMessage res = new HttpResponseMessage();
            res.Content = new StringContent(code);

            return res;
        }
    }
}
