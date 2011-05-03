Todos=SC.Application.create({NAMESPACE:"Todos",VERSION:"0.1.0",store:SC.Store.create({commitRecordsAutomatically:YES}).from("Todos.TaskDataSource")});
Todos.tasksController=SC.ArrayController.create(SC.CollectionViewDelegate,{summary:function(){var len=this.get("length"),ret;
if(len&&len>0){ret=len===1?"1 task":"%@ tasks".fmt(len)}else{ret="No tasks"}return ret
}.property("length").cacheable(),collectionViewDeleteContent:function(view,content,indexes){var records=indexes.map(function(idx){return this.objectAt(idx)
},this);records.invoke("destroy");var selIndex=indexes.get("min")-1;if(selIndex<0){selIndex=0
}this.selectObject(this.objectAt(selIndex))},addTask:function(){var task;task=Todos.store.createRecord(Todos.Task,{description:"New Task",isDone:false});
this.selectObject(task);this.invokeLater(function(){var contentIndex=this.indexOf(task);
var list=Todos.mainPage.getPath("mainPane.middleView.contentView");var listItem=list.itemViewForContentIndex(contentIndex);
listItem.beginEditing()});return YES},toggleDone:function(){var sel=this.get("selection");
sel.setEach("isDone",!sel.everyProperty("isDone"));return YES}});Todos.Task=SC.Record.extend({isDone:SC.Record.attr(Boolean),description:SC.Record.attr(String)});
sc_require("models/task");Todos.TASKS_QUERY=SC.Query.local(Todos.Task,{orderBy:"isDone,description"});
Todos.TaskDataSource=SC.DataSource.extend({fetch:function(store,query){if(query===Todos.TASKS_QUERY){SC.Request.getUrl("/todos-backend/tasks").header({Accept:"application/json"}).json().notify(this,"didFetchTasks",store,query).send();
return YES}return NO},didFetchTasks:function(response,store,query){if(SC.ok(response)){store.loadRecords(Todos.Task,response.get("body").content);
store.dataSourceDidFetchQuery(query)}else{store.dataSourceDidErrorQuery(query,response)
}},retrieveRecord:function(store,storeKey){if(SC.kindOf(store.recordTypeFor(storeKey),Todos.Task)){var url=store.idFor(storeKey);
SC.Request.getUrl(url).header({Accept:"application/json"}).json().notify(this,"didRetrieveTask",store,storeKey).send();
return YES}else{return NO}},didRetrieveTask:function(response,store,storeKey){if(SC.ok(response)){var dataHash=response.get("body").content;
store.dataSourceDidComplete(storeKey,dataHash)}else{store.dataSourceDidError(storeKey,response)
}},createRecord:function(store,storeKey){if(SC.kindOf(store.recordTypeFor(storeKey),Todos.Task)){SC.Request.postUrl("/todos-backend/tasks").header({Accept:"application/json"}).json().notify(this,this.didCreateTask,store,storeKey).send(store.readDataHash(storeKey));
return YES}else{return NO}},didCreateTask:function(response,store,storeKey){if(SC.ok(response)){var parser=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
var url=parser.exec(response.header("Location"))[8];store.dataSourceDidComplete(storeKey,null,url)
}else{store.dataSourceDidError(storeKey,response)}},updateRecord:function(store,storeKey){if(SC.kindOf(store.recordTypeFor(storeKey),Todos.Task)){SC.Request.putUrl(store.idFor(storeKey)).header({Accept:"application/json"}).json().notify(this,this.didUpdateTask,store,storeKey).send(store.readDataHash(storeKey));
return YES}else{return NO}},didUpdateTask:function(response,store,storeKey){if(SC.ok(response)){var data=response.get("body");
if(data){data=data.content}store.dataSourceDidComplete(storeKey,data)}else{store.dataSourceDidError(storeKey)
}},destroyRecord:function(store,storeKey){if(SC.kindOf(store.recordTypeFor(storeKey),Todos.Task)){SC.Request.deleteUrl(store.idFor(storeKey)).header({Accept:"application/json"}).json().notify(this,this.didDestroyTask,store,storeKey).send();
return YES}else{return NO}},didDestroyTask:function(response,store,storeKey){if(SC.ok(response)){store.dataSourceDidDestroy(storeKey)
}else{store.dataSourceDidError(response)}}});Todos.Theme=SC.AceTheme.create({name:"todos"});
SC.Theme.addTheme(Todos.Theme);SC.defaultTheme="todos";Todos.mainPage=SC.Page.design({mainPane:SC.MainPane.design({childViews:"middleView topView bottomView".w(),topView:SC.ToolbarView.design({layout:{top:0,left:0,right:0,height:36},childViews:"labelView addButton".w(),anchorLocation:SC.ANCHOR_TOP,labelView:SC.LabelView.design({layout:{centerY:0,height:24,left:8,width:200},controlSize:SC.LARGE_CONTROL_SIZE,fontWeight:SC.BOLD_WEIGHT,value:"Todos"}),addButton:SC.ButtonView.design({layout:{centerY:0,height:24,right:12,width:100},title:"Add Task",target:"Todos.tasksController",action:"addTask"})}),middleView:SC.ScrollView.design({hasHorizontalScroller:NO,layout:{top:36,bottom:32,left:0,right:0},backgroundColor:"white",contentView:SC.ListView.design({contentBinding:"Todos.tasksController.arrangedObjects",selectionBinding:"Todos.tasksController.selection",contentValueKey:"description",contentCheckboxKey:"isDone",rowHeight:21,target:"Todos.tasksController",action:"toggleDone"})}),bottomView:SC.ToolbarView.design({layout:{bottom:0,left:0,right:0,height:32},childViews:"summaryView".w(),anchorLocation:SC.ANCHOR_BOTTOM,summaryView:SC.LabelView.design({layout:{centerY:0,height:18,left:20,right:20},textAlign:SC.ALIGN_CENTER,valueBinding:"Todos.tasksController.summary"})})})});
Todos.main=function main(){Todos.getPath("mainPage.mainPane").append();var query=SC.Query.remote(Todos.Task,{orderBy:"isDone,description"});
var tasks=Todos.store.find(Todos.TASKS_QUERY);Todos.tasksController.set("content",tasks)
};function main(){Todos.main()};