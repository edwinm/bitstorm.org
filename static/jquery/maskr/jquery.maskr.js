/**
 * @preserve maskr v1.1
 * http://www.bitstorm.org/
 *
 * Copyright 2011, Edwin Martin
 * Dual licensed under MIT and GPL2
 */
jQuery.fn.maskr = function(map, data, index) {
	var isXml = data.nodeType || (typeof Document == "object" && data instanceof Document) || data instanceof jQuery;

	return this.each(function() {
		for (var rule in map) {
			// Parse rule in components: 1@2{3}
			var ruleParts = rule.match(/([^@{]*)(@[^{]*)?({.*})?/),
			// Find subelement or root when first part of rule is empty
			el = ruleParts[1] ? $(this).find(ruleParts[1]) : $(this),
			str, parts, i;

			switch (typeof map[rule]) {
				case 'string':
					parts = map[rule].split('|');
					str = isXml ? $(parts[0], data).text() : data[parts[0]];
					var strParsed = applyFunctions(str, parts);
					replaceText(el, strParsed[0], ruleParts, strParsed[1]);
					break;

				case 'object':
					parts = map[rule][0].split('|');
					str = parts[0];
					var childData = isXml ? $(str, data) : data[str];
					// Make non-array a one-element array
					if (typeof childData.length == 'undefined') {
						childData = [childData];
					}
					if (childData && childData.length) { // Work on available data
						// Make a clean clone to be used for other clones
						var clone = el.clone(true);
						var lastElement;
						if (map[rule].length == 1) {
							// Mapping to primitives
							for(i=0; i<childData.length; i++) {
								var value = isXml ? $(childData[i]).text() : childData[i];
								value = applyFunctions(value, parts);
								if (i==0) { // Apply data to first to element
									lastElement = replaceText(el, value[0], ruleParts, value[1]);
								} else { // Apply other data to clones
									lastElement = replaceText(clone.clone(), value[0], ruleParts, value[1]).insertAfter(lastElement);
								}
							}
						} else {
							var j = 0;
							for(i=0; i<childData.length; i++) {
								if (j==0) { // Apply data to first to element
									lastElement = el.maskr(map[rule][1], childData[i], j);
								} else { // Apply other data to clones
									lastElement = clone.clone().maskr(map[rule][1], childData[i], j).insertAfter(lastElement);
								}
								j++;
							}
						}
					} else {
						// Remove element when no data found
						el.remove();
					}
					break;

				case 'function':
					str = map[rule].call(el, data, index);
					if (typeof str != 'undefined') {
						replaceText(el, str, ruleParts);
					}
			}
		}
		
		// Replace text or fragment in element or attribute
		function replaceText(element, str, ruleParts, asHtml) {
			if (ruleParts[2]) {
				// In attribute
				var attribute = ruleParts[2].substr(1);
				if (ruleParts[3]) { // Using placeholder
					str = element.attr(attribute).replace(ruleParts[3], str);
				}
				element.attr(attribute, str);
			} else {
				// In element
				if (ruleParts[3]) { // Using placeholder
					str = element.text().replace(ruleParts[3], str);
				}
				element[asHtml || 'text'](str);
			}
			return element;
		}

		// Apply functions to value (fn:arg1:arg2...)
		function applyFunctions(value, parts) {
			var isHtml = false;
			var modifiers = parts.slice(1);
			for (var fn in modifiers) {
				if (modifiers[fn] == 'html') {
					isHtml = 'html'; // HTML modifier: apply as HTML
				} else {
					// Apply function
					var modifierOperand = modifiers[fn].split(':');
					value = jQuery.fn.maskr.fn[modifierOperand[0]].apply(value, modifierOperand.slice(1));
				}
			}
			return [value, isHtml];
		}
	});
};

// Add String prototype to functions
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String
jQuery.fn.maskr.fn = String.prototype;

// Add some handy functions
$.extend(jQuery.fn.maskr.fn, {
	"urlEncode": function() {return encodeURI(this)},
	"if": function(cond, trueValue, falseValue) {return this==cond ? trueValue : falseValue},
	"else": function(subst) {return ''+this ? this : subst}
});
