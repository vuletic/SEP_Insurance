//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SEP_Osiguranje.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Vozilo
    {
        public Vozilo()
        {
            this.Stavka_u_realizaciji = new HashSet<Stavka_u_realizaciji>();
        }
    
        public int Id_Osigurani_entitet { get; set; }
        public decimal JMBG_Vlasnik_Vozilo { get; set; }
        public string Ime_Vlasnik_Vozilo { get; set; }
        public string Prezime_Vlasnik_Vozilo { get; set; }
        public string Broj_sasije_Vozilo { get; set; }
        public string Broj_registarske_tablice_Vozilo { get; set; }
        public Nullable<decimal> Godina_proizvodnje_Vozilo { get; set; }
    
        public virtual ICollection<Stavka_u_realizaciji> Stavka_u_realizaciji { get; set; }
    }
}
