(function () {
	// avoid duplicated
	if (window.ucminer) return;
	// namespace ucminer
	var ucminer = window.ucminer = {};
	// called when click on element (bubble up to body)
	ucminer.processClick = function (e) {
		var dom = e.target, // trigger dom
			$dom = $(dom);  // $
		if ($dom.attr('type') == 'checkbox' // is checkbox or
			|| ($dom.prop('tagName').toLowerCase() == 'label' // is label and
				&& (dom=$('#'+$dom.attr('for'))[0] || $dom[0].firstChild) // is for a checkbox
				&& $(dom).attr('type') == 'checkbox')) {

			// process checkbox click with its label
			processCheckboxClick(e, dom);
		}		
	};
	var processCheckboxClick = function (e, checkbox) {
		if (ucminer.processingCheckboxClick) return;
		ucminer.processingCheckboxClick = true;
		var prev = ucminer.lastClickedCheckbox, // previous clicked label-checkbox
			last = ucminer.lastClickedCheckbox = checkbox, // current clicked label-checkbox
			tprev = prev, // store prev and last
			tlast = last,
			status;
		if (!prev) {
			delete ucminer.processingCheckboxClick;
			return; // no previous one, skip
		}
		if (e.shiftKey) {
			var prevParent = $(prev).parents('tr')[0],
				lastParent = $(last).parents('tr')[0];
			if (prevParent == lastParent) {
				status = ($('#'+$(prev).attr('for'))[0] || prev.firstChild).checked;
				var boxes = $(prevParent).find('input[type="checkbox"]'),
					idx = 0,
					len = boxes.length,
					cnt = 0;
				for ( ; idx < len; idx++) {
					var cbx = boxes[idx];
					if (cbx == prev || cbx == last)
						cnt++;
					if (cnt)
						cbx.checked = status;
					if (cnt == 2)
						break;
				}
			}
		}
		delete ucminer.processingCheckboxClick;
	}
	ucminer.adjustBtFrame = function (frame) {
		var div = frame.parentNode,
			inp,
			func = function () {
			if ($(div).hasClass('hover')) return; // hovered, do nothing
			if (inp = $(frame.contentWindow.document.body).find('.autocomplete.ac_input')[0]) {
				div.style.width = "200px";
				div.style.height = "50px";
				div.scrollLeft = 355;
				div.scrollTop = 162;
			} else {
				div.style.width = "350px";
				div.style.height = "350px";
			}
		}
		func();
		$(div).on('scroll', func);
		$(div).on('mouseover', function () {
			div.style.width = "500px";
			div.style.height = "500px";
			$(div).css('overflow', 'auto'),
				.addClass('hover');
			
		}).on('mouseout', function () {
			$(div).css('overflow', 'hidden')
				.removeClass('hover');
			func();
		});
	};
	$(document.body).on('click', window.ucminer.processClick);
	$(document.body).append(
		'<div style="position: fixed; left: 10px; top: 10px; width: 200px; height: 50px; overflow: hidden;"><iframe style="width: 802px; height: 611px;" src="http://www.urcosme.com/internal/Buzz/index/factory_id_search.php" id="btFrame" onload="window.ucminer.adjustBtFrame(this)"></ifreame></div>'
	);
})();