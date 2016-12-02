using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace SEP_Osiguranje.PayPalData
{
    // For a full list of configuration parameters refer in wiki page [https://github.com/paypal/sdk-core-dotnet/wiki/SDK-Configuration-Parameters]
    public static class PayPalConfiguration
    {
        // Creates a configuration map containing credentials and other required configuration parameters
        public static Dictionary<string, string> GetAcctAndConfig()
        {
            Dictionary<string, string> configMap = new Dictionary<string, string>();

            configMap = GetConfig();

            // Signature Credential
            //configMap.Add("account1.apiUsername", "jb-us-seller_api1.paypal.com");
            //configMap.Add("account1.apiPassword", "WX4WTU3S8MY44S7F");
            //configMap.Add("account1.apiSignature", "AFcWxV21C7fd0v3bYYYRCpSSRl31A7yDhhsPUU2XhtMoZXsWHFxu-RWy");
            // Optional
            // configMap.Add("account1.Subject", "");

            // Sample Certificate Credential
            string certPath = AppDomain.CurrentDomain.BaseDirectory + "PayPalData\\paypal_cert.p12";
            configMap.Add("account2.apiUsername", "projekat.sep_api1.gmail.com");
            configMap.Add("account2.apiPassword", "5QM55C5Z4QR6R7L2");
            configMap.Add("account2.apiCertificate", certPath);
            configMap.Add("account2.privateKeyPassword", "elektronsko123");
            // Optional
            // configMap.Add("account2.Subject", "");
            return configMap;
        }

        // Creates a configuration map containing mode and other required configuration parameters
        public static Dictionary<string, string> GetConfig()
        {
            Dictionary<string, string> configMap = new Dictionary<string, string>();

            // Endpoints are varied depending on whether sandbox OR live is chosen for mode
            configMap.Add("mode", "sandbox");

            // These values are defaulted in SDK. If you want to override default values, uncomment it and add your value.
            // configMap.Add("connectionTimeout", "5000");
            // configMap.Add("requestRetries", "2");

            return configMap;
        }
    }
}
