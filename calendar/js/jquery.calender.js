/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-03-30 17:42:42
 * @version $Id$
 */

(function($){
	$.fn.calender = function(opt){
		opt = $.extend({}, $.fn.calender.defaults, opt);
		var _this = $(this);

		return this.each(function(index, el) {
			new Calender(_this, opt);
		});;
	};
	$.fn.calender.defaults = {
		week: ['一', '二', '三', '四', '五', '六', '日'],
		selectedDay: null,
		onSelectedDay: $.noop,
		onToday: $.noop,
		after: $.noop
	};

	function Calender(el, opt){
		this.el = el;
		this.opt = opt;
		this.date = {
			year: opt.year || new Date().getFullYear(),
			month: opt.month || new Date().getMonth() + 1,
			date: opt.date || new Date().getDate()
		}
		this.init();
	};

	Calender.prototype = {
		init: function(){
			this.renderTmpl();
			this.eventHandler();
		},
		getDatePerMonth: function(date){
			var _date = new Date(date.year, date.month, 0);
			return _date.getDate();
		},
		getFirstDayPerMonth: function(date){
			var _date = new Date(date.year, date.month-1, 1);
			return _date.getDay() == 0 ? 7 : _date.getDay();
		},
		renderTmpl: function(){
			var datePerMonth = this.getDatePerMonth(this.date);
			var firstDayPerMonth = this.getFirstDayPerMonth(this.date);

			var tmpl = '<div class="calender-btns">';
			tmpl += '<a class="calender-prev-year" href="javascript:;">上一年</a>';
			tmpl += '<span class="calender-year">'+this.date.year+'</span>';
			tmpl += '<a class="calender-next-year" href="javascript:;">下一年</a>';
			tmpl += '<a class="calender-prev-month" href="javascript:;">上一月</a>';
			tmpl += '<span class="calender-month">'+this.date.month+'</span>';
			tmpl += '<a class="calender-next-month" href="javascript:;">下一月</a>';
			tmpl += '</div>';

			tmpl += '<div class="calender-items">';
			tmpl += '<ul>';
			for (var i = 0, len = this.opt.week.length; i < len; i++) {
				tmpl += '<li>'+this.opt.week[i]+'</li>';
			}
            tmpl += '</ul>';
            tmpl += '<ol>';

            for (var i = 1; i <= 42; i++) {
            	if(i < firstDayPerMonth){
	            	tmpl += '<li></li>';
            	}else if(i < datePerMonth + firstDayPerMonth){
	            	tmpl += '<li>'+(i - (firstDayPerMonth - 1) )+'</li>';
            	}else{
	            	tmpl += '<li></li>';
            	}
            }

			tmpl += '</ol>';
			tmpl += '</div>';

			this.el.html(tmpl);
		},
		eventHandler: function(){
			var _this = this;
			this.el.on('click', '.calender-next-year', function(){
				_this.date.year += 1;
				_this.renderTmpl();
			});
			this.el.on('click', '.calender-prev-year', function(){
				_this.date.year -= 1;
				_this.renderTmpl();
			});
			this.el.on('click', '.calender-next-month', function(){
				_this.date.month += 1;
				_this.renderTmpl();
			});
			this.el.on('click', '.calender-prev-month', function(){
				_this.date.month -= 1;
				_this.renderTmpl();
			});
		}
	}
})(jQuery);