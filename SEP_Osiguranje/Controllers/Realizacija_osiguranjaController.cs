using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using SEP_Osiguranje.Models;

namespace SEP_Osiguranje.Controllers
{
    public class Realizacija_osiguranjaController : ApiController
    {
        private SEP_EntitiesB db = new SEP_EntitiesB();

        // GET: api/Realizacija_osiguranja
        public IQueryable<Realizacija_osiguranja> GetRealizacija_osiguranja()
        {
            return db.Realizacija_osiguranja;
        }

        // GET: api/Realizacija_osiguranja/5
        [ResponseType(typeof(Realizacija_osiguranja))]
        public async Task<IHttpActionResult> GetRealizacija_osiguranja(int id)
        {
            Realizacija_osiguranja realizacija_osiguranja = await db.Realizacija_osiguranja.FindAsync(id);
            if (realizacija_osiguranja == null)
            {
                return NotFound();
            }

            return Ok(realizacija_osiguranja);
        }
        /*
        // PUT: api/Realizacija_osiguranja/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutRealizacija_osiguranja(int id, Realizacija_osiguranja realizacija_osiguranja)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != realizacija_osiguranja.Id_Realizacija_osiguranja)
            {
                return BadRequest();
            }

            db.Entry(realizacija_osiguranja).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Realizacija_osiguranjaExists(id))
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

        // POST: api/Realizacija_osiguranja
        [ResponseType(typeof(Realizacija_osiguranja))]
        public async Task<IHttpActionResult> PostRealizacija_osiguranja(Realizacija_osiguranja realizacija_osiguranja)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Realizacija_osiguranja.Add(realizacija_osiguranja);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (Realizacija_osiguranjaExists(realizacija_osiguranja.Id_Realizacija_osiguranja))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = realizacija_osiguranja.Id_Realizacija_osiguranja }, realizacija_osiguranja);
        }

        // DELETE: api/Realizacija_osiguranja/5
        [ResponseType(typeof(Realizacija_osiguranja))]
        public async Task<IHttpActionResult> DeleteRealizacija_osiguranja(int id)
        {
            Realizacija_osiguranja realizacija_osiguranja = await db.Realizacija_osiguranja.FindAsync(id);
            if (realizacija_osiguranja == null)
            {
                return NotFound();
            }

            db.Realizacija_osiguranja.Remove(realizacija_osiguranja);
            await db.SaveChangesAsync();

            return Ok(realizacija_osiguranja);
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

        private bool Realizacija_osiguranjaExists(int id)
        {
            return db.Realizacija_osiguranja.Count(e => e.Id_Realizacija_osiguranja == id) > 0;
        }
    }
}