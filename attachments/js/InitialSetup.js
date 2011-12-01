(function($) {

	Backbone.View.prototype.close = function(){
	  this.remove();
	  this.unbind();
	}

	Backbone.couch_connector.config.db_name = "aikido";
	Backbone.couch_connector.config.ddoc_name = "attendance";
	//Backbone.couch_connector.config.global_changes = true;

})(jQuery);
