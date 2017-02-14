using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using MigraDoc;
using PdfSharp;
using MigraDoc.DocumentObjectModel;
using MigraDoc.Rendering;
using MigraDoc.DocumentObjectModel.Shapes;
using MigraDoc.DocumentObjectModel.Tables;
using SEP_Osiguranje.Models;
using System.Data.Entity;

namespace SEP_Osiguranje.Services
{
    public class PDFCreator
    {
        private const string POLICY_NAME = "Holiday Guard";
        private const string ACCOUNT_EMAIL = "radi.molim.te@radi.com";

        public Document createDocument(Realizacija_osiguranja ro, string path)
        {
            Document retDoc = new Document();
            retDoc.Info.Title = "Polisa broj " + ro.Id_Realizacija_osiguranja.ToString();
            retDoc.Info.Subject = "Polisa sa pojedinačnim stavkama koje utiču na cenu.";
            retDoc.Info.Author = POLICY_NAME + ", " + ACCOUNT_EMAIL;

            TextFrame addressFrame = new TextFrame();
            Table table = new Table();

            defineStyles(ref retDoc);
            createPage(ref retDoc, ro, ref addressFrame, ref table, path);
            fillContent(ref retDoc, ro, ref addressFrame, ref table);

            return retDoc;
        }

        private void defineStyles(ref Document doc)
        {
            Style style = doc.Styles["Normal"];

            style.Font.Name = "Arial Unicode MS";

            style = doc.Styles[StyleNames.Header];
            style.ParagraphFormat.AddTabStop("5cm", TabAlignment.Right);

            style = doc.Styles[StyleNames.Footer];
            style.ParagraphFormat.AddTabStop("5cm", TabAlignment.Center);

            style = doc.Styles.AddStyle("Table", "Normal");
            style.Font.Name = "Arial Unicode MS";

            style = doc.Styles.AddStyle("Reference", "Normal");
            style.ParagraphFormat.SpaceBefore = "5mm";
            style.ParagraphFormat.TabStops.AddTabStop("16cm", TabAlignment.Right);

        }

        private void createPage(ref Document doc, Realizacija_osiguranja ro, ref TextFrame addressFrame, ref Table table, string path)
        {
            Section section = doc.AddSection();

            
            // Put a logo in the header TODO ako stignes
            Image image = section.Headers.Primary.AddImage(path);
            image.Height = "2.5cm";
            image.LockAspectRatio = true;
            image.RelativeVertical = RelativeVertical.Line;
            image.RelativeHorizontal = RelativeHorizontal.Margin;
            image.Top = ShapePosition.Top;
            image.Left = ShapePosition.Right;
            image.WrapFormat.Style = WrapStyle.Through;
            

            // Create footer
            Paragraph paragraph = section.Footers.Primary.AddParagraph();
            paragraph.AddText(POLICY_NAME + " · " + "Park mira 2" + " · " + "Novi Sad");
            paragraph.AddLineBreak();
            paragraph.AddText("021/ 4540 - 021");
            paragraph.Format.Font.Size = 13;
            paragraph.Format.Font.Bold = true;
            paragraph.Format.Alignment = ParagraphAlignment.Center;
            
            // Create the text frame for the address
            addressFrame = section.AddTextFrame();
            addressFrame.Height = "3.0cm";
            addressFrame.Width = "7.0cm";
            addressFrame.Left = ShapePosition.Left;
            addressFrame.RelativeHorizontal = RelativeHorizontal.Margin;
            addressFrame.Top = "5.0cm";
            addressFrame.RelativeVertical = RelativeVertical.Page;


            // Add the print date field
            paragraph = section.AddParagraph();
            paragraph = section.AddParagraph();
            paragraph.Format.SpaceBefore = "5cm";
            paragraph.Style = "Reference";
            paragraph.AddFormattedText("POLISA broj " + ro.Id_Realizacija_osiguranja, TextFormat.Bold);
            paragraph.AddTab();
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
            row.Format.Font.Size = 12;
            row.Shading.Color = new Color(235, 240, 249);
            row.Cells[0].AddParagraph("Broj");
            row.Cells[0].Format.Alignment = ParagraphAlignment.Center;
            row.Cells[0].VerticalAlignment = VerticalAlignment.Center;
            row.Cells[1].AddParagraph("Stavka");
            row.Cells[1].Format.Alignment = ParagraphAlignment.Center;
            row.Cells[0].VerticalAlignment = VerticalAlignment.Center;
            row.Cells[2].AddParagraph("Cena");
            row.Cells[2].Format.Alignment = ParagraphAlignment.Center;
            row.Cells[2].VerticalAlignment = VerticalAlignment.Center;

            table.SetEdge(0, 0, 3, 1, Edge.Box, BorderStyle.Single, 0.75, Color.Empty);
        }


