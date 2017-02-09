using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SEP_Osiguranje.Models.DTO.Output
{
    public class InsuredRealEstate
    {
        public InsuredRealEstate() {}
        public InsuredRealEstate(ObjectData objectData)
        {
            this.flood = objectData.flood;
            this.fire = objectData.fire;
            this.burglary = objectData.theft;

            this.area = (double) objectData.obj.Povrsina_Nekretnina;
            this.selectedRealEstateAge = objectData.age;
            this.selectedRealEstateValue = objectData.value;
        }


        public double area { get; set; }
        public Boolean flood { get; set; }
        public Boolean fire { get; set; }
        public Boolean burglary { get; set; }
        public int selectedRealEstateAge { get; set; }
        public int selectedRealEstateValue { get; set; }


        public double price { get; set; }
    }
}