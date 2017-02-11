using Newtonsoft.Json;
using PayPal.PayPalAPIInterfaceService;
using PayPal.PayPalAPIInterfaceService.Model;
using SEP_Osiguranje.Models;
using SEP_Osiguranje.Models.DTO;
using SEP_Osiguranje.Models.DTO.Output;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web.Http;

namespace SEP_Osiguranje.Controllers
{
    public class FinalizeController : ApiController
    {
        private SEP_EntitiesB db = new SEP_EntitiesB();
        private static HttpClient client = new HttpClient();


        private const int MAGIC_NUMBER_FLOOD = 33;
        private const int MAGIC_NUMBER_THEFT = 34;
        private const int MAGIC_NUMBER_FIRE = 35;

        private const string POLICY_NAME = "Holiday Guard";
        private const string ACCOUNT_EMAIL = "radi.molim.te@radi.com";
        String RETURN_ADDRESS = "https://seposiguranje.azurewebsites.net/#!/core/home";

        public async Task<IHttpActionResult> Post(ProcessData processData)
        {
            Data data = new Data(processData);
            HttpResponseMessage resp = await client.PostAsJsonAsync("http://sepruleapi.azurewebsites.net/policy", data);

            String json = "";

            if (resp.IsSuccessStatusCode)
            {
                json = await resp.Content.ReadAsStringAsync();
            }
            
            data = JsonConvert.DeserializeObject<Data>(json);


            Realizacija_osiguranja ro = dataToRO(processData, data);

            try {
                db.Realizacija_osiguranja.Add(ro);
                db.SaveChanges();
            }catch(Exception e)
            {
                Console.Write(e); //Mozda ipak u neki log, hm?
                return BadRequest();

            }

            //Paypal button generation
            BMCreateButtonRequestType request = new BMCreateButtonRequestType();

            request.ButtonType = ButtonTypeType.BUYNOW;
            request.ButtonCode = ButtonCodeType.ENCRYPTED;

            

            String policyId = ro.Id_Realizacija_osiguranja.ToString();
            String price = ro.Ukupna_vrednost_Realizacija_osiguranja.ToString();

            List<string> buttonVars = new List<string>();
            buttonVars.Add("return=" + RETURN_ADDRESS);
            buttonVars.Add("item_name=" + POLICY_NAME);
            buttonVars.Add("item_number=" + policyId);
            buttonVars.Add("amount=" + price);
            buttonVars.Add("currency_code=" + "EUR");// Ne moze u dinarima.
            buttonVars.Add("business=" + ACCOUNT_EMAIL);
            request.ButtonVar = buttonVars;


            // Invoke the API
            BMCreateButtonReq wrapper = new BMCreateButtonReq();
            wrapper.BMCreateButtonRequest = request;

            Dictionary<string, string> configurationMap = SEP_Osiguranje.PayPalData.PayPalConfiguration.GetAcctAndConfig();
            PayPalAPIInterfaceServiceService service = new PayPalAPIInterfaceServiceService(configurationMap);
            BMCreateButtonResponseType response = service.BMCreateButton(wrapper);

            DataForPreview dfp = new DataForPreview(ro, response.Website);
            
            return Ok(dfp);
        }


        private Realizacija_osiguranja dataToRO(ProcessData processData, Data data)
        {
            //Filling in Realizacija_osiguranja
            DateTime uctDate = DateTime.UtcNow;
            
            Realizacija_osiguranja ro = new Realizacija_osiguranja();
            
            ro.Id_PDV = 1;//Everyone thank Favid :D
            ro.Datum_Realizacija_osiguranja = uctDate;
            ro.Vrednost_Realizacija_osiguranja = (decimal) data.priceWithoutVAT;
            ro.Vrednost_PDV_Realizacija_osiguranja = (decimal) data.VAT;
            ro.Ukupna_vrednost_Realizacija_osiguranja = (decimal)data.totalPrice;
            ro.Datum_od = data.dateFrom;
            ro.Datum_do = data.dateTo;

            ro.Stavka_u_realizaciji = handleItems(ro, processData, data);

            return ro;
        }


