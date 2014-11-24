(function () {
	var ucminer = window.ucminer = {};
	var processClick = function (e) {
		var dom = e.target,
			$dom = $(dom);
		console.log($dom.attr('type'));
		if ($dom.attr('type') == 'checkbox'
			|| ($dom.prop('tagName').toLowerCase() == 'label'
				&& (dom = $dom.find('input')[0])
				&& $(dom).attr('type') == 'checkbox')) {
			processCheckboxClick(e, dom.parentNode);
		}
		
		console.log($(dom).attr('type'));
		
	};
	var processCheckboxClick = function (e, label) {
		var prev = ucminer.lastClickedCheckbox,
			last = ucminer.lastClickedCheckbox = label,
			tprev = prev,
			tlast = last,
			status = prev.firstChild.checked;
		if (e.shiftKey && prev) {
			var prevBack = [],
				lastBack = [],
				found;
			while (!found) {
				var processed;
				prev = $(prev).next('label')[0];
				if (prev && $(prev).find('input').attr('type') == 'checkbox') {
					processed = true;
					if (prev == tlast) {
						found = prevBack;
						break;
					}
					prevBack.push(prev);
				}
				last = $(last).next('label')[0];
				if (last && $(last).find('input').attr('type') == 'checkbox') {
					processed = true;
					if (last == tprev) {
						found = lastBack;
						break;
					}
					lastBack.push(last);
				}
				if (!processed) // not related
					break;
			}
			if (found && found.length) {
				var idx = 0,
					len = found.length;
				for ( ; idx < len; idx++) {
					found[idx].firstChild.checked = status;
				}
			}
		}
	}
	$(document.body).on('click', processClick);
})();