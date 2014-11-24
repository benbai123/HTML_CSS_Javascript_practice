(function () {
	var processClick = function (e) {
		var dom = e.target,
			$dom = $(dom);
		console.log($dom.attr('tagName'));
		if ($dom.attr('type') == 'checkbox'
			|| ($dom.prop('tagName').toLowerCase() == 'label'
				&& (dom = $dom.find('input')[0])
				&& $(dom).attr('type') == 'checkbox')) {
			processCheckboxClick();
		}
		
		console.log($(dom).attr('tagName'));
		
	};
	var processCheckboxClick = function () {
		alert('process checkbox click');
	}
	$(document.body).on('click', processClick);
})();