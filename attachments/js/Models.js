(function($) {
	window.Student = Backbone.RelationalModel.extend({
		defaults: {
			first_name:"Unknown",
			last_name:"Unknown",
			join_date: '2001-01-01',
			rank_training_days: 'Unknown',
			previous_training_days:0,
			phone_number:'',
			birth_date:'',
			is_active:true,
			program:'',
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
	});

	window.StudentClasses = window.Classes.extend({
		db: {
			view:'classesByStudent'
		}
	});

	window.students = new Students();
	window.classes = new Classes();

})(jQuery);
