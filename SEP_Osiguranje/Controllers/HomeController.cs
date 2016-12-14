using System.Web.Mvc;

namespace SEP_Osiguranje.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            /*using (var dbCtx = new SEP_Entities())
            {   
                
             
                Random rnd = new Random();
                int r = rnd.Next(1000);
                dbCtx.Vozilo.Add(new Vozilo() { Broj_registarske_tablice_Vozilo = "6666", Broj_sasije_Vozilo = "12121",  Godina_proizvodnje_Vozilo = 1982, Id_Osigurani_entitet = r, Ime_Vlasnik_Vozilo = "Djovak", JMBG_Vlasnik_Vozilo = "1231", Prezime_Vlasnik_Vozilo = "Njokovic" });

              
                dbCtx.SaveChanges();
                
            }*/

            return View();
        }
    }
}
