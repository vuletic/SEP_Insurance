using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using SEP_Osiguranje.Models;

namespace SEP_Osiguranje.Controllers
{
    public class VoziloController : ApiController
    {
        private SEP_Entities db = new SEP_Entities();

        // GET: api/Vozilo
        public IQueryable<Vozilo> GetVozilo()
        {
            return db.Vozilo;
        }

        // GET: api/Vozilo/5
        [ResponseType(typeof(Vozilo))]
        public async Task<IHttpActionResult> GetVozilo(int id)
        {
            Vozilo vozilo = await db.Vozilo.FindAsync(id);
            if (vozilo == null)
            {
                return NotFound();
            }

            return Ok(vozilo);
        }
        /*
        // PUT: api/Vozilo/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutVozilo(int id, Vozilo vozilo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vozilo.Id_Osigurani_entitet)
            {
                return BadRequest();
            }

            db.Entry(vozilo).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VoziloExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Vozilo
        [ResponseType(typeof(Vozilo))]
        public async Task<IHttpActionResult> PostVozilo(Vozilo vozilo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Vozilo.Add(vozilo);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (VoziloExists(vozilo.Id_Osigurani_entitet))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = vozilo.Id_Osigurani_entitet }, vozilo);
        }

        // DELETE: api/Vozilo/5
        [ResponseType(typeof(Vozilo))]
        public async Task<IHttpActionResult> DeleteVozilo(int id)
        {
            Vozilo vozilo = await db.Vozilo.FindAsync(id);
            if (vozilo == null)
            {
                return NotFound();
            }

            db.Vozilo.Remove(vozilo);
            await db.SaveChangesAsync();

            return Ok(vozilo);
        }
        */
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool VoziloExists(int id)
        {
            return db.Vozilo.Count(e => e.Id_Osigurani_entitet == id) > 0;
        }
    }
}