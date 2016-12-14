using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using SEP_Osiguranje.Models;

namespace SEP_Osiguranje.Controllers
{
    public class OsobaController : ApiController
    {
        private SEP_Entities db = new SEP_Entities();

        // GET: api/Osoba
        public IQueryable<Osoba> GetOsoba()
        {
            return db.Osoba;
        }

        // GET: api/Osoba/5
        [ResponseType(typeof(Osoba))]
        public async Task<IHttpActionResult> GetOsoba(int id)
        {
            Osoba osoba = await db.Osoba.FindAsync(id);
            if (osoba == null)
            {
                return NotFound();
            }

            return Ok(osoba);
        }
        /*
        // PUT: api/Osoba/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutOsoba(int id, Osoba osoba)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != osoba.Id_Osigurani_entitet)
            {
                return BadRequest();
            }

            db.Entry(osoba).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OsobaExists(id))
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

        // POST: api/Osoba
        [ResponseType(typeof(Osoba))]
        public async Task<IHttpActionResult> PostOsoba(Osoba osoba)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Osoba.Add(osoba);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (OsobaExists(osoba.Id_Osigurani_entitet))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = osoba.Id_Osigurani_entitet }, osoba);
        }

        // DELETE: api/Osoba/5
        [ResponseType(typeof(Osoba))]
        public async Task<IHttpActionResult> DeleteOsoba(int id)
        {
            Osoba osoba = await db.Osoba.FindAsync(id);
            if (osoba == null)
            {
                return NotFound();
            }

            db.Osoba.Remove(osoba);
            await db.SaveChangesAsync();

            return Ok(osoba);
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

        private bool OsobaExists(int id)
        {
            return db.Osoba.Count(e => e.Id_Osigurani_entitet == id) > 0;
        }
    }
}