using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SEP_Osiguranje.Models.DTO.Output
{
    public class DataForPreview
    {

        public DataForPreview() { }
        public DataForPreview(Realizacija_osiguranja ro, string pp_button)
        {
            this.ro = ro;
            this.pp_button = pp_button;
        }

        public Realizacija_osiguranja ro { get; set; }
        public string pp_button { get; set; }
    }
}