﻿using System.Web.Http;
using System.Web.Http.Cors;

namespace SEP_Osiguranje
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
           /* var corsAttr = new EnableCorsAttribute("https://sepruleapi.azurewebsites.net", "*", "*");
            config.EnableCors(corsAttr);*/
            config.EnableCors();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
              name: "ActionApi",
              routeTemplate: "api/{controller}/{action}/{id}",
              defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            

        }
    }
}