        private void fillContent(ref Document doc, Realizacija_osiguranja ro, ref TextFrame addressFrame, ref Table table)
        {
            SEP_EntitiesB db1 = new SEP_EntitiesB();

            var sur1 = db1.Stavka_u_realizaciji.Where(s => s.Id_Realizacija_osiguranja == ro.Id_Realizacija_osiguranja).Where(s => s.Nosilac_Stavka_u_realiziciji == true).Include(s => s.Osoba).FirstOrDefault();
            Osoba o = db1.Osoba.Where(os => os.Id_Osigurani_entitet == sur1.Id_Osigurana_osoba).FirstOrDefault();

            Paragraph paragraph = addressFrame.AddParagraph();
            paragraph.AddText("Nosilac: ");
            paragraph.AddLineBreak();
            paragraph.AddText(o.Ime_Osoba + " " + o.Prezime_Osoba);
            paragraph.AddLineBreak();
            paragraph.AddText(o.Adresa_Osoba);
            paragraph.AddLineBreak();
            paragraph.AddText(o.E_mail_Osoba);

            var list_sur = db1.Stavka_u_realizaciji.Where(s => s.Id_Realizacija_osiguranja == ro.Id_Realizacija_osiguranja).Include(a => a.Osoba).Include(b => b.Nekretnina).Include(c => c.Nekretnina).ToList();
            int index = 0;
            for (int i = 0; i < list_sur.Count; i++)
            {
                Stavka_u_realizaciji sur = list_sur.ElementAt(i);
                if (!(sur.Nosilac_Stavka_u_realiziciji == true && sur.Vrednost_Stavka_u_realizaciji == 0))
                {
                    Row row1 = table.AddRow();
                    row1.Format.Font.Size = 10;
                    row1.TopPadding = 1.5;
                    row1.Cells[0].Shading.Color = new Color(242, 242, 242);
                    row1.Cells[2].Shading.Color = new Color(242, 242, 242);

                    row1.Cells[0].AddParagraph((index + 1).ToString());

                    if (sur.Id_Osigurana_osoba != null)
                    {
                        Osoba o_temp = db1.Osoba.Where(os => os.Id_Osigurani_entitet == sur.Id_Osigurana_osoba).FirstOrDefault();
                        row1.Cells[1].AddParagraph(o_temp.Ime_Osoba + " " + o_temp.Prezime_Osoba + ", " + o_temp.Broj_pasosa_Osoba);
                    }
                    else
                    {
                        if (sur.Id_Osigurana_nekretnina != null)
                        {
                            Nekretnina n_temp = db1.Nekretnina.Where(os => os.Id_Osigurani_entitet == sur.Id_Osigurana_nekretnina).FirstOrDefault();
                            row1.Cells[1].AddParagraph("Nekretnina na adresi: " + n_temp.Adresa_Nekretnina);
                        }
                        else
                        {
                            if (sur.Id_Osigurano_vozilo != null)
                            {
                                Vozilo v_temp = db1.Vozilo.Where(os => os.Id_Osigurani_entitet == sur.Id_Osigurano_vozilo).FirstOrDefault();
                                row1.Cells[1].AddParagraph("Vozilo sa brojem šasije: " + v_temp.Broj_sasije_Vozilo);
                            }
                        }
                    }


                    row1.Cells[2].AddParagraph(sur.Vrednost_Stavka_u_realizaciji.ToString() + " RSD");
                    index++;
                }
            }

            Row row2 = table.AddRow();
            row2.Format.Font.Size = 10;
            row2.Format.Font.Bold = true;
            row2.TopPadding = 1.5;
            row2.Shading.Color = new Color(242, 242, 242);

            row2.Cells[1].AddParagraph("Ukupna cena polise:");
            row2.Cells[2].AddParagraph(ro.Ukupna_vrednost_Realizacija_osiguranja.ToString() + " RSD");
        }

    }

}