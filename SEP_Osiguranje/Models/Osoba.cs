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
    
    public partial class Osoba
    {
        public Osoba()
        {
            this.Stavka_u_realizaciji = new HashSet<Stavka_u_realizaciji>();
        }
    
        public int Id_Osigurani_entitet { get; set; }
        public decimal JMBG_Osoba { get; set; }
        public string Ime_Osoba { get; set; }
        public string Prezime_Osoba { get; set; }
        public string Broj_pasosa_Osoba { get; set; }
        public string Adresa_Osoba { get; set; }
        public string Broj_telefona_Osoba { get; set; }
        public string E_mail_Osoba { get; set; }
    
        public virtual ICollection<Stavka_u_realizaciji> Stavka_u_realizaciji { get; set; }
    }
}
