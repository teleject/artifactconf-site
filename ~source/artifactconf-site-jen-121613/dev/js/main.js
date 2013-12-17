// @codekit-prepend "plugins.js", "vendor/ac13.js", "vendor/jquery.scrollTo-1.4.3.1.js";
/* global console */

/*!
 * jQuery.ScrollTo
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 4/09/2012
 *
 * @projectDescription Easy element scrolling using jQuery.
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * @author Ariel Flesler
 * @version 1.4.3.1
 *
 * @id jQuery.scrollTo
 * @id jQuery.fn.scrollTo
 * @param {String, Number, DOMElement, jQuery, Object} target Where to scroll the matched elements.
 *	  The different options for target are:
 *		- A number position (will be applied to all axes).
 *		- A string position ('44', '100px', '+=90', etc ) will be applied to all axes
 *		- A jQuery/DOM element ( logically, child of the element to scroll )
 *		- A string selector, that will be relative to the element to scroll ( 'li:eq(2)', etc )
 *		- A hash { top:x, left:y }, x and y can be any kind of number/string like above.
 *		- A percentage of the container's dimension/s, for example: 50% to go to the middle.
 *		- The string 'max' for go-to-end. 
 * @param {Number, Function} duration The OVERALL length of the animation, this argument can be the settings object instead.
 * @param {Object,Function} settings Optional set of settings or the onAfter callback.
 *	 @option {String} axis Which axis must be scrolled, use 'x', 'y', 'xy' or 'yx'.
 *	 @option {Number, Function} duration The OVERALL length of the animation.
 *	 @option {String} easing The easing method for the animation.
 *	 @option {Boolean} margin If true, the margin of the target element will be deducted from the final position.
 *	 @option {Object, Number} offset Add/deduct from the end position. One number for both axes or { top:x, left:y }.
 *	 @option {Object, Number} over Add/deduct the height/width multiplied by 'over', can be { top:x, left:y } when using both axes.
 *	 @option {Boolean} queue If true, and both axis are given, the 2nd axis will only be animated after the first one ends.
 *	 @option {Function} onAfter Function to be called after the scrolling ends. 
 *	 @option {Function} onAfterFirst If queuing is activated, this function will be called after the first scrolling ends.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @desc Scroll to a fixed position
 * @example $('div').scrollTo( 340 );
 *
 * @desc Scroll relatively to the actual position
 * @example $('div').scrollTo( '+=340px', { axis:'y' } );
 *
 * @desc Scroll using a selector (relative to the scrolled element)
 * @example $('div').scrollTo( 'p.paragraph:eq(2)', 500, { easing:'swing', queue:true, axis:'xy' } );
 *
 * @desc Scroll to a DOM element (same for jQuery object)
 * @example var second_child = document.getElementById('container').firstChild.nextSibling;
 *			$('#container').scrollTo( second_child, { duration:500, axis:'x', onAfter:function(){
 *				alert('scrolled!!');																   
 *			}});
 *
 * @desc Scroll on both axes, to different values
 * @example $('div').scrollTo( { top: 300, left:'+=200' }, { axis:'xy', offset:-20 } );
 */

