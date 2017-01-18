using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SEP_Osiguranje.Models.DTO.Output
{
    public class InsuredPerson
    {
        public InsuredPerson() {}
        public InsuredPerson(int id, CustomersData customersData)
        {
            this.id = id;
            this.ageGroup = (int) customersData.ageGroup;
        }

        public int id {get; set; }
        public int ageGroup { get; set; }

        public double calculatedPrice { get; set; }

    }
}