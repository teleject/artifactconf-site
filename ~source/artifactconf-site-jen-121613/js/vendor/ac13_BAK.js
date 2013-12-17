//Requires jQuery
/*global console */

var AC13 = AC13 || {};

$(function(){ "strict";

	AC13.widthQuery = (function(){
		
		var WidthQuery = function(){
			this.fns = {};
			console.log('itialized');
		};

		WidthQuery.prototype.addQuery = function(widths, fn){
				
			//widths = { 'min' : number, 'max' : number }
			var w = this.getWidth(),
				l = widths.min,
				h = widths.max;

			console.log(w);

			if( (l && !h && w >= l) ||
				(h && !l && w <= h) ||
				(h &&  l && w >= l && w <= h) ){
					
					return fn();
			}
		};

		WidthQuery.prototype.constructor = new WidthQuery();

		WidthQuery.prototype.executeQueryFunctions = function(){

		};

		WidthQuery.prototype.getWidth = function(){
			return $('body').width();
		};

		return WidthQuery;

	}());

	var QQQ = new AC13.widthQuery();
	
	QQQ.addQuery({'max' : 1280}, function(){
		console.log('sup');
	});
});







/*
$(function(){ "strict";
	
	

	GGG.stars = GGG.stars || {};
	GGG.mouseMatch = GGG.mouseMatch || {};

	GGG.stars = (function(){

			var Stars = function(){
			
				this.$star2 = $('.star2');
				this.$star3 = $('.star3');
			};

		Stars.prototype.constructor = new Stars();
		Stars.prototype.setPosition = function(star, x, y){

			var nx = x + 'px',
				ny = y + 'px';

			return star.css({'background-position' : nx+' '+ny});
		};

		return Stars;
	}());

	GGG.mouseMatch = (function(){

		var s = new GGG.stars();

		var GGGMouse = function(){

			};

		GGGMouse.prototype.init = function(){
			$(document).mousemove(function(e){

				var x = e.pageX, y = e.pageY;

				s.setPosition(s.$star2, parseInt(x * 0.05, 10), parseInt(y * 0.05, 10));
				s.setPosition(s.$star3, parseInt(x * 0.02, 10), parseInt(y * 0.02, 10));
			});
		};

		return GGGMouse;
	}());

	var mousematch = new GGG.mouseMatch();
	mousematch.init();

});

*/