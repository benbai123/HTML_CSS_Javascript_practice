(function () {
	// avoid duplicated
	if (window.ucminer) return;
	// namespace ucminer
	var ucminer = window.ucminer = {};
	// called when click on element (bubble up to body)
	ucminer.processClick = function (e) {
		var dom = e.target, // trigger dom
			$dom = $(dom);  // $
		console.log($dom.attr('type'));
		if ($dom.attr('type') == 'checkbox' // is checkbox or
			|| ($dom.prop('tagName').toLowerCase() == 'label' // is label and
				&& (dom=$('#'+$dom.attr('for'))[0]) // is for a checkbox
				&& $(dom).attr('type') == 'checkbox')) {
			// find the label again
			var label = $('label[for='+$(dom).attr('id')+']')[0];
			// process checkbox click with its label
			processLabeledCheckboxClick(e, label);
		}
		console.log($(dom).attr('type'));
		
	};
	var processLabeledCheckboxClick = function (e, label) {
		console.log('processCheckboxClick');
		var prev = ucminer.lastClickedCheckbox, // previous clicked label-checkbox
			last = ucminer.lastClickedCheckbox = label, // current clicked label-checkbox
			tprev = prev, // store prev and last
			tlast = last,
			status;
		if (!prev) return; // no previous one, skip

		if (e.shiftKey && prev) {
			var prevBack = [tlast],
				lastBack = [tlast],
				found, processed;
			status = $('#'+$(prev).attr('for'))[0].checked;
			while (!found) {
				processed = false;
				prev = $(prev).nextAll('label:first')[0];
				if (prev) {
					processed = true;
					if (prev == tlast) {
						console.log('found is prev back');
						found = prevBack;
						break;
					}
					prevBack.push(prev);
				}
				last = $(last).nextAll('label:first')[0];
				if (last) {
					processed = true;
					if (last == tprev) {
						console.log('found is last back');
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
					len = found.length,
					label;
				for ( ; idx < len; idx++) {
					label = found[idx];
					$('#'+$(label).attr('for'))[0].checked = status;
				}
			}
		}
	}
	setTimeout(function () {
		$(document.body).on('click', window.ucminer.processClick);
	}, 0);
})();