/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-03-30 17:42:42
 * @version $Id$
 */

(function($){
	$.fn.calender = function(opt){
		var opt = $.extend({}, $.fn.calender.defaults, opt);
		var _this = $(this);

		return this.each(function(index, el) {
			new Calender(_this, opt);
		});;
	};
	$.fn.calender.defaults = {
		'a': '1'
	};

	function Calender(el, opt){
		this.el = el;
		this.opt = opt;
		this.init();
	};

	Calender.prototype = {
		init: function(){
			console.log(this.opt);
		}
	}
})(jQuery);