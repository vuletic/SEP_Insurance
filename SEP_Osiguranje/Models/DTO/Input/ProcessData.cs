using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SEP_Osiguranje.Models.DTO
{
    public class ProcessData
    {

        public List<CustomersData> customers { get; set; }
        public VehicleData vehicleData { get; set; }
        public ObjectData objectData { get; set; }


        public DateTime dateFrom { get; set; }
        public DateTime dateTo { get; set; }

        public decimal location { get; set; }
        public decimal insuranceAmount { get; set; }
        public decimal selectedSport { get; set; }
        
    }
}