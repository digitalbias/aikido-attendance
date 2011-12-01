(function($) {

	window.BackboneStudents = Backbone.Router.extend({
		routes: {
			'':'home',
			'/add_student':'add_student',
			'/edit_student/:id':'edit_student',
			'/classes':'classes',
			'/add_class':'add_class',
			'/edit_class':'edit_class'
		},
		
		initialize: function(){
			this.studentListView = new StudentListView({
				collection: window.students
			});
		},
		
		home: function(){
			if(window.students.length == 0){ window.students.fetch() }
			if(this.studentListView != null){
				this.studentListView.close();
				this.studentListView = null;
			}
			this.studentListView = new StudentListView({collection: window.students});
			var $container = $("#container");
			$container.empty();
			$container.append(this.studentListView.render().el);
		},
		
		classes: function() {
			if(window.classes.length == 0){ window.classes.fetch() }
			if(this.classListView != null){
				this.classListView.close();
				this.classListView = null;
			}
			this.classListView = new ClassListView({collection: window.classes});
			var $container = $("#container");
			$container.empty();
			$container.append(this.classListView.render().el);
		},
		
		add_or_edit_student: function(model){
			if(this.studentEditView != null){
				this.studentEditView = null;
			}
			this.studentEditView = new StudentEditView({
				model:model
			});
			var $container = $("#container");
			$container.empty();
			$container.append(this.studentEditView.render().el);
		},
		
		edit_student: function(the_id){
			var self = this;
			var model = window.students.get(the_id);
			if(model == null && window.students.length == 0){
				model = new Student({_id:the_id});
				model.fetch({
					success: function(model, resp){
						self.add_or_edit_student(model);
					}
				});
			}
			self.add_or_edit_student(model);
		},
		
		
		add_student: function(){
			var model = new Student();
			this.add_or_edit_student(model);
		},
		
		add_or_edit_class: function(model) {
			if(this.classEditView != null){
				this.classEditView = null;
			}
			this.classEditView = new ClassEditView({
				model:model
			});
			var $container = $("#container");
			$container.empty();
			$container.append(this.classEditView.render().el);
		},
		
		edit_class: function(the_id) {
			var self = this;
			var model = window.classes.get(the_id);
			if(model == null && window.classes.length == 0){
				model = new Class({_id:the_id});
				model.fetch({
					success: function(model, resp){
						self.add_or_edit_class(model);
					}
				});
			}
			self.add_or_edit_class(model);
		},
		
		add_class: function() {
			var model = new Class();
			this.add_or_edit_class(model);
		},
		
		defaultAction: function() {
			console.log('default action');
		}
	});
	
	$(function(){
		window.App = new BackboneStudents();
		Backbone.history.start();
	});
	
})(jQuery);
