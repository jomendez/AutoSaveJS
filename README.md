AutoSaveJS
==========

Auto save library using DataServiceJS and JQuery. This is an ASP.NET web site to demo how to implement AutoSaveJS with DataServiceJS, whit Web Api. This example uses Bootstrap for the UI. This is a VisualStudio 2013 project.

This is a snapt shot of how to implement the AutoSaveJS library:

```JavaScript
$(function () {
    //Example of comments using web api Url
    var Comments = autoSaveComments('#commentsTA',
        {
            saveUrl: 'api/Savetext/AutoSaveText',
            savingText: 'Saving...',
            savedText: 'Saved!',
            label: '.label'
        }
    );

});
```

Global.asax 
```CSharp
 void Application_Start(object sender, EventArgs e)
        {
           
            // Code that runs on application startup
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            RouteTable.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = System.Web.Http.RouteParameter.Optional }
            );
        }
```

SavetextController.cs Simple web api
```CSharp
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
```

This is the HTML
```HTML
  <div style="width: 100%; padding-top:20px">
        <div class="panel panel-default" style="margin: 0 auto; width: 700px;">
            <div class="panel-heading"><div>Enter comments <span class="label" style="color:black"> </span></div></div>
            <div class="panel-body">
                
                <textarea id="commentsTA" style="width:100%; height:200px"></textarea>
            </div>
        </div>
    </div>


        <div id="errorModal" class="modal fade">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title">Error</h4>
                    </div>
                    <div class="modal-body">
                        <p> Oooops... Something went wrong</p>
                        <small class="error-technical-details"></small>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Do something</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
```
