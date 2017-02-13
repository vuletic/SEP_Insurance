using PayPal.PayPalAPIInterfaceService;
using PayPal.PayPalAPIInterfaceService.Model;
using SEP_Osiguranje.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Linq;
using System.Net.Mail;

using MigraDoc;
using PdfSharp;
using MigraDoc.DocumentObjectModel;
using MigraDoc.Rendering;
using MigraDoc.DocumentObjectModel.Shapes;
using MigraDoc.DocumentObjectModel.Tables;
using SEP_Osiguranje.Services;
using System.Data.Entity;

namespace SEP_Osiguranje.Controllers
{
    public class PaypalController : ApiController
    {
        private SEP_EntitiesB db = new SEP_EntitiesB();
        private SEP_EntitiesB db2 = new SEP_EntitiesB();
        private SEP_EntitiesB db3 = new SEP_EntitiesB();

        private const string POLICY_NAME = "Holiday Guard";
        private const string ACCOUNT_EMAIL = "radi.molim.te@radi.com";

        public async void PostPaypal()
        {
            var verificationResp = string.Empty;

            try
            {
                HttpWebRequest verificationReq = WebRequest.Create("https://www.sandbox.paypal.com/cgi-bin/webscr") as HttpWebRequest;

                verificationReq.Method = "POST";
                verificationReq.ContentType = "application/x-www-form-urlencoded";
                var param = await Request.Content.ReadAsByteArrayAsync();
                string strRequest = Encoding.ASCII.GetString(param);
                strRequest = "cmd=_notify-validate&" + strRequest;
                verificationReq.ContentLength = strRequest.Length;

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var streamOut = new StreamWriter(verificationReq.GetRequestStream(), Encoding.ASCII);
                streamOut.Write(strRequest);
                streamOut.Close();

                var streamIn = new StreamReader(verificationReq.GetResponse().GetResponseStream());
                verificationResp = streamIn.ReadToEnd();
                streamIn.Close();

                ProcessVerificationResponse(verificationResp, strRequest);
            }
            catch (Exception e)
            {
                Console.Write(e);// zapisati zasto je doslo do greske...
            }
        }

        private void ProcessVerificationResponse(string response, string paymentDetails)
        {
            // postoji i polje "payment_date", (svi podaci o uplatiocu(ime, prezime, adresa))

            Dictionary<string, string> details = organizeDetails(paymentDetails);
            if (response.Equals("VERIFIED"))
            {
                if (!details.ContainsKey("receiver_email") || !details.ContainsKey("payment_status") || !details.ContainsKey("item_name") || !details.ContainsKey("item_number"))
                    return; // ukoliko nam nije dostupan neki od osnovnih podataka

                if (!details["receiver_email"].Equals(ACCOUNT_EMAIL))
                    return; // transakcija nije namenjena meni

                if (!details["payment_status"].Equals("Completed"))
                    return; // nije prosla transakcija

                if (!details["item_name"].Equals(POLICY_NAME))
                    return; // nije placeno osiguranje vec nesto drugo


                string policyIdStr = details["item_number"];
                int policyId = Int32.Parse(policyIdStr);
                

                string currency = "", ammount = "";
                if (details.ContainsKey("mc_currency"))
                    currency = details["mc_currency"];

                if (details.ContainsKey("mc_gross"))
                    ammount = details["mc_gross"];

                
                // upisati u bazu za odgovarajucu polisu da je placanje izvrseno
                // upisati u bazu za odgovarajucu polisu id transakcije

                // nadji datu polisu u bazi
                Realizacija_osiguranja ro = db.Realizacija_osiguranja.Where(r => r.Id_Realizacija_osiguranja == policyId).FirstOrDefault();//.Include(s => s.Stavka_u_realizaciji)
                if (ro != null)
                {
                    // proveriti da li se valuta i placeni iznos poklapaju sa ocekivanim
                    //if (ro.Ukupna_vrednost_Realizacija_osiguranja.Equals(Decimal.Parse(ammount))) Zakomentarisano zbog konverzije evro-dinar, nikada vise nece biti isto :D
                    //{
                        if (!ro.Potvrdjena_Realizacija_osiguranja)
                        {
                            ro.Potvrdjena_Realizacija_osiguranja = true;
                            ro.Broj_transakcije_Realizacija_osiguranja = details["txn_id"];

                            db.SaveChanges();

                            try
                            {
                                
                                var sur = db2.Stavka_u_realizaciji.Where(s => s.Id_Realizacija_osiguranja == ro.Id_Realizacija_osiguranja).Where(s => s.Nosilac_Stavka_u_realiziciji == true).Include(s => s.Osoba).FirstOrDefault();
                                var osoba = db2.Osoba.Where(o=> o.Id_Osigurani_entitet == sur.Id_Osigurana_osoba).FirstOrDefault();

                                if (osoba != null)
                                {
                                    var mail_carr = osoba.E_mail_Osoba;

                                    //Kreiranje pdf-a
                                    //slanje mail-a
                                    PDFCreator creator = new PDFCreator();

                                    var fullPath = System.Web.HttpContext.Current.Server.MapPath("../fonts/logo.png");
                                    Document doc = creator.createDocument(ro, fullPath);
                                    PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(true);
                                    pdfRenderer.Document = doc;
                                    pdfRenderer.RenderDocument();

                                    MemoryStream ms = new MemoryStream();
                                    pdfRenderer.Save(ms, false);
                                    ms.Position = 0;


                                    NetworkCredential basicCredential = new NetworkCredential("nikola58tod@gmail.com", "hasansakic");
                                    MailMessage mail = new MailMessage();
                                    SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");

                                    mail.From = new MailAddress("nikola58tod@gmail.com");
                                    mail.To.Add(mail_carr);
                                    mail.Subject = "Polisa osiguranja - Holiday Guard";
                                    mail.Body = "Pozdrav, \n šaljemo vam vašu polisu jer ste naznačeni kao nosilac. Za sve informacije možete se obratiti na telefon 021/ 4540 021. \n Svako dobro, \n Vaš Holiday Guard!";
                                    mail.Attachments.Add(new Attachment(ms, "polisa.pdf", "application/pdf"));


                                    SmtpServer.Port = 587;
                                    SmtpServer.Credentials = basicCredential;
                                    SmtpServer.EnableSsl = true;


                                    SmtpServer.Send(mail);

                                    ms.Close();
                                }
                            }
                            catch (Exception e)
                            {
                                Console.Write(e); // Log...
                                Console.Write(e.InnerException);
                            }
                        }
                    //}
                }

            }
            else
            {
                //upisati u redovan log
                //upisati u log potencijalnih opasnosti

                string email = "", status = "";
                if (details.ContainsKey("payer_email"))
                    email = details["payer_email"];
                if (details.ContainsKey("payer_status"))
                    status = details["payer_status"];       // da li ima verifikovan nalog na paypal-u
            }
        }

