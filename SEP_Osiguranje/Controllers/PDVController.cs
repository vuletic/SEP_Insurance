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
    public class PDVController : ApiController
    {
        private SEP_Entities db = new SEP_Entities();

        // GET: api/PDVs
        public IQueryable<PDV> GetPDV()
        {
            return db.PDV;
        }

        // GET: api/PDVs/5
        [ResponseType(typeof(PDV))]
        public async Task<IHttpActionResult> GetPDV(short id)
        {
            PDV pDV = await db.PDV.FindAsync(id);
            if (pDV == null)
            {
                return NotFound();
            }

            return Ok(pDV);
        }

        // PUT: api/PDVs/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutPDV(short id, PDV pDV)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pDV.Id_PDV)
            {
                return BadRequest();
            }

            db.Entry(pDV).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PDVExists(id))
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

        // POST: api/PDVs
        [ResponseType(typeof(PDV))]
        public async Task<IHttpActionResult> PostPDV(PDV pDV)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.PDV.Add(pDV);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PDVExists(pDV.Id_PDV))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = pDV.Id_PDV }, pDV);
        }

        // DELETE: api/PDVs/5
        [ResponseType(typeof(PDV))]
        public async Task<IHttpActionResult> DeletePDV(short id)
        {
            PDV pDV = await db.PDV.FindAsync(id);
            if (pDV == null)
            {
                return NotFound();
            }

            db.PDV.Remove(pDV);
            await db.SaveChangesAsync();

            return Ok(pDV);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PDVExists(short id)
        {
            return db.PDV.Count(e => e.Id_PDV == id) > 0;
        }
    }
}