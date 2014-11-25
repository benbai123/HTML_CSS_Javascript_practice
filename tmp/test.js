(function () {
	// avoid duplicated
	if (window.ucminer) return;
	if  (jQuery) // put old jQuery to No-Conflict mode if any
		jQuery.noConflict();
	// load new jquery
	var b = document.getElementsByTagName('body')[0],
		s=document.createElement('script');
	s.type='text/javascript';
	s.src='//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js';
	b.appendChild(s);
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
			status;
		if (!prev) {
			delete ucminer.processingCheckboxClick;
			return; // no previous one, skip
		}
		if (e.shiftKey) {
			var prevParentTR = $(prev).parents('tr')[0],
				prevParentDiv = $(prev).parents('div')[0],
				parent = (prevParentTR == $(last).parents('tr')[0])?
					prevParentTR : (prevParentDiv == $(last).parents('div')[0])?
					prevParentDiv : null;
			if (parent) { // under the same tr or div
				status = prev.checked;
				var boxes = $(parent).find('input[type="checkbox"]'),
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
	ucminer.loadTrend = function (btn) {
		var div = btn.parentNode,
			expand = function () {
				div.style.width = "500px";
				div.style.height = "500px";
				$(div).css('overflow', 'auto')
					.addClass('hover');
				
			};
		$(div).empty()
			.append('<iframe style="width: 802px; height: 611px;" src="http://www.urcosme.com/internal/Buzz/index/factory_id_search.php" id="btFrame" onload="window.ucminer.adjustBtFrame(this)"></ifreame>');
		$(div).on('mouseover', expand);
	};
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
			};
		func();
		$(div).on('scroll', func);
		$(div).on('mouseout', function () {
			$(div).css('overflow', 'hidden')
				.removeClass('hover');
			func();
		});
	};
	setTimeout(function () { // wait jquery loaded
		$(document.body).on('click', window.ucminer.processClick);
		$(document.body).append(
			'<div style="position: fixed; left: 10px; top: 10px; width: 200px; height: 50px; overflow: hidden;"><button onclick="window.ucminer.loadTrend(this)">load Trend</button></div>'
		);
	}, 0);
})();