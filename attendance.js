 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/attendance'
  , rewrites : 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  }
  ;

ddoc.views = {};
ddoc.lists = {};
ddoc.shows = {};

ddoc.views.byCollection = {
	map: function(doc){
		if(doc.collection){
			emit(doc.collection, doc);
		}
	}
}

ddoc.views.students = {
	map: function(doc) {
		if(doc.collection == "students") {
			emit(doc.collection, doc);
		}
	}
}

ddoc.views.classes = {
	map:function(doc) {
		if(doc.collection == "classes"){
			emit(doc.date, doc);
		}
	}
}

ddoc.views.classesByStudent = {
	map:function(doc){
		if(doc.collection == 'classes'){
			for(var i in doc.students){
				emit([doc.students[i], doc.date], doc);
			}
		}
	}
}

ddoc.views.trainingDaysByStudent = {
	map:function(doc){
		if(doc.collection == 'classes'){
			for(var i in doc.students){
				emit([doc.students[i],doc.date], doc);
			}
		}
	},
	"reduce":"_count"
}

ddoc.lists.classesSinceLastRank = function(head,req) {
	
	format_date = function(date){
		var today = new Date(); 
		var dd = today.getDate(); 
		var mm = today.getMonth()+1;//January is 0!
		var yyyy = today.getFullYear(); 
		if(dd<10){dd='0'+dd} 
		if(mm<10){mm='0'+mm} 
		return yyyy+'-'+mm+'-'+dd;		
	};

	start({headers: {"Content-type": ""}});
	var total_classes = 0;
	var student = req.query.student;
	var start_date = req.query.start_date;
	if(start_date == null) { start_date = format_date(new Date())}
	var end_date = req.query.end_date;
	if(end_date == null) {end_date = format_date(new Date())}
    while(row = getRow()) {
		var doc = row.value
		var student_key = row.key[0]
		var date_key = row.key[1]
		if(student_key == student && date_key >= start_date && date_key <= end_date){
			total_classes = total_classes + 1;
		}
    }
    send("{\"total_classes\":" + total_classes +"}");
}

ddoc.filters = {
	byCollection: function(doc, req){
		if(doc.collection && req.query &&req.query.collection && doc.collection == req.query.collection) // does the collection match?
			return true;
		else if (req.query && req.query.collection && doc._deleted) // has the document been deleted?
			return true;
		else
			return false;
	}
};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  } 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;