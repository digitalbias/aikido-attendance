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
			'click .student.delete': 'delete'
		},
		
		edit: function() {
			this.model.trigger('edit:student', this.model);
			window.location = "#/edit_student/" + this.model.id;
		},
		
		delete: function() {
			this.model.trigger('remove:student', this.model);
			window.students.remove(this.model);
			
			if(this.model != null){
				this.remove();
				this.model.destroy();
			}
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'remove');
			this.model.bind('change', this.render);
			this.model.bind('remove',this.remove);
			
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
			var first_name = $("[name=first_name]").val();
			var last_name = $("[name=last_name]").val();
			var join_date = $("[name=join_date]").val();
			var previous_training_days = $("[name=previous_training_days]").val();
			var phone_number = $("[name=phone_number]").val();
			var birth_date = $("[name=birth_date]").val();
			var is_active = $("[name=is_active]").val();
			var program = $("[name=program]").val();

			var id = getId(window.location.hash);
			
			var attributes = {
				"first_name":first_name,
				"last_name":last_name,
				"join_date":join_date,
				"previous_training_days":previous_training_days,
				"phone_number":phone_number,
				"birth_date":birth_date,
				"is_active":is_active,
				"program":program
			};
			
			if(id == "add_student") {
				window.students.create(attributes);
				this.model.trigger('add:student', this.model);
			} else {
				model = window.students.get(id);
				model.set(attributes);
				model.save();
				this.model.trigger('update:student', this.model);
			}
			
			window.location = "#"
		},
		
		cancel: function(){
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
			'click .class.delete': 'delete'
		},
		
		edit: function() {
			this.model.trigger('edit:class', this.model);
			window.location = "#/edit_class/" + this.model.id;
		},
		
		delete: function() {
			this.model.trigger('remove:class', this.model);
			window.classes.remove(this.model);

			if(this.model != null){
				this.remove();
				this.model.destroy();
			}
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
			var date = $("[name=date]").val();
			var notes = $("[name=notes]").val();
			var id = getId(window.location.hash);
			
			var attributes = {
				"date":date,
				"notes":notes
			};
			
			if(id == "add_class") {
				window.classes.create(attributes);
				this.model.trigger('add:class', this.model);
			} else {
				model = window.classes.get(id);
				model.set(attributes);
				model.save();
				this.model.trigger('update:class', this.model);
			}
			
			window.location = "#/classes"
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
