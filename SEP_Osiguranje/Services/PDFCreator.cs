﻿using System;
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

namespace SEP_Osiguranje.Services
{
    public class PDFCreator
    {
        private const string POLICY_NAME = "Holiday Guard";
        private const string ACCOUNT_EMAIL = "radi.molim.te@radi.com";

        public Document createDocument(Realizacija_osiguranja ro)
        {
            Document retDoc = new Document();
            retDoc.Info.Title = "Polisa broj " + ro.Id_Realizacija_osiguranja.ToString();
            retDoc.Info.Subject = "Polisa sa pojedinačnim stavkama koje utiču na cenu.";
            retDoc.Info.Author = POLICY_NAME + ", " + ACCOUNT_EMAIL;

            TextFrame addressFrame = new TextFrame();
            Table table = new Table();

            defineStyles(ref retDoc);
            createPage(ref retDoc, ro, ref addressFrame, ref table);
            fillContent(ref retDoc, ro, ref addressFrame, ref table);

            return retDoc;
        }

        private void defineStyles(ref Document doc)
        {
            Style style = doc.Styles["Normal"];

            style.Font.Name = "Verdana";

            style = doc.Styles[StyleNames.Header];
            style.ParagraphFormat.AddTabStop("5cm", TabAlignment.Right);

            style = doc.Styles[StyleNames.Footer];
            style.ParagraphFormat.AddTabStop("5cm", TabAlignment.Center);

            style = doc.Styles.AddStyle("Table", "Normal");
            style.Font.Name = "Verdana";
            style.Font.Name = "Times New Roman";

            style = doc.Styles.AddStyle("Reference", "Normal");
            style.ParagraphFormat.SpaceBefore = "5mm";
            style.ParagraphFormat.TabStops.AddTabStop("16cm", TabAlignment.Right);

        }

        private void createPage(ref Document doc, Realizacija_osiguranja ro, ref TextFrame addressFrame, ref Table table)
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
            paragraph.AddText(POLICY_NAME + " · " + "Park mira 2" + " · " + "Novi Sad");
            paragraph.AddLineBreak();
            paragraph.AddText("021/ 4540 - 021");
            paragraph.Format.Font.Size = 13;
            paragraph.Format.Font.Bold = true;
            paragraph.Format.Alignment = ParagraphAlignment.Center;

            // Create header
            paragraph = section.Headers.Primary.AddParagraph();
            paragraph.AddText(POLICY_NAME);
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
            Osoba o = ro.Stavka_u_realizaciji.Where(s => s.Nosilac_Stavka_u_realiziciji == true).FirstOrDefault().Osoba;

            Paragraph paragraph = addressFrame.AddParagraph();
            paragraph.AddFormattedText("Nosilac: ", TextFormat.Italic);
            paragraph.AddLineBreak();
            paragraph.AddText(o.Ime_Osoba + " " + o.Prezime_Osoba);
            paragraph.AddLineBreak();
            paragraph.AddText(o.Adresa_Osoba);
            paragraph.AddLineBreak();
            paragraph.AddText(o.E_mail_Osoba);

            int index = 0;
            for (int i = 0; i < ro.Stavka_u_realizaciji.Count; i++)
            {
                Stavka_u_realizaciji sur = ro.Stavka_u_realizaciji.ElementAt(i);
                if (!(sur.Nosilac_Stavka_u_realiziciji == true && sur.Vrednost_Stavka_u_realizaciji == 0))
                {
                    Row row1 = table.AddRow();
                    row1.Format.Font.Size = 10;
                    row1.TopPadding = 1.5;
                    row1.Cells[0].Shading.Color = new Color(242, 242, 242);
                    row1.Cells[2].Shading.Color = new Color(242, 242, 242);

                    row1.Cells[0].AddParagraph((index + 1).ToString());

                    if (sur.Osoba != null)
                    {
                        row1.Cells[1].AddParagraph(sur.Osoba.Ime_Osoba + " " + sur.Osoba.Prezime_Osoba + ", " + sur.Osoba.Broj_pasosa_Osoba);
                    }
                    else
                    {
                        if (sur.Nekretnina != null)
                        {
                            row1.Cells[1].AddParagraph("Nekretnina na adresi: " + sur.Nekretnina.Adresa_Nekretnina);
                        }
                        else
                        {
                            if (sur.Vozilo != null)
                            {
                                row1.Cells[1].AddParagraph("Vozilo sa brojem šasije: " + sur.Vozilo.Broj_sasije_Vozilo);
                            }
                        }
                    }


                    row1.Cells[2].AddParagraph(sur.Vrednost_Stavka_u_realizaciji.ToString());
                    index++;
                }
            }

            Row row2 = table.AddRow();
            row2.Format.Font.Size = 10;
            row2.Format.Font.Bold = true;
            row2.TopPadding = 1.5;
            row2.Shading.Color = new Color(242, 242, 242);

            row2.Cells[1].AddParagraph("Ukupna cena polise:");
            row2.Cells[2].AddParagraph(ro.Ukupna_vrednost_Realizacija_osiguranja.ToString());
        }

    }

}