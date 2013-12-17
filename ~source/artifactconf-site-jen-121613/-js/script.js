//Form Clearing
$('input').focus(function() {
		if($(this).val() == $(this).attr("rel")) $(this).val("");
});

$('input').blur(function() {
   	if(!$(this).val()) $(this).val($(this).attr("rel"));
});

//Fitvids
$("#video").fitVids();