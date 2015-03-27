(function($){
	$.fn.pagination = function(opts){
		opts = $.extend({}, $.fn.pagination.defaults, opts);
		var _this = $(this);
		return this.each(function(){
			new Pagination(_this, opts);
		});
	};
	$.fn.pagination.defaults = {
		current_page: 1,
		items_per_page: 2,
		total_page: 10,
		load_first_page: function(){},
		complete: function(){}
	};

	function Pagination(_this, opts){
		this.opts = opts;
		this.elem = _this;
		this.init(opts);
	}

	Pagination.prototype = {
		init: function(opts){
			this.opts.load_first_page();
			this.eventListner();
		},
		get_current_page: function(){
			var current_page = this.opts.current_page;
			return parseInt(current_page);
		},
		set_current_page: function(current_page){
			this.opts.current_page = current_page;
		},
		get_total_page: function(){
			return this.opts.total_page;
		},
		prev: function(){
			var current_page = this.get_current_page();
			if(current_page == 1){
				return false;
			}
			this.pageto(current_page-1, 'prev');
		},
		next: function(){
			var current_page = this.get_current_page();
			var total_page = this.get_total_page();
			if(current_page == total_page){
				return false;
			}
			this.pageto(current_page+1, 'next');
		},
		first: function(){
			this.pageto(1, 'first');
		},
		last: function(){
			var total_page = this.get_total_page();
			this.pageto(total_page, 'last');
		},
		pageto: function(page_num, state){
			this.update_state(page_num, state);
			this.set_current_page(page_num);
			this.opts.complete();
		},
		eventListner: function(){
			var _this = this;
			var total_page = this.get_total_page();
			this.elem.on('click', '[data-page]', function(){
				var page_num = $(this).attr('data-page');
				if(page_num == 1){
					_this.first();
				}else if(page_num == total_page){
					_this.last();
				}else if(page_num == 'prev'){
					_this.prev()
				}else if(page_num == 'next'){
					_this.next();
				}else if(page_num == -1){
					return false;
				}else{
					_this.pageto(page_num);
				}
			});
		},
		update_state: function(page_num, state){
			var total_page = this.get_total_page();
			var page = page_num;

			this.render_data(page_num, state);

			this.elem.find('[data-page]').removeClass('active');
			this.elem.find('[data-page="'+page+'"]').addClass('active');

			if(page_num == 1){
				this.elem.find('[data-page="prev"]').removeClass('waves-effect').addClass('disabled');
				this.elem.find('[data-page="next"]').addClass('waves-effect').removeClass('disabled');
			}else if(page_num == total_page){
				this.elem.find('[data-page="prev"]').addClass('waves-effect').removeClass('disabled');
				this.elem.find('[data-page="next"]').removeClass('waves-effect').addClass('disabled');
			}else{
				this.elem.find('[data-page="prev"]').addClass('waves-effect').removeClass('disabled');
				this.elem.find('[data-page="next"]').addClass('waves-effect').removeClass('disabled');
			}
		},
		render_data: function(page_num, state){
			var total_page = this.get_total_page();
			var index = this.elem.find('.active').index();
			if(state == 'first'){
				this.elem.find('li').eq(3).attr('data-page', page_num+1).find('a').html(page_num+1);
				this.elem.find('li').eq(4).attr('data-page', page_num+2).find('a').html(page_num+2);
				this.elem.find('li').eq(5).attr('data-page', page_num+3).find('a').html(page_num+3);
			}else if(state == 'last'){
				this.elem.find('li').eq(3).attr('data-page', page_num-3).find('a').html(page_num-3);
				this.elem.find('li').eq(4).attr('data-page', page_num-2).find('a').html(page_num-2);
				this.elem.find('li').eq(5).attr('data-page', page_num-1).find('a').html(page_num-1);
			}else if(state == 'prev'){
				if(index == 5){
					this.elem.find('li').eq(3).attr('data-page', page_num-1).find('a').html(page_num-1);
					this.elem.find('li').eq(4).attr('data-page', page_num).find('a').html(page_num);
					this.elem.find('li').eq(5).attr('data-page', page_num+1).find('a').html(page_num+1);
				}else if(page_num < total_page-3 && page_num > 1){
					this.elem.find('li').eq(3).attr('data-page', page_num).find('a').html(page_num);
					this.elem.find('li').eq(4).attr('data-page', page_num+1).find('a').html(page_num+1);
					this.elem.find('li').eq(5).attr('data-page', page_num+2).find('a').html(page_num+2);
				}
			}else if(state == 'next'){
				if(index == 3){
					this.elem.find('li').eq(3).attr('data-page', page_num-1).find('a').html(page_num-1);
					this.elem.find('li').eq(4).attr('data-page', page_num).find('a').html(page_num);
					this.elem.find('li').eq(5).attr('data-page', page_num+1).find('a').html(page_num+1);
				}else if(page_num > 4 && page_num < total_page){
					this.elem.find('li').eq(3).attr('data-page', page_num-2).find('a').html(page_num-2);
					this.elem.find('li').eq(4).attr('data-page', page_num-1).find('a').html(page_num-1);
					this.elem.find('li').eq(5).attr('data-page', page_num).find('a').html(page_num);
				}
			}
		}
	}
})(jQuery);