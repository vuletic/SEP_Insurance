using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using SEP_Osiguranje.Models;

namespace SEP_Osiguranje.Controllers
{
    public class PDVController : ApiController
    {
        private SEP_Entities db = new SEP_Entities();
        
        // GET: api/PDV
        public IQueryable<PDV> GetPDV()
        {
            return db.PDV;
        }

        // GET: api/PDV/5
        [ResponseType(typeof(PDV))]
        public IHttpActionResult GetPDV(short id)
        {
            PDV pDV = db.PDV.Find(id);
            if (pDV == null)
            {
                return NotFound();
            }

            return Ok(pDV);
        }
        /*
        // PUT: api/PDV/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPDV(short id, PDV pDV)
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
                db.SaveChanges();
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

        // POST: api/PDV
        [ResponseType(typeof(PDV))]
        public IHttpActionResult PostPDV(PDV pDV)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.PDV.Add(pDV);

            try
            {
                db.SaveChanges();
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

        // DELETE: api/PDV/5
        [ResponseType(typeof(PDV))]
        public IHttpActionResult DeletePDV(short id)
        {
            PDV pDV = db.PDV.Find(id);
            if (pDV == null)
            {
                return NotFound();
            }

            db.PDV.Remove(pDV);
            db.SaveChanges();

            return Ok(pDV);
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

        private bool PDVExists(short id)
        {
            return db.PDV.Count(e => e.Id_PDV == id) > 0;
        }
    }
}