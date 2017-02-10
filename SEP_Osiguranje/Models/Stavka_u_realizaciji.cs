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
    
    public partial class Stavka_u_realizaciji
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Stavka_u_realizaciji()
        {
            this.Rizik_za_osigurani_entitet = new HashSet<Rizik_za_osigurani_entitet>();
        }
    
        public int Id_Stavka_u_realizaciji { get; set; }
        public int Id_Realizacija_osiguranja { get; set; }
        public Nullable<int> Id_Osigurana_osoba { get; set; }
        public Nullable<int> Id_Osigurana_nekretnina { get; set; }
        public Nullable<int> Id_Osigurano_vozilo { get; set; }
        public Nullable<bool> Nosilac_Stavka_u_realiziciji { get; set; }
        public decimal Vrednost_Stavka_u_realizaciji { get; set; }
    
        public virtual Nekretnina Nekretnina { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Rizik_za_osigurani_entitet> Rizik_za_osigurani_entitet { get; set; }
        public virtual Vozilo Vozilo { get; set; }
        public virtual Osoba Osoba { get; set; }
        public virtual Realizacija_osiguranja Realizacija_osiguranja { get; set; }
    }
}
