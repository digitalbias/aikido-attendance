(function($) {

	Backbone.View.prototype.close = function(){
	  this.remove();
	  this.unbind();
	}
	
	Backbone.couch_connector.config.db_name = "aikido";
	Backbone.couch_connector.config.ddoc_name = "attendance";
//	Backbone.couch_connector.config.global_changes = true;

	
	window.StudentShowView = Backbone.View.extend({
		tagName: 'li',
		className: 'student',
		events: {
			'click .student.edit' : 'edit',
			'click .student.delete': 'remove'
		},
		
		edit: function() {
			this.model.trigger('edit', this.model);
			window.location = "#/edit_student/" + this.model.id;
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
	
	window.StudentEditView = Backbone.View.extend({
		tagName:'section',
		className: 'student',
		events: {
			'click .student.add':'add',
			'click .student.save':'save',
			'click .student.cancel': 'cancel'
		},
		
		add:function(){
			window.location = "#/add_student";
		},
		
		save: function(){
			
		},
		
		cancel: function(){
			console.log("canceling edit");
			window.location = "#"
		},
		
		initialize: function() {
			_.bindAll(this,'render');
			this.template = _.template($('#student-edit-template').html());
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
			window.location = "#/add_student";
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
				var view = new StudentShowView({
					model: student,
					collection:collection
				});
				$students.append(view.render().el);
			});
			return this;
		}
		
	});

	window.ClassShowView = Backbone.View.extend({
		tagName: 'li',
		className: 'class',
		events: {
			'click .class.edit' : 'edit',
			'click .class.delete': 'remove'
		},
		
		edit: function() {
			this.model.trigger('edit', this.model);
			window.location = "#/edit_class/" + this.model.id;
		},
		
		remove: function() {
			this.model.trigger('remove', this.model);
			console.log('Triggered remove', this.model);
		},
		
		initialize: function(){
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
			
			this.template = _.template($('#class-template').html());
		},
		
		render: function(){
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);
			return this;
		}
	});

	window.ClassEditView = Backbone.View.extend({
		tagName:'section',
		className: 'class',
		events: {
			'click .class.add':'add',
			'click .class.save':'save',
			'click .class.cancel': 'cancel'
		},
		
		add:function(){
			window.location = "#/add_class";
		},
		
		save: function(){
			
		},
		
		cancel: function(){
			window.location = "#/classes"
		},
		
		initialize: function() {
			_.bindAll(this,'render');
			this.template = _.template($('#class-edit-template').html());
		},
		
		render: function(){
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);
			return this;
		}
		
	});

	window.ClassListView = Backbone.View.extend({
		tagName:'section',
		className: 'class',
		events: {
			'click .class.add': 'add'
		},
		
		add: function() {
			window.location = "#/add_class";
		},
		
		initialize: function(){
			_.bindAll(this, 'render');
			this.template = _.template($("#classes-template").html());
			this.collection.bind('reset', this.render);
		},
		
		render: function(){
			var $classes,
				collection = this.collection;
			$(this.el).html(this.template({}));
			$classes = this.$(".classes");
			collection.each(function(classModel){
				var view = new ClassShowView({
					model: classModel,
					collection:collection
				});
				$classes.append(view.render().el);
			});
			return this;
		}
		
	});

	
})(jQuery);