;(function( $ ){
	
	var $scrollTo = $.scrollTo = function( target, duration, settings ){
		$(window).scrollTo( target, duration, settings );
	};

	$scrollTo.defaults = {
		axis:'xy',
		duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1,
		limit:true
	};

	// Returns the element that needs to be animated to scroll the window.
	// Kept for backwards compatibility (specially for localScroll & serialScroll)
	$scrollTo.window = function( scope ){
		return $(window)._scrollable();
	};

	// Hack, hack, hack :)
	// Returns the real elements to scroll (supports window/iframes, documents and regular nodes)
	$.fn._scrollable = function(){
		return this.map(function(){
			var elem = this,
				isWin = !elem.nodeName || $.inArray( elem.nodeName.toLowerCase(), ['iframe','#document','html','body'] ) != -1;

				if( !isWin )
					return elem;

			var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;
			
			return /webkit/i.test(navigator.userAgent) || doc.compatMode == 'BackCompat' ?
				doc.body : 
				doc.documentElement;
		});
	};

	$.fn.scrollTo = function( target, duration, settings ){
		if( typeof duration == 'object' ){
			settings = duration;
			duration = 0;
		}
		if( typeof settings == 'function' )
			settings = { onAfter:settings };
			
		if( target == 'max' )
			target = 9e9;
			
		settings = $.extend( {}, $scrollTo.defaults, settings );
		// Speed is still recognized for backwards compatibility
		duration = duration || settings.duration;
		// Make sure the settings are given right
		settings.queue = settings.queue && settings.axis.length > 1;
		
		if( settings.queue )
			// Let's keep the overall duration
			duration /= 2;
		settings.offset = both( settings.offset );
		settings.over = both( settings.over );

		return this._scrollable().each(function(){
			// Null target yields nothing, just like jQuery does
			if (target == null) return;

			var elem = this,
				$elem = $(elem),
				targ = target, toff, attr = {},
				win = $elem.is('html,body');

			switch( typeof targ ){
				// A number will pass the regex
				case 'number':
				case 'string':
					if( /^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ) ){
						targ = both( targ );
						// We are done
						break;
					}
					// Relative selector, no break!
					targ = $(targ,this);
					if (!targ.length) return;
				case 'object':
					// DOMElement / jQuery
					if( targ.is || targ.style )
						// Get the real position of the target 
						toff = (targ = $(targ)).offset();
			}
			$.each( settings.axis.split(''), function( i, axis ){
				var Pos	= axis == 'x' ? 'Left' : 'Top',
					pos = Pos.toLowerCase(),
					key = 'scroll' + Pos,
					old = elem[key],
					max = $scrollTo.max(elem, axis);

				if( toff ){// jQuery / DOMElement
					attr[key] = toff[pos] + ( win ? 0 : old - $elem.offset()[pos] );

					// If it's a dom element, reduce the margin
					if( settings.margin ){
						attr[key] -= parseInt(targ.css('margin'+Pos)) || 0;
						attr[key] -= parseInt(targ.css('border'+Pos+'Width')) || 0;
					}
					
					attr[key] += settings.offset[pos] || 0;
					
					if( settings.over[pos] )
						// Scroll to a fraction of its width/height
						attr[key] += targ[axis=='x'?'width':'height']() * settings.over[pos];
				}else{ 
					var val = targ[pos];
					// Handle percentage values
					attr[key] = val.slice && val.slice(-1) == '%' ? 
						parseFloat(val) / 100 * max
						: val;
				}

				// Number or 'number'
				if( settings.limit && /^\d+$/.test(attr[key]) )
					// Check the limits
					attr[key] = attr[key] <= 0 ? 0 : Math.min( attr[key], max );

				// Queueing axes
				if( !i && settings.queue ){
					// Don't waste time animating, if there's no need.
					if( old != attr[key] )
						// Intermediate animation
						animate( settings.onAfterFirst );
					// Don't animate this axis again in the next iteration.
					delete attr[key];
				}
			});

			animate( settings.onAfter );			

			function animate( callback ){
				$elem.animate( attr, duration, settings.easing, callback && function(){
					callback.call(this, target, settings);
				});
			};

		}).end();
	};
	
	// Max scrolling position, works on quirks mode
	// It only fails (not too badly) on IE, quirks mode.
	$scrollTo.max = function( elem, axis ){
		var Dim = axis == 'x' ? 'Width' : 'Height',
			scroll = 'scroll'+Dim;
		
		if( !$(elem).is('html,body') )
			return elem[scroll] - $(elem)[Dim.toLowerCase()]();
		
		var size = 'client' + Dim,
			html = elem.ownerDocument.documentElement,
			body = elem.ownerDocument.body;

		return Math.max( html[scroll], body[scroll] ) 
			 - Math.min( html[size]  , body[size]   );
	};

	function both( val ){
		return typeof val == 'object' ? val : { top:val, left:val };
	};

})( jQuery );

$(function(){ "strict";

	$('.scroll_button').click(function(){

		var destination = $(this).data('nav');
		console.log(destination);
		$('body').scrollTo(destination, 1000);
		return false;

	});

});



