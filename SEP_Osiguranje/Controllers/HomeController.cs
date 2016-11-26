using SEP_Osiguranje.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SEP_Osiguranje.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            using (var dbCtx = new SEP_Entities())
            {
                //Add Student object into Students DBset
                Random rnd = new Random();
                int r = rnd.Next(1000);
                dbCtx.Vozilo.Add(new Vozilo() { Broj_registarske_tablice_Vozilo = "1111", Broj_sasije_Vozilo = "123",  Godina_proizvodnje_Vozilo = 2015, Id_Osigurani_entitet = r, Ime_Vlasnik_Vozilo = "zora", JMBG_Vlasnik_Vozilo = "1231", Prezime_Vlasnik_Vozilo = "prza" });

                // call SaveChanges method to save student into database
                dbCtx.SaveChanges();
            }

            return View();
        }
    }
}
