(function () {
	var ucminer = window.ucminer = {};
	ucminer.processClick = function (e) {
		var dom = e.target,
			$dom = $(dom);
		console.log($dom.attr('type'));
		if ($dom.attr('type') == 'checkbox'
			|| ($dom.prop('tagName').toLowerCase() == 'label'
				&& ((dom = $dom.find('input')[0]) && $(dom).attr('type') == 'checkbox'
					|| (dom = $dom.prev('input')[0]) && $(dom).attr('type') == 'checkbox'))) {
			var label = $(dom.parentNode).prop('tagName').toLowerCase() == 'label'?
				dom.parentNode : dom.nextSibling;
				
			processCheckboxClick(e, label);
		}
		
		console.log($(dom).attr('type'));
		
	};
	var processCheckboxClick = function (e, label) {
		var prev = ucminer.lastClickedCheckbox,
			last = ucminer.lastClickedCheckbox = label,
			tprev = prev,
			tlast = last,
			status;
		if (!prev) return;

		if (e.shiftKey && prev) {
			var prevBack = [$(tlast).find('input')[0] || $(tlast).prev('input')[0]],
				lastBack = [$(tlast).find('input')[0] || $(tlast).prev('input')[0]],
				found;
			status = prevBack[0].checked;
			while (!found) {
				var processed;
				prev = $(prev).next('label')[0];
				if (prev
					&& ($(prev).find('input').attr('type') == 'checkbox'
						|| $(prev).prev('input').attr('type') == 'checkbox')) {
					processed = true;
					if (prev == tlast) {
						found = prevBack;
						break;
					}
					prevBack.push($(prev).find('input')[0] || $(prev).prev('input')[0]);
				}
				last = $(last).next('label')[0];
				if (last
					&& ($(last).find('input').attr('type') == 'checkbox'
						|| $(last).prev('input').attr('type') == 'checkbox')) {
					processed = true;
					if (last == tprev) {
						found = lastBack;
						break;
					}
					lastBack.push($(last).find('input')[0] || $(last).prev('input')[0]);
				}
				if (!processed) // not related
					break;
			}
			if (found && found.length) {
				var idx = 0,
					len = found.length;
				for ( ; idx < len; idx++) {
					found[idx].checked = status;
				}
			}
		}
	}
	setTimeout(function () {
		$(document.body).on('click', window.ucminer.processClick);
	}, 0);
})();