$(document).ready(function () {

	
	
	// var data = {
	// 	"speakers" : [
		
	// 		{	"firstname": "Jennifer",
	// 			"lastname": "Brook",
	// 			"slug": "jenniferbrook",
	// 			"title": "Interaction Designer",
	// 			"company": "The New School",
	// 			"img": "jenniferbrook.jpg",
	// 			"websites": ["thenewschool.edu"],
	// 			"description": "Lorem"
	// 		},
	// 		{	"firstname": "Ben",
	// 			"lastname": "Callahan",
	// 			"slug": "bencallahan",
	// 			"title": "President",
	// 			"company": "Spark Box",
	// 			"img": "bencallahan.jpg",
	// 			"websites": ["seesparkbox.com"],
	// 			"description": "President of Sparkbox and founder of the Build Responsively workshop series, Ben shares his ideas about the web on the Sparkbox Foundry and other industry blogs like .net Magazine and Smashing Magazine. His leadership at Sparkbox has driven the team to be a pioneer in responsive web design techniques, and he continues to push for great user experiences outside the context of specific devices."
	// 		},
	// 		{	"firstname": "Kristin",
	// 			"lastname": "Ellington",
	// 			"slug": "kristinellington",
	// 			"title": "COO",
	// 			"company": "Funny Garbage",
	// 			"img": "kristine.jpg",
	// 			"websites": ["funnygarbage.com"],
	// 			"description": "Kristin brought her experience as a designer and producer to Funny Garbage when she joined the company in 1997. Her leadership has transformed a small design studio into a full-service production and content development business with a global clientele. Kristin manages the administration and operations of Funny Garbage, including its strategic planning, business development, human resources, and client relationships."
	// 		},
	// 		{	"firstname": "Matt",
	// 			"lastname": "Griffin",
	// 			"slug": "mattgriffin",
	// 			"title": "Principal",
	// 			"company": "Bearded",
	// 			"img": "mattgriffin.jpg",
	// 			"websites": ["bearded.com"],
	// 			"description": "Matt Griffin is a designer and one of the founders of Bearded. He is an avid advocate for collaboration in design, and has been published in A List Apart and .net magazine. He is also one of the creators of Wood Type Revival, a successfully Kickstarter-funded project which seeks out lost historic wood type and converts it into digital fonts for modern designers. Matt lives in Pittsburgh’s East End with his lovely and talented wife Elizabeth and their adorable son Argus."
	// 		},
	// 		{	"firstname": "Dan",
	// 			"lastname": "Mall",
	// 			"slug": "danmall",
	// 			"title": "Founder",
	// 			"company": "SuperFriendly",
	// 			"img": "danmall.jpg",
	// 			"websites": ["danielmall.com","superfriend.ly"],
	// 			"description": "Dan Mall is an award-winning designer from Philadelphia, an enthralled husband, and new dad. As the Founder & Design Director at SuperFriendly, Dan and his team defeat apathy and the forces of evil with heroic creative direction, design, & strategy. He’s also co-founder of Typedia and swfIR, and sings/plays keyboard for contemporary-Christian band Four24. Dan was formerly Design Director at Big Spaceship, Interactive Director at Happy Cog, and a technical editor for A List Apart. He writes about design and other issues onTwitter and on his industry-recognized site, danielmall.com."
	// 		},
	// 		{	"firstname": "Jason",
	// 			"lastname": "Pamental",
	// 			"slug": "jasonpamental",
	// 			"title": "Founder",
	// 			"company": "Thinking in Pencil",
	// 			"img": "jasonpamental.jpg",
	// 			"websites": ["thinkinginpencil.com"],
	// 			"description": "My name is Jason Pamental. During my career I have been responsible for directing all aspects of interactive projects, integrating marketing, design, and business processes into a comprehensive solution. From shaping the initial project vision and developing the information architecture, to providing creative direction for the visual design and managing the implementation, I have overseen both the creative and technical aspects of interactive projects.<br />Prior to launching my consulting practice, I have served as Director of Interactive/Technology for (add)ventures developing interactive solutions for Fortune 25 and non-profit clients alike, and before that for North Sails as their Director of Web Services. There I was handling much of their public and internal web development, server infrastructure, data center management and more. Both roles had gotten to be a little too focused on the technology and not enough on design, so when the opportunity came to start my own consulting business I couldn’t pass that up. North had also been a consulting client for years while I had my own business (Bathysphere Digital Media Services) providing some print but mostly interactive design and development."
	// 		},
	// 		{	"firstname": "Andrew",
	// 			"lastname": "Pratt",
	// 			"slug": "andrewpratt",
	// 			"title": "N/A",
	// 			"company": "N/A",
	// 			"img": "andypratt.jpg",
	// 			"websites": ["website.com"],
	// 			"description": "Lorem"
	// 		},
	// 		{	"firstname": "Jared",
	// 			"lastname": "Ponchot",
	// 			"slug": "jaredponchot",
	// 			"title": "Creative Director",
	// 			"company": "Lullabot",
	// 			"img": "jaredponchot.jpg",
	// 			"websites": ["lullabot.com"],
	// 			"description": "Jared Ponchot is the Creative Director at Lullabot, an interactive strategy, design and development agency known for its expertise in Drupal and open source publishing platforms. Lullabot's clients include Harvard, NBC, Martha Stewart Living, and Sony Music just to name a few.<br />Jared received his BFA in Graphic and Interactive Communications from Ringling College of Art and Design and began his career in print design, but has now spent more than ten years designing for the web and interactive applications. Over the course of his career, he has led design efforts for clients like MIT, Time Warner, Intel, AAA, Ogilvy PR and the GRAMMYs. A strong advocate for responsive design, Jared helped create the first fully responsive site for GRAMMY.com for their 54th annual awards show.<br />Jared is passionate about beautiful, usable design, and has shared his knowledge speaking extensively around the world on design principles, visual hierarchy, and designing for complex content models. He also hosts a bi-weekly Podcast called \"The Creative Process\", where he and Lullabot co-founder Jeff Robbins chat with designers, artists, musicians, authors and filmmakers about how creativity happens."
	// 		},
	// 		{	"firstname": "Jennifer",
	// 			"lastname": "Robbins",
	// 			"slug": "jenniferrobbins",
	// 			"title": "Designer/Author",
	// 			"company": "O'Reilly Media",
	// 			"img": "jenniferrobbins.jpg",
	// 			"websites": ["jenville.com","oreilly.com"],
	// 			"description": "Jennifer has been designing for the web since 1993, as the designer of the first commercial webstie, Global Network Navigator. She is the author of several books about web design including \"Web Design in a Nutshell\" and \"Learning Web Design\" (O'Reilly). She currently works as a soup-to-nuts digital product designer at O\'Reilly Media."
	// 		},
	// 		{	"firstname": "Christopher",
	// 			"lastname": "Schmitt",
	// 			"slug": "christopherschmitt",
	// 			"title": "Founder",
	// 			"company": "Environments For Humans",
	// 			"img": "christopherschmitt.jpg",
	// 			"websites": ["environmentsforhumans.com"],
	// 			"description": "The founder of Heat Vision, a small new media publishing, design, and event company, Christopher is an award-winning Web designer who has been working with the Web since 1993. As a sought-after speaker and trainer, Christopher regularly demonstrates the use and benefits of practical standards-based designs. He is Co-Lead of the Adobe Task Force for the Web Standards Project (WaSP) as well as Co-Lead of its Education Task Force.</p><p>Author of numerous Web design and digital imaging books, including Adapting to Web Standards: CSS and Ajax for Big Sites and CSS Cookbook, Christopher has also written for New Architect Magazine, A List Apart, Digital Web, and Web Reference."
	// 		},
	// 		{	"firstname": "Kevin",
	// 			"lastname": "Sharon",
	// 			"slug": "kevinsharon",
	// 			"title": "Creative Director",
	// 			"company": "Happy Cog",
	// 			"img": "halle.jpg",
	// 			"websites": ["happycog.com"],
	// 			"description": "Kevin and Sophie lead us through their experience designing a responsive site from beginning to end, including setting client expectations, the design process, and the tools they tried with along the way. Find out what worked for them and what didn't work so well. In the end, it should be clear that this is a time for experimentation and finding new approaches for new tasks."
	// 		},
	// 		{	"firstname": "Sophie",
	// 			"lastname": "Shepard",
	// 			"slug": "sophieshepard",
	// 			"title": "Designer",
	// 			"company": "Happy Cog",
	// 			"img": "halle.jpg",
	// 			"websites": ["happycog.com"],
	// 			"description": "Kevin and Sophie lead us through their experience designing a responsive site from beginning to end, including setting client expectations, the design process, and the tools they tried with along the way. Find out what worked for them and what didn't work so well. In the end, it should be clear that this is a time for experimentation and finding new approaches for new tasks."
	// 		},
	// 		{	"firstname": "Jen",
	// 			"lastname": "Simmons",
	// 			"slug": "jensimmons",
	// 			"title": "Designer",
	// 			"company": "Host of \"The Web Ahead\" on 5by5",
	// 			"img": "jensimmons.jpg",
	// 			"websites": ["5by5.tv/webahead"],
	// 			"description": "Jen Simmons is a designer who builds stuff, too. Creating websites since 1996, Jen works as an independent consultant and trainer helping teams transition to a responsive design process, implement sites with HTML5, or architect Drupal websites to last. She also provides a mix of design and front-end development services. Her clients have included the Annenberg Foundation, Mark Boulton Design, CERN, Palantir.net, Zinch, Lullabot and the New York Stock Exchange. In 2010, Jen designed and created a new default theme for Drupal 7 named Bartik."
	// 		},
	// 		{	"firstname": "Trent",
	// 			"lastname": "Walton",
	// 			"slug": "trentwalton",
	// 			"title": "Co-Founder",
	// 			"company": "Paravel",
	// 			"img": "trentwalton.jpg",
	// 			"websites": ["paravelinc.com"],
	// 			"description": "I’m founder & 1/3 of Paravel, a small web shop based out of the Texas Hill Country, where the lake levels are constant and the chicken fried steaks are as big as your face. Dave Rupert, Reagan Ray, and I have been working together building for the web since 2002."
	// 		}



	// 	]};

	// 	var template = $('#speakersTpl').html();
	// 	var html = Mustache.to_html(template, data);
	// 	$('#speaker-list').html(html);


		$(".more").on("click", function(e){
			e.preventDefault();
			//$(".description").removeClass('active');

			var target = $(this).attr('href') + " .description";
			
			if( $(target).hasClass('active') === true) {
				$(target).removeClass('active');
			} else {
				$(".description").removeClass('active');
				$(target).addClass('active');
			}
		});

});



