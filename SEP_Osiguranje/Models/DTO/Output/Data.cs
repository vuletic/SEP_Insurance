using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SEP_Osiguranje.Models.DTO.Output
{
    public class Data
    {

        public Data() { }

        public Data(ProcessData processData)
        {
            this.dateFrom = processData.dateFrom;
            this.dateTo = processData.dateTo;

            if (processData.selectedSport > -1)
            {
                this.selectedSport = (int) processData.selectedSport;
                this.sport = true;
            }
            else
            {
                this.selectedSport = 0;
                this.sport = false;
            }

            this.selectedLocation = (int) processData.location;
            this.selectedInsuranceAmount = (int) processData.insuranceAmount;


            if(processData.vehicleData != null)
            {
                this.carInsured = true;
                this.insuredCar = new InsuredCar(processData.vehicleData);
            }

            if (processData.objectData != null)
            {
                this.realEstateInsured = true;
                this.insuredRealEstate = new InsuredRealEstate(processData.objectData);
            }

            insuredPeople = new List<InsuredPerson>();
            for (int i = 0; i<processData.customers.Count; i++)
            {

                if (processData.customers.ElementAt(i).ageGroup != -1)
                {
                    InsuredPerson ip = new InsuredPerson(i, processData.customers.ElementAt(i));
                    insuredPeople.Add(ip);
                }
            }
        }



        public int selectedLocation { get; set; }
        public DateTime dateFrom { get; set; }
        public DateTime dateTo { get; set; }

        public int selectedSport;
        public Boolean sport;

        public int selectedInsuranceAmount { get; set; }

        public Boolean realEstateInsured;
        public Boolean carInsured { get; set; }


        public List<InsuredPerson> insuredPeople { get; set; }
        public InsuredRealEstate insuredRealEstate { get; set; }
        public InsuredCar insuredCar { get; set; }

        public double groupDiscount { get; set; }
        public double packageDiscount { get; set; }

        public Double VATRate { get; set; } 
        public Double VAT { get { return finalPrice * (VATRate / (1 + VATRate)); } }  

        public double totalPrice
        {
            get
            {
                double priceBase = 0;
                foreach (InsuredPerson person in insuredPeople)
                {
                    priceBase += person.price;
                }

                if (carInsured)
                    priceBase += insuredCar.price;

                if (realEstateInsured)
                    priceBase += insuredRealEstate.price;

                return priceBase;
            }
        }

        public double finalPrice //includes discounts
        {
            get
            {
                return totalPrice - groupDiscount - packageDiscount;
            }
        }

        public double priceWithoutVAT
        {
            get { return finalPrice - VAT; }
        }
    }
}