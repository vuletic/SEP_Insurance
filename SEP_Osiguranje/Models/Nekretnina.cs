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
    
    public partial class Nekretnina
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Nekretnina()
        {
            this.Stavka_u_realizaciji = new HashSet<Stavka_u_realizaciji>();
        }
    
        public int Id_Osigurani_entitet { get; set; }
        public string JMBG_vlasnik_Nekretnina { get; set; }
        public string Adresa_Nekretnina { get; set; }
        public string Ime_vlasnik_Nekretnina { get; set; }
        public string Prezime_vlasnik_Nekretnina { get; set; }
        public decimal Povrsina_Nekretnina { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Stavka_u_realizaciji> Stavka_u_realizaciji { get; set; }
    }
}
