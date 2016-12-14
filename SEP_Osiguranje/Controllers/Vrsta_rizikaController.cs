using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using SEP_Osiguranje.Models;

namespace SEP_Osiguranje.Controllers
{
    public class Vrsta_rizikaController : ApiController
    {
        private SEP_Entities db = new SEP_Entities();

        // GET: api/Vrsta_rizika
        public IQueryable<Vrsta_rizika> GetVrsta_rizika()
        {
            return db.Vrsta_rizika;
        }

        // GET: api/Vrsta_rizika/5
        [ResponseType(typeof(Vrsta_rizika))]
        public async Task<IHttpActionResult> GetVrsta_rizika(decimal id)
        {
            Vrsta_rizika vrsta_rizika = await db.Vrsta_rizika.FindAsync(id);
            if (vrsta_rizika == null)
            {
                return NotFound();
            }

            return Ok(vrsta_rizika);
        }
        /*
        // PUT: api/Vrsta_rizika/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutVrsta_rizika(decimal id, Vrsta_rizika vrsta_rizika)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vrsta_rizika.Id_Vrsta_rizika)
            {
                return BadRequest();
            }

            db.Entry(vrsta_rizika).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Vrsta_rizikaExists(id))
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

        // POST: api/Vrsta_rizika
        [ResponseType(typeof(Vrsta_rizika))]
        public async Task<IHttpActionResult> PostVrsta_rizika(Vrsta_rizika vrsta_rizika)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Vrsta_rizika.Add(vrsta_rizika);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (Vrsta_rizikaExists(vrsta_rizika.Id_Vrsta_rizika))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = vrsta_rizika.Id_Vrsta_rizika }, vrsta_rizika);
        }

        // DELETE: api/Vrsta_rizika/5
        [ResponseType(typeof(Vrsta_rizika))]
        public async Task<IHttpActionResult> DeleteVrsta_rizika(decimal id)
        {
            Vrsta_rizika vrsta_rizika = await db.Vrsta_rizika.FindAsync(id);
            if (vrsta_rizika == null)
            {
                return NotFound();
            }

            db.Vrsta_rizika.Remove(vrsta_rizika);
            await db.SaveChangesAsync();

            return Ok(vrsta_rizika);
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

        private bool Vrsta_rizikaExists(decimal id)
        {
            return db.Vrsta_rizika.Count(e => e.Id_Vrsta_rizika == id) > 0;
        }
    }
}