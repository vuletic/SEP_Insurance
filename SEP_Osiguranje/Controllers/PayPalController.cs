using PayPal.PayPalAPIInterfaceService;
using PayPal.PayPalAPIInterfaceService.Model;
using SEP_Osiguranje.Models;
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
using System.Linq;

namespace SEP_Osiguranje.Controllers
{
    public class PaypalController : ApiController
    {
        private SEP_EntitiesB db = new SEP_EntitiesB();

        private const string POLICY_NAME = "Holiday Guard";
        private const string ACCOUNT_EMAIL = "radi.molim.te@radi.com";

        public async void PostPaypal()
        {
            var verificationResp = string.Empty;

            try
            {
                HttpWebRequest verificationReq = WebRequest.Create("https://www.sandbox.paypal.com/cgi-bin/webscr") as HttpWebRequest;

                verificationReq.Method = "POST";
                verificationReq.ContentType = "application/x-www-form-urlencoded";
                var param = await Request.Content.ReadAsByteArrayAsync();
                string strRequest = Encoding.ASCII.GetString(param);
                strRequest = "cmd=_notify-validate&" + strRequest;
                verificationReq.ContentLength = strRequest.Length;

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var streamOut = new StreamWriter(verificationReq.GetRequestStream(), Encoding.ASCII);
                streamOut.Write(strRequest);
                streamOut.Close();

                var streamIn = new StreamReader(verificationReq.GetResponse().GetResponseStream());
                verificationResp = streamIn.ReadToEnd();
                streamIn.Close();

                ProcessVerificationResponse(verificationResp, strRequest);
            }
            catch (Exception e)
            {
                // zapisati zasto je doslo do greske...
            }
        }

        private void ProcessVerificationResponse(string response, string paymentDetails)
        {
            // postoji i polje "payment_date", (svi podaci o uplatiocu(ime, prezime, adresa))

            Dictionary<string, string> details = organizeDetails(paymentDetails);
            if (response.Equals("VERIFIED"))
            {
                if (!details.ContainsKey("receiver_email") || !details.ContainsKey("payment_status") || !details.ContainsKey("item_name") || !details.ContainsKey("item_number"))
                    return; // ukoliko nam nije dostupan neki od osnovnih podataka

                if (!details["receiver_email"].Equals(ACCOUNT_EMAIL))
                    return; // transakcija nije namenjena meni

                if (!details["payment_status"].Equals("Completed"))
                    return; // nije prosla transakcija

                if (!details["item_name"].Equals(POLICY_NAME))
                    return; // nije placeno osiguranje vec nesto drugo


                string policyIdStr = details["item_number"];
                int policyId = Int32.Parse(policyIdStr);
                

                string currency = "", ammount = "";
                if (details.ContainsKey("mc_currency"))
                    currency = details["mc_currency"];

                if (details.ContainsKey("mc_gross"))
                    ammount = details["mc_gross"];

                
                // upisati u bazu za odgovarajucu polisu da je placanje izvrseno
                // upisati u bazu za odgovarajucu polisu id transakcije -- izmeniti bazu da bi ovo bilo moguce :)

                // nadji datu polisu u bazi
                Realizacija_osiguranja ro = db.Realizacija_osiguranja.Where(r => r.Id_Realizacija_osiguranja == policyId).FirstOrDefault() ;
                if (ro != null)
                {
                    // proveriti da li se valuta i placeni iznos poklapaju sa ocekivanim
                    if (ro.Ukupna_vrednost_Realizacija_osiguranja.Equals(Decimal.Parse(ammount)))
                    {
                        ro.Potvrdjena_Realizacija_osiguranja = true;
                        db.SaveChanges();
                    }
                }

            }
            else
            {
                //upisati u redovan log
                //upisati u log potencijalnih opasnosti

                string email = "", status = "";
                if (details.ContainsKey("payer_email"))
                    email = details["payer_email"];
                if (details.ContainsKey("payer_status"))
                    status = details["payer_status"];       // da li ima verifikovan nalog na paypal-u
            }
        }

        private Dictionary<string, string> organizeDetails(string detailsList)
        {
            detailsList = HttpUtility.UrlDecode(detailsList);
            Dictionary<string, string> dictionary = new Dictionary<string, string>();
            String[] details = detailsList.Split('&');
            foreach (string detail in details)
            {
                String[] data = detail.Split('=');
                dictionary.Add(data[0], data[1]);
            }
            return dictionary;
        }
    }
}
