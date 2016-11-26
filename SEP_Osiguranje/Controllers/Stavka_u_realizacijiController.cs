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
    public class Stavka_u_realizacijiController : ApiController
    {
        private SEP_Entities db = new SEP_Entities();

        // GET: api/Stavka_u_realizaciji
        public IQueryable<Stavka_u_realizaciji> GetStavka_u_realizaciji()
        {
            return db.Stavka_u_realizaciji;
        }

        // GET: api/Stavka_u_realizaciji/5
        [ResponseType(typeof(Stavka_u_realizaciji))]
        public async Task<IHttpActionResult> GetStavka_u_realizaciji(int id)
        {
            Stavka_u_realizaciji stavka_u_realizaciji = await db.Stavka_u_realizaciji.FindAsync(id);
            if (stavka_u_realizaciji == null)
            {
                return NotFound();
            }

            return Ok(stavka_u_realizaciji);
        }

        // PUT: api/Stavka_u_realizaciji/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutStavka_u_realizaciji(int id, Stavka_u_realizaciji stavka_u_realizaciji)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != stavka_u_realizaciji.Id_Stavka_u_realizaciji)
            {
                return BadRequest();
            }

            db.Entry(stavka_u_realizaciji).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Stavka_u_realizacijiExists(id))
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

        // POST: api/Stavka_u_realizaciji
        [ResponseType(typeof(Stavka_u_realizaciji))]
        public async Task<IHttpActionResult> PostStavka_u_realizaciji(Stavka_u_realizaciji stavka_u_realizaciji)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Stavka_u_realizaciji.Add(stavka_u_realizaciji);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (Stavka_u_realizacijiExists(stavka_u_realizaciji.Id_Stavka_u_realizaciji))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = stavka_u_realizaciji.Id_Stavka_u_realizaciji }, stavka_u_realizaciji);
        }

        // DELETE: api/Stavka_u_realizaciji/5
        [ResponseType(typeof(Stavka_u_realizaciji))]
        public async Task<IHttpActionResult> DeleteStavka_u_realizaciji(int id)
        {
            Stavka_u_realizaciji stavka_u_realizaciji = await db.Stavka_u_realizaciji.FindAsync(id);
            if (stavka_u_realizaciji == null)
            {
                return NotFound();
            }

            db.Stavka_u_realizaciji.Remove(stavka_u_realizaciji);
            await db.SaveChangesAsync();

            return Ok(stavka_u_realizaciji);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Stavka_u_realizacijiExists(int id)
        {
            return db.Stavka_u_realizaciji.Count(e => e.Id_Stavka_u_realizaciji == id) > 0;
        }
    }
}