using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using SEP_Osiguranje.Models;

namespace SEP_Osiguranje.Controllers
{
    public class NekretninaController : ApiController
    {
        private SEP_Entities db = new SEP_Entities();

        // GET: api/Nekretnina
        public IQueryable<Nekretnina> GetNekretnina()
        {
            return db.Nekretnina;
        }

        // GET: api/Nekretnina/5
        [ResponseType(typeof(Nekretnina))]
        public async Task<IHttpActionResult> GetNekretnina(int id)
        {
            Nekretnina nekretnina = await db.Nekretnina.FindAsync(id);
            if (nekretnina == null)
            {
                return NotFound();
            }

            return Ok(nekretnina);
        }
        /*
        // PUT: api/Nekretnina/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutNekretnina(int id, Nekretnina nekretnina)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != nekretnina.Id_Osigurani_entitet)
            {
                return BadRequest();
            }

            db.Entry(nekretnina).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NekretninaExists(id))
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

        // POST: api/Nekretnina
        [ResponseType(typeof(Nekretnina))]
        public async Task<IHttpActionResult> PostNekretnina(Nekretnina nekretnina)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Nekretnina.Add(nekretnina);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (NekretninaExists(nekretnina.Id_Osigurani_entitet))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = nekretnina.Id_Osigurani_entitet }, nekretnina);
        }

        // DELETE: api/Nekretnina/5
        [ResponseType(typeof(Nekretnina))]
        public async Task<IHttpActionResult> DeleteNekretnina(int id)
        {
            Nekretnina nekretnina = await db.Nekretnina.FindAsync(id);
            if (nekretnina == null)
            {
                return NotFound();
            }

            db.Nekretnina.Remove(nekretnina);
            await db.SaveChangesAsync();

            return Ok(nekretnina);
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

        private bool NekretninaExists(int id)
        {
            return db.Nekretnina.Count(e => e.Id_Osigurani_entitet == id) > 0;
        }
    }
}