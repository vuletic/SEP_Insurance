using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SEP_Osiguranje.Models.DTO
{
    public class VehicleData
    {

        public Vozilo vehicle { get; set; }

        public decimal tow { get; set; }
        public decimal repair { get; set; }
        public decimal accom { get; set; }
        public decimal ride { get; set; }

    }
}