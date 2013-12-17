//Requires jQuery
/* global console */

var AC13 = AC13 || {};

$(function(){ "strict";

	var getWidth = function(){
		return $('body').width();
	};

	$('.speaker_list').live().on('click','.img_wrapper', function(){

		var bwidth = getWidth(),
			$image = $(this),
			$display = $('.speaker_display'),
			$parent = $image.parent('li'),
			$bio = $parent.find('.speaker_bio'),
			$info = $parent.find('.speaker_info'),
			$c_image = $image.html(),
			$c_bio = $bio.html(),
			$c_info = $info.html();

		$('.img_wrapper .active').removeClass('active');
		$image.find('span').addClass('active');

		if( bwidth >= 769 ){

			$display
				.find('.img_wrapper span')
				.html($c_image)
				.end()
				.find('.speaker_info')
				.html($c_info)
				.end()
				.find('.speaker_bio')
				.html($c_bio);
		}
	});
});