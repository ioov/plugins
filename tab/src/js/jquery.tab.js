/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-04-27 10:27:38
 * @version $Id$
 */

(function($){
	var defaults = {
		"nav": "",
		"menu": "",
		"query": "li",
		"activeClass": "on",
		"defaultIndex": 0,
		"evtName": "click" // click, hover
	}
	$.fn.tab = function(opt){
		var opt = $.extend({}, defaults, opt);
		var _this = $(this);

		return $(this).each(function(){
			new Tab(_this, opt);
		});
	}

	function Tab(elem, opt){
		this.elem = elem;
		this.opt = opt;
		this.init();
	}

	Tab.prototype = {
		init: function(){
			this.cIndex = this.opt.defaultIndex;
			this.show(this.opt.defaultIndex);
			this.evtHandle();
		},
		show: function(index){
			this.getItem(index).nav.addClass(this.opt.activeClass);
			this.getItem(index).menu.show();
			this.cIndex = index;
		},
		hide: function(index){
			this.getItem(index).nav.removeClass(this.opt.activeClass);
			this.getItem(index).menu.hide();
		},
		change: function(index){
			this.hide(this.cIndex);
			this.show(index);
		},
		evtHandle: function(){
			var _this = this;
			this.elem.on(this.opt.evtName, this.opt.query, function(){
				var el = $(this);
				var index = el.attr('data-index');
				index && _this.change(index);
			});
		},
		getItem: function(index){
			var _this = this;
			return {
				"index": index,
				"nav": _this.opt.nav.find('[data-index="'+index+'"]'),
				"menu": _this.opt.menu.find('[data-index="'+index+'"]')
			}
		}
	}
})(jQuery);