using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using SEP_Osiguranje.Models;

namespace SEP_Osiguranje.Controllers
{
    public class Rizik_za_osigurani_entitetController : ApiController
    {
        private SEP_EntitiesB db = new SEP_EntitiesB();

        // GET: api/Rizik_za_osigurani_entitet
        public IQueryable<Rizik_za_osigurani_entitet> GetRizik_za_osigurani_entitet()
        {
            return db.Rizik_za_osigurani_entitet;
        }

        // GET: api/Rizik_za_osigurani_entitet/5
        [ResponseType(typeof(Rizik_za_osigurani_entitet))]
        public async Task<IHttpActionResult> GetRizik_za_osigurani_entitet(int id)
        {
            Rizik_za_osigurani_entitet rizik_za_osigurani_entitet = await db.Rizik_za_osigurani_entitet.FindAsync(id);
            if (rizik_za_osigurani_entitet == null)
            {
                return NotFound();
            }

            return Ok(rizik_za_osigurani_entitet);
        }
        /*
        // PUT: api/Rizik_za_osigurani_entitet/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutRizik_za_osigurani_entitet(int id, Rizik_za_osigurani_entitet rizik_za_osigurani_entitet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != rizik_za_osigurani_entitet.Id_Rizik_za_osigurani_entitet)
            {
                return BadRequest();
            }

            db.Entry(rizik_za_osigurani_entitet).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Rizik_za_osigurani_entitetExists(id))
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

        // POST: api/Rizik_za_osigurani_entitet
        [ResponseType(typeof(Rizik_za_osigurani_entitet))]
        public async Task<IHttpActionResult> PostRizik_za_osigurani_entitet(Rizik_za_osigurani_entitet rizik_za_osigurani_entitet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Rizik_za_osigurani_entitet.Add(rizik_za_osigurani_entitet);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (Rizik_za_osigurani_entitetExists(rizik_za_osigurani_entitet.Id_Rizik_za_osigurani_entitet))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = rizik_za_osigurani_entitet.Id_Rizik_za_osigurani_entitet }, rizik_za_osigurani_entitet);
        }

        // DELETE: api/Rizik_za_osigurani_entitet/5
        [ResponseType(typeof(Rizik_za_osigurani_entitet))]
        public async Task<IHttpActionResult> DeleteRizik_za_osigurani_entitet(int id)
        {
            Rizik_za_osigurani_entitet rizik_za_osigurani_entitet = await db.Rizik_za_osigurani_entitet.FindAsync(id);
            if (rizik_za_osigurani_entitet == null)
            {
                return NotFound();
            }

            db.Rizik_za_osigurani_entitet.Remove(rizik_za_osigurani_entitet);
            await db.SaveChangesAsync();

            return Ok(rizik_za_osigurani_entitet);
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

        private bool Rizik_za_osigurani_entitetExists(int id)
        {
            return db.Rizik_za_osigurani_entitet.Count(e => e.Id_Rizik_za_osigurani_entitet == id) > 0;
        }
    }
}