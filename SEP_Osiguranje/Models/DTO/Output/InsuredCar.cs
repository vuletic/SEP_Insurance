﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SEP_Osiguranje.Models.DTO.Output
{
    public class InsuredCar
    {   

        public InsuredCar() { }
        public InsuredCar(VehicleData vehicleData)
        {

            if (vehicleData.accom > -1)
            {
                this.selectedHotelDays = (int) vehicleData.accom;
                this.hotel = true;
            }
            else
            {
                this.selectedHotelDays = 0;
                this.hotel = false;
            }


            if (vehicleData.repair > -1)
            {
                this.selectedReparationPrice = (int)vehicleData.repair;
                this.repairment = true;
            }
            else
            {
                this.selectedReparationPrice = 0;
                this.repairment = false;
            }

            if (vehicleData.tow > -1)
            {
                this.selectedTowingDistance = (int)vehicleData.tow;
                this.towing = true;
            }
            else
            {
                this.selectedTowingDistance = 0;
                this.towing = false;
            }

            if (vehicleData.ride > -1)
            {
                this.selectedAlternateTransportationDistance = (int)vehicleData.ride;
                this.alternativRide = true;
            }
            else
            {
                this.selectedAlternateTransportationDistance = 0;
                this.alternativRide = false;
            }
        }

        public Boolean alternativRide { get; set; }
        public Boolean hotel { get; set; }
        public Boolean towing { get; set; }
        public Boolean repairment { get; set; }
        public int selectedAlternateTransportationDistance { get; set; }
        public int selectedHotelDays { get; set; }
        public int selectedTowingDistance { get; set; }
        public int selectedReparationPrice { get; set; }

        public double price { get; set; }
    }
}