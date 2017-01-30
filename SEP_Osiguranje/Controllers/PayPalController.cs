using PayPal.PayPalAPIInterfaceService;
using PayPal.PayPalAPIInterfaceService.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace SEP_Osiguranje.Controllers
{
    public class PaypalController : ApiController
    {
        //[Route("api/paypal/getbutton")]
        //[HttpGet]
        public HttpResponseMessage GetPaypal()
        {
            // Create request object
            BMCreateButtonRequestType request = new BMCreateButtonRequestType();

            request.ButtonType = ButtonTypeType.BUYNOW;

            // HOSTED - A secure button stored on PayPal; default for all buttons except View Cart, Unsubscribe, and Pay Now
            // ENCRYPTED - An encrypted button, not stored on PayPal; default for View Cart button
            // CLEARTEXT - nije preporucljivo - An unencrypted button, not stored on PayPal; default for Unsubscribe button
            request.ButtonCode = ButtonCodeType.ENCRYPTED;

            String itemName = "Moje Najbolje Osiguranje ;)";
            String accountEMail = "projekat.sep@gmail.com";
            String price = "1430";
            String currency = "USD";

            List<string> buttonVars = new List<string>();
            buttonVars.Add("return=" + "https://seposiguranje.azurewebsites.net/#!/core/home");
            buttonVars.Add("item_name=" + itemName);
            buttonVars.Add("business=" + accountEMail);
            buttonVars.Add("amount=" + price);
            buttonVars.Add("currency_code=" + currency);
            request.ButtonVar = buttonVars;

            // Invoke the API
            BMCreateButtonReq wrapper = new BMCreateButtonReq();
            wrapper.BMCreateButtonRequest = request;

            Dictionary<string, string> configurationMap = SEP_Osiguranje.PayPalData.PayPalConfiguration.GetAcctAndConfig();
            PayPalAPIInterfaceServiceService service = new PayPalAPIInterfaceServiceService(configurationMap);
            BMCreateButtonResponseType response = service.BMCreateButton(wrapper);

            HttpResponseMessage res = new HttpResponseMessage();
            res.Content = new StringContent(response.Website);
            res.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
            return res;
        }
        

        //[Route("api/paypal/notify")]
        //[HttpGet]
        public void PostPaypal()
        {
            var verificationResp = string.Empty;

            try
            {
                HttpWebRequest verificationReq = WebRequest.Create("https://www.sandbox.paypal.com/cgi-bin/webscr") as HttpWebRequest;
                
                verificationReq.Method = "POST";
                verificationReq.ContentType = "application/x-www-form-urlencoded";
                //var param = Request.BinaryRead(Request.ContentLength);
                //var strRequest = Encoding.ASCII.GetString(param);
                var strRequest = "cmd=_notify-validate&" + (string)(Request.Properties["body"]);
                verificationReq.ContentLength = strRequest.Length;

                var streamOut = new StreamWriter(verificationReq.GetRequestStream(), Encoding.ASCII);
                streamOut.Write(strRequest);
                streamOut.Close();

                var streamIn = new StreamReader(verificationReq.GetResponse().GetResponseStream());
                verificationResp = streamIn.ReadToEnd();
                streamIn.Close();
            }
            catch (Exception e)
            {
                //handle exception, write log, etc...
            }

            ProcessVerificationResponse(verificationResp);
        }

        private void ProcessVerificationResponse(string response)
        {
            if (response.Equals("VERIFIED"))
            {
                // check that Payment_status is Completed
                // check that Txn_id has not been previously processed
                // check that Receiver_email is your Primary PayPal email
                // check that Payment_amount is correct
                // check that Payment_currency is correct
                // process payment
            }
            else if (response.Equals("INVALID"))
            {
                //this means that notification is false and that there was no payment
                //handle exception, write log, etc...
            }
            else
            {
                //handle exception, write log, etc...
            }
        }
    }
}
