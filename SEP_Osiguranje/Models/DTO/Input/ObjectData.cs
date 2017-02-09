using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SEP_Osiguranje.Models.DTO
{
    public class ObjectData
    {
        public Nekretnina obj { get; set; }

        public bool fire { get; set; }
        public bool flood { get; set; }
        public bool theft { get; set; }


        public int age { get; set; }
        public int value { get; set; }
         
    }
}