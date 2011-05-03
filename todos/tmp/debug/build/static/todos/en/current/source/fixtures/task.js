// ==========================================================================
// Project:   Todos.Task Fixtures
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Todos */

sc_require('models/task');

Todos.Task.FIXTURES = [

  { "guid": "task-1",

    "description": "Build the Plural Task Application",

    "isDone": false },

 

  { "guid": "task-2",

    "description": "Hook Plural Task application to z backend!",

    "isDone": false },

 
];
; if ((typeof SC !== 'undefined') && SC && SC.Module && SC.Module.scriptDidLoad) SC.Module.scriptDidLoad('todos');