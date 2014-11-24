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
				&& (dom=$('#'+$dom.attr('for'))[0] || $dom[0].firstChild) // is for a checkbox
				&& $(dom).attr('type') == 'checkbox')) {
			console.log('dom = ' + dom);
			console.log('dom id = ' + $(dom).attr('id'));
			// find the label again
			var label = $('label[for='+$(dom).attr('id')+']')[0] || dom.parentNode;
			console.log('label again = ' + label);
			// process checkbox click with its label
			processLabeledCheckboxClick(e, label);
		}
		console.log($(dom).attr('type'));
		
	};
	var processLabeledCheckboxClick = function (e, label) {
		if (ucminer.processingLabeledCheckboxClick) return;
		ucminer.processingLabeledCheckboxClick = true;
		console.log('processCheckboxClick');
		var prev = ucminer.lastClickedCheckbox, // previous clicked label-checkbox
			last = ucminer.lastClickedCheckbox = label, // current clicked label-checkbox
			tprev = prev, // store prev and last
			tlast = last,
			status;
		console.log('prev = ' + prev);
		console.log('last = ' + last);
		if (!prev) {
			delete ucminer.processingLabeledCheckboxClick;
			return; // no previous one, skip
		}
		console.log('shift key = ' + e.shiftKey);
		if (e.shiftKey && prev) {
			var prevBack = [tlast],
				lastBack = [tlast],
				found, processed;
			status = ($('#'+$(prev).attr('for'))[0] || prev.firstChild).checked;
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
				if (!processed) {// not related
					console.log('not processed');
					break;
				}
			}
			if (found && found.length) {
				var idx = 0,
					len = found.length,
					label;
				for ( ; idx < len; idx++) {
					label = found[idx];
					($('#'+$(label).attr('for'))[0] || label.firstChild).checked = status;
				}
			}
		}
		delete ucminer.processingLabeledCheckboxClick;
	}
	ucminer.adjustBtFrame = function (frame) {
		frame.contentWindow.scrollTo(746, 162);
	};
	setTimeout(function () {
		$(document.body).on('click', window.ucminer.processClick);
	}, 0);
	$(document.body).append(
		'<div style="position: fixed; left: 10px; top: 10px; width: 200px; height: 50px; overflow: hidden;"><iframe style="width: 2000px; height: 2000px;" src="http://www.urcosme.com/internal/Buzz/index/factory_id_search.php" id="btFrame" onload="window.ucminer.adjustBtFrame(this)"></ifreame></div>'
	);
})();