        private List<Stavka_u_realizaciji> handleItems(Realizacija_osiguranja ro, ProcessData processData, Data data)
        {

            List<Stavka_u_realizaciji> retList = new List<Stavka_u_realizaciji>();

            //Handling Items - customers
            for (int i = 0; i < processData.customers.Count; i++)
            {
                Stavka_u_realizaciji sur = new Stavka_u_realizaciji();

                //Handle Osoba entity
                var customer = processData.customers.ElementAt(i);

                Osoba existing = db.Osoba.Where(o => o.JMBG_Osoba == customer.osoba.JMBG_Osoba).FirstOrDefault();
                if (existing != null)
                {
                    checkCustomersData(existing, customer.osoba);
                    sur.Id_Osigurana_osoba = existing.Id_Osigurani_entitet;
                } else
                {
                    sur.Osoba = customer.osoba;
                }

                sur.Nosilac_Stavka_u_realiziciji = customer.carrier;

                if (customer.insured)
                { 
                    InsuredPerson personWithRisks = data.insuredPeople.Where(ip => ip.id == i).FirstOrDefault();
                    sur.Vrednost_Stavka_u_realizaciji = (decimal) personWithRisks.price;

                    //Rizik_za_osigurani_entitet
                    //Ako bude vremena, resite da se neki rizici vezuju direkt za Realizaciju, a ne za stavke.
                    sur.Rizik_za_osigurani_entitet = handleAppliedRisksForIP(data, personWithRisks);
                }
                
                
                retList.Add(sur);
            }

            //Handle items - vehicle
            if (data.carInsured)
            {
                Stavka_u_realizaciji sur = new Stavka_u_realizaciji();
                sur.Vozilo = processData.vehicleData.vehicle;
                sur.Rizik_za_osigurani_entitet = handleAppliedRisksForIV(data.insuredCar);
                sur.Vrednost_Stavka_u_realizaciji = (decimal) data.insuredCar.price;

                retList.Add(sur);
            }


            if (data.realEstateInsured)
            {
                Stavka_u_realizaciji sur = new Stavka_u_realizaciji();
                sur.Nekretnina = processData.objectData.obj;
                sur.Rizik_za_osigurani_entitet = handleAppliedRisksForIRE(data.insuredRealEstate);
                sur.Vrednost_Stavka_u_realizaciji = (decimal) data.insuredRealEstate.price;

                retList.Add(sur);
            }

            return retList;
        }


        private List<Rizik_za_osigurani_entitet> handleAppliedRisksForIP(Data data, InsuredPerson ip)
        {

            List<Rizik_za_osigurani_entitet> retList = new List<Rizik_za_osigurani_entitet>();

            Rizik_za_osigurani_entitet rzoeAG = null;
            if (ip.ageGroup == -1)
            {
                return retList;
            }
            else
            {
                rzoeAG = new Rizik_za_osigurani_entitet();
                rzoeAG.Id_Rizik = ip.ageGroup;
                retList.Add(rzoeAG);
            }

            Rizik_za_osigurani_entitet rzoeLoc = null;
            if(data.selectedLocation != -1)
            {
                rzoeLoc = new Rizik_za_osigurani_entitet();
                rzoeLoc.Id_Rizik = data.selectedLocation;
                retList.Add(rzoeLoc);
            }

            Rizik_za_osigurani_entitet rzoeSport = null;
            if (data.sport)
            {
                rzoeSport = new Rizik_za_osigurani_entitet();
                rzoeSport.Id_Rizik = data.selectedSport;
                retList.Add(rzoeSport);
            }

            Rizik_za_osigurani_entitet rzoeAmount = null;
            if (data.selectedInsuranceAmount != -1)
            {
                rzoeAmount = new Rizik_za_osigurani_entitet();
                rzoeAmount.Id_Rizik = data.selectedInsuranceAmount;
                retList.Add(rzoeAmount);
            }

            return retList;
        }

