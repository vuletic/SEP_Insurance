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
    public class RizikController : ApiController
    {
        private SEP_Entities db = new SEP_Entities();

        // GET: api/Rizik
        public IQueryable<Rizik> GetRizik()
        {
            return db.Rizik;
        }

        // GET: api/Rizik/5
        [ResponseType(typeof(Rizik))]
        public async Task<IHttpActionResult> GetRizik(decimal id)
        {
            Rizik rizik = await db.Rizik.FindAsync(id);
            if (rizik == null)
            {
                return NotFound();
            }

            return Ok(rizik);
        }
        /*
        // PUT: api/Rizik/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutRizik(decimal id, Rizik rizik)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != rizik.Id_Rizik)
            {
                return BadRequest();
            }

            db.Entry(rizik).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RizikExists(id))
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

        // POST: api/Rizik
        [ResponseType(typeof(Rizik))]
        public async Task<IHttpActionResult> PostRizik(Rizik rizik)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Rizik.Add(rizik);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RizikExists(rizik.Id_Rizik))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = rizik.Id_Rizik }, rizik);
        }

        // DELETE: api/Rizik/5
        [ResponseType(typeof(Rizik))]
        public async Task<IHttpActionResult> DeleteRizik(decimal id)
        {
            Rizik rizik = await db.Rizik.FindAsync(id);
            if (rizik == null)
            {
                return NotFound();
            }

            db.Rizik.Remove(rizik);
            await db.SaveChangesAsync();

            return Ok(rizik);
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

        private bool RizikExists(decimal id)
        {
            return db.Rizik.Count(e => e.Id_Rizik == id) > 0;
        }
    }
}