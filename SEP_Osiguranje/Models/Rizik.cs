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
    
    public partial class Rizik
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Rizik()
        {
            this.CK_Rizik = new HashSet<CK_Rizik>();
            this.Rizik_za_osigurani_entitet = new HashSet<Rizik_za_osigurani_entitet>();
        }
    
        public decimal Id_Rizik { get; set; }
        public decimal Id_Vrsta_rizika { get; set; }
        public string Naziv_Rizik { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CK_Rizik> CK_Rizik { get; set; }
        public virtual Vrsta_rizika Vrsta_rizika { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Rizik_za_osigurani_entitet> Rizik_za_osigurani_entitet { get; set; }
    }
}
