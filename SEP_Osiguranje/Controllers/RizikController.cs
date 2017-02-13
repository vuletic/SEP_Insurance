using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using SEP_Osiguranje.Models;

namespace SEP_Osiguranje.Controllers
{
    public class RizikController : ApiController
    {
        private SEP_EntitiesB db = new SEP_EntitiesB();

        // GET: api/Rizik
        public IQueryable<Rizik> GetRizik()
        {
            return db.Rizik;
        }

        [ActionName("Vrsta")]
        public IQueryable<Rizik> GetRizikByVrsta(decimal id)
        {

            var query = from rizik in db.Rizik.Include("Prevod")
                                       where rizik.Id_Vrsta_rizika == id
                                       select rizik;

            return query;
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

        [ActionName("Id")]
        public IQueryable<Rizik> GetRizikById(decimal id)
        {

            var query = from rizik in db.Rizik.Include("Prevod")
                        where rizik.Id_Rizik == id
                        select rizik;

            return query;
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