        private Dictionary<string, string> organizeDetails(string detailsList)
        {
            detailsList = HttpUtility.UrlDecode(detailsList);
            Dictionary<string, string> dictionary = new Dictionary<string, string>();
            String[] details = detailsList.Split('&');
            foreach (string detail in details)
            {
                String[] data = detail.Split('=');
                dictionary.Add(data[0], data[1]);
            }
            return dictionary;
        }


        private Document createDocument(Realizacija_osiguranja ro)
        {
            Document retDoc = new Document();
            retDoc.Info.Title = "Polisa broj " + ro.Id_Realizacija_osiguranja.ToString();
            retDoc.Info.Subject = "Polisa sa pojedinačnim stavkama koje utiču na cenu.";
            retDoc.Info.Author = POLICY_NAME + ", " + ACCOUNT_EMAIL;

            TextFrame addressFrame = new TextFrame();
            Table table = new Table();

            retDoc = defineStyles(retDoc);
            retDoc = createPage(retDoc, addressFrame, table);
            retDoc = fillContent(retDoc, ro, addressFrame, table);
            
            return retDoc;
        }

        private Document defineStyles(Document doc)
        {
            Style style = doc.Styles["Normal"];

            style.Font.Name = "Verdana";

            style = doc.Styles[StyleNames.Header];
            style.ParagraphFormat.AddTabStop("16cm", TabAlignment.Right);

            style = doc.Styles[StyleNames.Footer];
            style.ParagraphFormat.AddTabStop("8cm", TabAlignment.Center);


            style = doc.Styles.AddStyle("Table", "Normal");
            style.Font.Name = "Verdana";
            style.Font.Name = "Times New Roman";
            style.Font.Size = 9;

            style = doc.Styles.AddStyle("Reference", "Normal");
            style.ParagraphFormat.SpaceBefore = "5mm";
            style.ParagraphFormat.SpaceAfter = "5mm";
            style.ParagraphFormat.TabStops.AddTabStop("16cm", TabAlignment.Right);

            return doc;
        }

