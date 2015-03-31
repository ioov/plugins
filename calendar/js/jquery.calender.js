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
			var _date = this.date;
			var datePerMonth = this.getDatePerMonth(_date);
			var firstDayPerMonth = this.getFirstDayPerMonth(_date);
			this.renderTmpl(firstDayPerMonth, datePerMonth);
		},
		getDatePerMonth: function(date){
			var _date = new Date(date.year, date.month, 0);
			return _date.getDate();
		},
		getFirstDayPerMonth: function(date){
			var _date = new Date(date.year, date.month-1, 1);
			return _date.getDay() == 0 ? 7 : _date.getDay();
		},
		renderTmpl: function(firstDayPerMonth, datePerMonth){
			var tmpl = '<div class="calender-btns">';
			tmpl += '<a class="pre-year" href="javascript:;">上一年</a>';
			tmpl += '<a class="next-year" href="javascript:;">下一年</a>';
			tmpl += '<a class="pre-month" href="javascript:;">上一月</a>';
			tmpl += '<a class="next-month" href="javascript:;">下一月</a>';
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

			this.el.append(tmpl);
		}
	}
})(jQuery);