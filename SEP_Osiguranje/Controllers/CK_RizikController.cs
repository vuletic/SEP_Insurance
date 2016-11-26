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
    public class CK_RizikController : ApiController
    {
        private SEP_Entities db = new SEP_Entities();

        // GET: api/CK_Rizik
        public IQueryable<CK_Rizik> GetCK_Rizik()
        {
            return db.CK_Rizik;
        }

        // GET: api/CK_Rizik/5
        [ResponseType(typeof(CK_Rizik))]
        public async Task<IHttpActionResult> GetCK_Rizik(decimal id)
        {
            CK_Rizik cK_Rizik = await db.CK_Rizik.FindAsync(id);
            if (cK_Rizik == null)
            {
                return NotFound();
            }

            return Ok(cK_Rizik);
        }

        // PUT: api/CK_Rizik/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutCK_Rizik(decimal id, CK_Rizik cK_Rizik)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cK_Rizik.Id_CK_Rizik)
            {
                return BadRequest();
            }

            db.Entry(cK_Rizik).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CK_RizikExists(id))
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

        // POST: api/CK_Rizik
        [ResponseType(typeof(CK_Rizik))]
        public async Task<IHttpActionResult> PostCK_Rizik(CK_Rizik cK_Rizik)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CK_Rizik.Add(cK_Rizik);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CK_RizikExists(cK_Rizik.Id_CK_Rizik))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = cK_Rizik.Id_CK_Rizik }, cK_Rizik);
        }

        // DELETE: api/CK_Rizik/5
        [ResponseType(typeof(CK_Rizik))]
        public async Task<IHttpActionResult> DeleteCK_Rizik(decimal id)
        {
            CK_Rizik cK_Rizik = await db.CK_Rizik.FindAsync(id);
            if (cK_Rizik == null)
            {
                return NotFound();
            }

            db.CK_Rizik.Remove(cK_Rizik);
            await db.SaveChangesAsync();

            return Ok(cK_Rizik);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CK_RizikExists(decimal id)
        {
            return db.CK_Rizik.Count(e => e.Id_CK_Rizik == id) > 0;
        }
    }
}