        private List<Rizik_za_osigurani_entitet> handleAppliedRisksForIV(InsuredCar ic)
        {
            List<Rizik_za_osigurani_entitet> retList = new List<Rizik_za_osigurani_entitet>();

            Rizik_za_osigurani_entitet rzoeAltRide = null;
            if (ic.alternativRide)
            {
                rzoeAltRide = new Rizik_za_osigurani_entitet();
                rzoeAltRide.Id_Rizik = ic.selectedAlternateTransportationDistance;
                retList.Add(rzoeAltRide);
            }

            Rizik_za_osigurani_entitet rzoeHotel = null;
            if (ic.hotel)
            {
                rzoeHotel = new Rizik_za_osigurani_entitet();
                rzoeHotel.Id_Rizik = ic.selectedHotelDays;
                retList.Add(rzoeHotel);
            }

            Rizik_za_osigurani_entitet rzoeTowing = null;
            if (ic.towing)
            {
                rzoeTowing = new Rizik_za_osigurani_entitet();
                rzoeTowing.Id_Rizik = ic.selectedTowingDistance;
                retList.Add(rzoeTowing);
            }

            Rizik_za_osigurani_entitet rzoeRepairment = null;
            if (ic.repairment)
            {
                rzoeRepairment = new Rizik_za_osigurani_entitet();
                rzoeRepairment.Id_Rizik = ic.selectedReparationPrice;
                retList.Add(rzoeRepairment);
            }

            return retList;
        }

        private List<Rizik_za_osigurani_entitet> handleAppliedRisksForIRE(InsuredRealEstate ire)
        {
            List<Rizik_za_osigurani_entitet> retList = new List<Rizik_za_osigurani_entitet>();

            Rizik_za_osigurani_entitet rzoeAge = null;
            if (ire.selectedRealEstateAge != -1)
            {
                rzoeAge = new Rizik_za_osigurani_entitet();
                rzoeAge.Id_Rizik = ire.selectedRealEstateAge;
                retList.Add(rzoeAge);
            }

            Rizik_za_osigurani_entitet rzoeValue = null;
            if (ire.selectedRealEstateValue != -1)
            {
                rzoeValue = new Rizik_za_osigurani_entitet();
                rzoeValue.Id_Rizik = ire.selectedRealEstateValue;
                retList.Add(rzoeValue);
            }

            Rizik_za_osigurani_entitet rzoeFlood = null;
            if (ire.flood)
            {
                rzoeFlood = new Rizik_za_osigurani_entitet();
                rzoeFlood.Id_Rizik = MAGIC_NUMBER_FLOOD;
                retList.Add(rzoeFlood);
            }

            Rizik_za_osigurani_entitet rzoeFire = null;
            if (ire.fire)
            {
                rzoeFire = new Rizik_za_osigurani_entitet();
                rzoeFire.Id_Rizik = MAGIC_NUMBER_FIRE;
                retList.Add(rzoeFire);
            }

            Rizik_za_osigurani_entitet rzoeTheft = null;
            if (ire.burglary)
            {
                rzoeTheft = new Rizik_za_osigurani_entitet();
                rzoeTheft.Id_Rizik = MAGIC_NUMBER_THEFT;
                retList.Add(rzoeTheft);
            }

            return retList;
        }

        private void checkCustomersData(Osoba existing, Osoba recieved)
        {
            bool changed = false;
            if(existing.Ime_Osoba != recieved.Ime_Osoba)
            {
                existing.Ime_Osoba = recieved.Ime_Osoba;
                changed = true;
            }

            if (existing.Prezime_Osoba != recieved.Prezime_Osoba)
            {
                existing.Prezime_Osoba = recieved.Prezime_Osoba;
                changed = true;
            }

            if (existing.Broj_pasosa_Osoba != recieved.Broj_pasosa_Osoba)
            {
                existing.Broj_pasosa_Osoba = recieved.Broj_pasosa_Osoba;
                changed = true;
            }

            if (existing.Adresa_Osoba != recieved.Adresa_Osoba)
            {
                existing.Adresa_Osoba = recieved.Adresa_Osoba;
                changed = true;
            }

            if (existing.E_mail_Osoba != recieved.E_mail_Osoba)
            {
                existing.E_mail_Osoba = recieved.E_mail_Osoba;
                changed = true;
            }

            if (existing.Broj_telefona_Osoba != recieved.Broj_telefona_Osoba)
            {
                existing.Broj_telefona_Osoba = recieved.Broj_telefona_Osoba;
                changed = true;
            }


            if(changed == true)
            {
                db.Entry(existing).State = EntityState.Modified;
            }


        }
    }
}
