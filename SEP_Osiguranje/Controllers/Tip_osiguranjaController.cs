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
    public class Tip_osiguranjaController : ApiController
    {
        private SEP_Entities db = new SEP_Entities();

        // GET: api/Tip_osiguranja
        public IQueryable<Tip_osiguranja> GetTip_osiguranja()
        {
            return db.Tip_osiguranja;
        }

        // GET: api/Tip_osiguranja/5
        [ResponseType(typeof(Tip_osiguranja))]
        public async Task<IHttpActionResult> GetTip_osiguranja(decimal id)
        {
            Tip_osiguranja tip_osiguranja = await db.Tip_osiguranja.FindAsync(id);
            if (tip_osiguranja == null)
            {
                return NotFound();
            }

            return Ok(tip_osiguranja);
        }

        // PUT: api/Tip_osiguranja/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutTip_osiguranja(decimal id, Tip_osiguranja tip_osiguranja)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tip_osiguranja.Id_Tip_osiguranja)
            {
                return BadRequest();
            }

            db.Entry(tip_osiguranja).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tip_osiguranjaExists(id))
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

        // POST: api/Tip_osiguranja
        [ResponseType(typeof(Tip_osiguranja))]
        public async Task<IHttpActionResult> PostTip_osiguranja(Tip_osiguranja tip_osiguranja)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Tip_osiguranja.Add(tip_osiguranja);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (Tip_osiguranjaExists(tip_osiguranja.Id_Tip_osiguranja))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = tip_osiguranja.Id_Tip_osiguranja }, tip_osiguranja);
        }

        // DELETE: api/Tip_osiguranja/5
        [ResponseType(typeof(Tip_osiguranja))]
        public async Task<IHttpActionResult> DeleteTip_osiguranja(decimal id)
        {
            Tip_osiguranja tip_osiguranja = await db.Tip_osiguranja.FindAsync(id);
            if (tip_osiguranja == null)
            {
                return NotFound();
            }

            db.Tip_osiguranja.Remove(tip_osiguranja);
            await db.SaveChangesAsync();

            return Ok(tip_osiguranja);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Tip_osiguranjaExists(decimal id)
        {
            return db.Tip_osiguranja.Count(e => e.Id_Tip_osiguranja == id) > 0;
        }
    }
}