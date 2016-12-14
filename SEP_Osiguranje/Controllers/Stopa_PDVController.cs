using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using SEP_Osiguranje.Models;

namespace SEP_Osiguranje.Controllers
{
    public class Stopa_PDVController : ApiController
    {
        private SEP_Entities db = new SEP_Entities();

        // GET: api/Stopa_PDV
        public IQueryable<Stopa_PDV> GetStopa_PDV()
        {
            return db.Stopa_PDV;
        }

        // GET: api/Stopa_PDV/5
        [ResponseType(typeof(Stopa_PDV))]
        public async Task<IHttpActionResult> GetStopa_PDV(short id)
        {
            Stopa_PDV stopa_PDV = await db.Stopa_PDV.FindAsync(id);
            if (stopa_PDV == null)
            {
                return NotFound();
            }

            return Ok(stopa_PDV);
        }
        /*
        // PUT: api/Stopa_PDV/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutStopa_PDV(short id, Stopa_PDV stopa_PDV)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != stopa_PDV.Id_Stopa_PDV)
            {
                return BadRequest();
            }

            db.Entry(stopa_PDV).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Stopa_PDVExists(id))
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

        // POST: api/Stopa_PDV
        [ResponseType(typeof(Stopa_PDV))]
        public async Task<IHttpActionResult> PostStopa_PDV(Stopa_PDV stopa_PDV)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Stopa_PDV.Add(stopa_PDV);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (Stopa_PDVExists(stopa_PDV.Id_Stopa_PDV))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = stopa_PDV.Id_Stopa_PDV }, stopa_PDV);
        }

        // DELETE: api/Stopa_PDV/5
        [ResponseType(typeof(Stopa_PDV))]
        public async Task<IHttpActionResult> DeleteStopa_PDV(short id)
        {
            Stopa_PDV stopa_PDV = await db.Stopa_PDV.FindAsync(id);
            if (stopa_PDV == null)
            {
                return NotFound();
            }

            db.Stopa_PDV.Remove(stopa_PDV);
            await db.SaveChangesAsync();

            return Ok(stopa_PDV);
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

        private bool Stopa_PDVExists(short id)
        {
            return db.Stopa_PDV.Count(e => e.Id_Stopa_PDV == id) > 0;
        }
    }
}