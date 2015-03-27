(function($){
	$.fn.pagination = function(opt){
		opt = $.extend({}, $.fn.pagination.defaults, opt);
		var _this = $(this);
		return this.each(function(){
			new Pagination(_this, opt);
		});
	};
	$.fn.pagination.defaults = {
		current_page: 1,  // 当前页
		items_per_page: 3,	// 每页列表数
		max_items: 20,  // 总列表数
		before: $.noop, // 初始化前回调
		after: $.noop, // 初始化后回调
		interval: 5 // 页码间隔
	};

	function Pagination(_this, opt){
		this.opt = opt;
		this.elem = _this;
		this.init();
	}

	Pagination.prototype = {
		init: function(){
			this.opt.before();
			this.init_handler();
			this.event_handler();
		},
		init_handler: function(){
			var total = this.get_total_page();
			if(total < this.opt.interval){
				this.init_render_html(false, total);
			}else{
				this.init_render_html(true, this.opt.interval);
			}
		},
		init_render_html: function(show, total){
			var elem = this.elem;
			if(!show){
				$(elem).append('<span class="prev">上一页</span>');
				for (var i = 1; i <= total; i++) {
					$(elem).append('<span data-page="'+i+'">'+i+'</span>');
				}
				$(elem).append('<span class="next">下一页</span>');
			}else{
				$(elem).append('<span class="prev">上一页</span>');
				for (var i = 1; i <= total; i++) {
					if(i == 2){
						$(elem).append('<span data-page="'+i+'">'+i+'</span>');
						$(elem).append('<span>...</span>');
					}else{
						$(elem).append('<span data-page="'+i+'">'+i+'</span>');
					}
				}
				$(elem).append('<span class="next">下一页</span>');
			}
			$(elem).find('span').eq(1).addClass('active');
			$(elem).find('span').eq(0).addClass('disabled');
		},
		get_total_page: function(){
			var total = Math.ceil( this.opt.max_items / this.opt.items_per_page );
			return total;
		},
		event_handler: function(){
			var _this = this;
			var page;
			var total_page = this.get_total_page();

			this.elem.on('click', 'span.prev', function(){
				_this.prev();
			});
			this.elem.on('click', 'span.next', function(){
				_this.next();
			});
			this.elem.on('click', '[data-page]', function(){
				page = $(this).data('page');
				_this.pageto(page);
			});
		},
		pageto: function(page_num){
			this.update_state(page_num);
		},
		update_state: function(page_num){
			this.elem.find('span').removeClass('active');
			this.elem.find('[data-page="'+page_num+'"]').addClass('active');
			this.set_current_page(page_num);
		},
		get_current_page: function(){
			var current_page = this.opt.current_page;
			return parseInt(current_page);
		},
		set_current_page: function(current_page){
			this.opt.current_page = current_page;
		},
		prev: function(){
			var current_page = this.get_current_page();
			if(current_page == 1){
				return false;
			}
			this.pageto(current_page-1);
		},
		next: function(){
			var current_page = this.get_current_page();
			var total_page = this.get_total_page();
			if(current_page == total_page){
				return false;
			}
			if(!$('[data-page="'+(current_page+1)+'"]').length){
				this.render_html();
			}
			this.pageto(current_page+1);
		},
		render_html: function(){
			this.elem.find('[data-page]').each(function(key, elem){
				var page = $(elem).data('page');
				page++;
				$(elem).attr('data-page', page).html(page);
			});
		}
	}
})(jQuery);