        private Document createPage(Document doc, TextFrame addressFrame, Table table)
        {
            Section section = doc.AddSection();
            
            /*
            // Put a logo in the header TODO ako stignes
            Image image = section.Headers.Primary.AddImage("../../PowerBooks.png");
            image.Height = "2.5cm";
            image.LockAspectRatio = true;
            image.RelativeVertical = RelativeVertical.Line;
            image.RelativeHorizontal = RelativeHorizontal.Margin;
            image.Top = ShapePosition.Top;
            image.Left = ShapePosition.Right;
            image.WrapFormat.Style = WrapStyle.Through;
            */
            
            // Create footer
            Paragraph paragraph = section.Footers.Primary.AddParagraph();
            paragraph.AddText(POLICY_NAME);
            paragraph.Format.Font.Size = 10;
            paragraph.Format.Alignment = ParagraphAlignment.Center;

            // Create the text frame for the address
            addressFrame = section.AddTextFrame();
            addressFrame.Height = "3.0cm";
            addressFrame.Width = "7.0cm";
            addressFrame.Left = ShapePosition.Left;
            addressFrame.RelativeHorizontal = RelativeHorizontal.Margin;
            addressFrame.Top = "5.0cm";
            addressFrame.RelativeVertical = RelativeVertical.Page;

            
            // Put sender in address frame
            paragraph = addressFrame.AddParagraph(POLICY_NAME + " · Trg sveprisutnih 1 · 21000 Novi Sad");
            paragraph.Format.Font.Name = "Times New Roman";
            paragraph.Format.Font.Size = 7;
            paragraph.Format.SpaceAfter = 3;
            

            // Add the print date field
            paragraph = section.AddParagraph();
            paragraph.Format.SpaceBefore = "8cm";
            paragraph.Style = "Reference";
            paragraph.AddFormattedText("POLISA", TextFormat.Bold);
            paragraph.AddTab();
            paragraph.AddText("Subotica, ");
            paragraph.AddDateField("dd.MM.yyyy");


            // Create the item table
            table = section.AddTable();
            table.Style = "Table";
            table.Borders.Color = new Color(81, 125, 192);
            table.Borders.Width = 0.25;
            table.Borders.Left.Width = 0.5;
            table.Borders.Right.Width = 0.5;
            table.Rows.LeftIndent = 0;


            // Before you can add a row, you must define the columns
            Column column = table.AddColumn("1.5cm");//broj stavke
            column.Format.Alignment = ParagraphAlignment.Center;

            column = table.AddColumn("11cm");//stavka - Ime, prezime, JMBG, broj pasosa
            column.Format.Alignment = ParagraphAlignment.Center;

            column = table.AddColumn("3.5cm");//cena
            column.Format.Alignment = ParagraphAlignment.Center;

            // Create the header of the table
            Row row = table.AddRow();
            row.HeadingFormat = true;
            row.Format.Alignment = ParagraphAlignment.Center;
            row.Format.Font.Bold = true;
            row.Shading.Color = new Color(235, 240, 249);
            row.Cells[0].AddParagraph("Broj");
            row.Cells[0].Format.Font.Bold = false;
            row.Cells[0].Format.Alignment = ParagraphAlignment.Left;
            row.Cells[0].VerticalAlignment = VerticalAlignment.Bottom;
            //row.Cells[0].MergeDown = 1;
            row.Cells[1].AddParagraph("Stavka");
            row.Cells[1].Format.Alignment = ParagraphAlignment.Left;
            //row.Cells[1].MergeRight = 3;
            row.Cells[2].AddParagraph("Cena");
            row.Cells[2].Format.Alignment = ParagraphAlignment.Left;
            row.Cells[2].VerticalAlignment = VerticalAlignment.Bottom;
            //row.Cells[2].MergeDown = 1;

            table.SetEdge(0, 0, 6, 2, Edge.Box, BorderStyle.Single, 0.75, Color.Empty);

            return doc;
        }


        private Document fillContent(Document doc, Realizacija_osiguranja ro, TextFrame addressFrame, Table table)
        {
            Osoba o = ro.Stavka_u_realizaciji.Where(s => s.Nosilac_Stavka_u_realiziciji == true).FirstOrDefault().Osoba;

            Paragraph paragraph = addressFrame.AddParagraph();
            paragraph.AddText(o.Ime_Osoba + " " + o.Prezime_Osoba);
            paragraph.AddLineBreak();
            paragraph.AddText(o.Adresa_Osoba);
            paragraph.AddLineBreak();
            paragraph.AddText(o.E_mail_Osoba);

            Row row;
            for (int i = 0; i < ro.Stavka_u_realizaciji.Count; i++)
            {
                Stavka_u_realizaciji sur = ro.Stavka_u_realizaciji.ElementAt(i);

                row = table.AddRow();
                row.TopPadding = 1.5;
                row.Cells[0].Shading.Color = new Color(242, 242, 242);
                row.Cells[2].Shading.Color = new Color(242, 242, 242);

                row.Cells[0].AddParagraph((i+1).ToString());

                if (sur.Osoba != null)
                {
                    row.Cells[1].AddParagraph(sur.Osoba.Ime_Osoba + " " +  sur.Osoba.Prezime_Osoba + ", " + sur.Osoba.Broj_pasosa_Osoba);
                }
                else
                {
                    if (sur.Nekretnina != null)
                    {
                        row.Cells[1].AddParagraph("Nekretnina na adresi: " + sur.Nekretnina.Adresa_Nekretnina);
                    }
                    else
                    {
                        if (sur.Vozilo != null)
                        {
                            row.Cells[1].AddParagraph("Vozilo sa brojem šasije: " + sur.Vozilo.Broj_sasije_Vozilo);
                        }
                    }
                }


                row.Cells[2].AddParagraph(sur.Vrednost_Stavka_u_realizaciji.ToString());
            }


            row = table.AddRow();
            row.TopPadding = 1.5;
            row.Shading.Color = new Color(242, 242, 242);

            row.Cells[1].AddParagraph("Ukupna cena polise: " + ro.Ukupna_vrednost_Realizacija_osiguranja);

            return doc;
        }
    }
}
