(function($) {
	Backbone.couch_connector.config.db_name = "aikido";
	Backbone.couch_connector.config.ddoc_name = "attendance";
//	Backbone.couch_connector.config.global_changes = true;

	window.Student = Backbone.RelationalModel.extend({
		defaults: {
			first_name:"Unknown",
			last_name:"Unknown",
			join_date: '2001-01-01',
			rank_training_days: 'Unknown',
			ranks:[]
		},
		
		initialize: function(){
			this.get_training_days();
		},

		current_rank: function() {
			var result = {name:'',date:'', alternate_name:''};
			var ranks = this.get('ranks');
			$.each(ranks, function(index, value){
				if(value.date > result.date){
					result = ranks[index];
				}
			});
			return result;
		},
		
		get_training_days: function(){
			current_rank = this.current_rank();
			start_date = current_rank.date;
			options = {
				student:this.get('_id'),
				start_date:start_date,
				reduce:false
			};
			ajaxOptions = {
				student: this,
				success: function(data){
					training_days = data.total_classes;
					previous_days = this.student.get('previous_training_days');
					if(previous_days != null) training_days += previous_days;
					this.student.set({'rank_training_days':training_days});
				}
			};
			$.couch.db(Backbone.couch_connector.config.db_name).list(Backbone.couch_connector.config.ddoc_name +'/classesSinceLastRank','trainingDaysByStudent', options, ajaxOptions);
		}

	});
	
	window.Students = Backbone.Collection.extend({
		model:Student,
		url: '/students'
		// ,
		// db: {
		// 	view:'students',
		// 	filter: Backbone.couch_connector.config.ddoc_name + "/students"
		// }
	});
	
	window.Class = Backbone.RelationalModel.extend({
		defaults: {
			date:'',
			notes:'',
			students:[]
		},

		relations:[{ 
			type: Backbone.HasMany,
			key: 'students',
			relatedModel: 'Student',
			collectionType: 'Students'
		}]
		
	});
	
	window.Classes = Backbone.Collection.extend({
		model:Class,
		url: '/classes'
		// ,
		// db: {
		// 	view:'classes',
		// 	filter: Backbone.couch_connector.config.ddoc_name + "/classes"
		// }
	});
	
	window.StudentClasses = window.Classes.extend({
		db: {
			view:'classesByStudent'
		}
	});
	
	window.students = new Students();
	window.classes = new Classes();
	
	window.StudentView = Backbone.View.extend({
		tagName: 'li',
		className: 'student',
		events: {
			'click .student.edit' : 'edit',
			'click .student.delete': 'remove'
		},
		
		edit: function() {
			this.model.trigger('edit', this.model);
			console.log('Triggered edit', this.model);
		},
		
		remove: function() {
			this.model.trigger('remove', this.model);
			console.log('Triggered remove', this.model);
		},
		
		initialize: function(){
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
			
			this.template = _.template($('#student-template').html());
		},
		
		render: function(){
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);
			return this;
		}
	});
	
	window.StudentListView = Backbone.View.extend({
		tagName:'section',
		className: 'students',
		events: {
			'click .student.add': 'add'
		},
		
		add: function() {
			
			console.log('add', this.collection);
		},
		
		initialize: function(){
			_.bindAll(this, 'render');
			this.template = _.template($("#students-template").html());
			this.collection.bind('reset', this.render);
		},
		
		render: function(){
			var $students,
				collection = this.collection;
			$(this.el).html(this.template({}));
			$students = this.$(".students");
			collection.each(function(student){
				var view = new StudentView({
					model: student,
					collection:collection
				});
				$students.append(view.render().el);
			});
			return this;
		}
		
	});
	
	window.BackboneStudents = Backbone.Router.extend({
		routes: {
			'':'home'
		},
		
		initialize: function(){
			this.studentListView = new StudentListView({
				collection: window.students
			});
		},
		
		home: function(){
			var $container = $("#container");
			$container.empty();
			$container.append(this.studentListView.render().el);
		}
	});
	
	$(function(){
		window.App = new BackboneStudents();
		Backbone.history.start();
	});
	
})(jQuery);
