using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebApplication1.api
{
    public class Wrapper 
    {
        public string textToSave;
    }

    public class SavetextController : ApiController
    {


        [HttpPost]
        public string AutoSaveText(Wrapper obj)
        {
            return obj.textToSave;
        }
    }
}
