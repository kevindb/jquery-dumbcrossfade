/*
* jQuery dumbCrossFade
* v2.1.0
* https://github.com/kevindb/jquery-dumbcrossfade
*
* jQuery DumbCrossFade is intended to be a light-weight slide transition that enables external manipulation.
*
* Copyright 2015 Kevin Morris
* Copyright 2009 Jason Sebring
*
* This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either version 2.1 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
*/

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery-1.7.2'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = function( root, jQuery ) {
			if ( jQuery === undefined ) {
				// require('jQuery') returns a factory that requires window to
				// build a jQuery instance, we normalize how we use modules
				// that require this pattern but the window provided is a noop
				// if it's defined (how jquery works)
				if ( typeof window !== 'undefined' ) {
					jQuery = require('jquery-1.7.2');
				}
				else {
					jQuery = require('jquery-1.7.2')(root);
				}
			}
			factory(jQuery);
			return jQuery;
		};
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($) {
	$.fn.dumbCrossFade = function(settings) {

		var publicAccessorLabel = 'dumbCrossFade.publicAccessor';
		var configLabel = 'dumbCrossFade.config';

		if (typeof(this.data(publicAccessorLabel)) !== 'undefined' && this.data(publicAccessorLabel) !== null) {
			var pa = this.data(publicAccessorLabel);
			var cg = this.data(configLabel);
			var args = Array.prototype.slice.apply(arguments);
			if (args.length > 0) {
				if (typeof(args[0]) === 'object') {
					if (settings) $.extend(cg, settings);
					var args = Array.prototype.slice.apply(arguments);
					if (args.length > 1) {
						args = args.slice(1,args.length);
					} else {
						pa.start();
						return this;
					}
				}
				if (arguments.length === 1) {
					pa[arguments[0]]();
				} else if (arguments.length > 1) {
					var args = Array.prototype.slice.apply(arguments);
					args = args.slice(1,args.length);
					pa[arguments[0]].apply(this,args);
				}
			}
			return this;
		}

		var config = {
			'slideType':'slidehorizontal',
			'index':0,
			'showTime':5000,
			'transitionTime':1000,
			'doHoverPause':true,
			'maxZIndex':100,
			'slideChange':null,
			'direction':'forward',
			'fadeInOut':false
		},
		timeOut = null,
		itemArray = [],
		blockAnimation = false,
		lastIndexRequest = -1,
		$self = this
		$window = $(window),
		$body = $('body');

		if (settings) $.extend(config, settings);

		function cancelSlideShow() {
			if (timeOut !== null) { window.clearTimeout(timeOut); timeOut = null; }
		}

		function doSlideShowNow() {
			if (blockAnimation) {
				if (arguments.length > 0) {
					lastIndexRequest = arguments[0];
				}
				return;
			}
			var currentIndex = config.index;
			var nextIndex = (arguments.length > 0) ? arguments[0] : (config.index >= itemArray.length - 1) ? 0 : config.index + 1;
			if (config.direction === 'backward') {
				if (currentIndex === 0) {
					nextIndex = itemArray.length - 1;
				} else {
					nextIndex = currentIndex - 1;
				}
			}
			if (currentIndex == nextIndex) { return; }
			var $f = itemArray[currentIndex].show(),
			$n = itemArray[nextIndex];
			blockAnimation = true;
			doneF = function () {
				$f.hide();
				if (config.fadeInOut) {
					$f.css({'opacity':'1.0'});
					$n.css({'opacity':'1.0'});
				}
				blockAnimation = false;
				if (lastIndexRequest != -1) {
					doSlideShowNow(lastIndexRequest);
					lastIndexRequest = -1;
				}
			};
			$f.css('z-index',(config.maxZIndex-1)+'');
			$n.css('z-index',config.maxZIndex+'');
			switch (config.slideType) {
				case 'slidehorizontal' :
					var pos = $f.position(),
					width = $f.width(),
					adjustX = '-='+width;
					if (config.direction === 'forward') {
						$n.css({'left':(parseInt(pos.left) + width) + 'px'});
					} else {
						$n.css({'left':(parseInt(pos.left) - width) + 'px'});
						adjustX = '+='+width;
					}
					if (config.fadeInOut) {
						$n.css({'opacity':'0','display':'block'});
						$f.animate({'left':adjustX,'opacity':'0'},config.transitionTime,'swing');
						$n.animate({'left':adjustX,'opacity':'1.0'},config.transitionTime,'swing',doneF);
					} else {
						$n.show();
						$f.animate({'left':adjustX},config.transitionTime,'swing');
						$n.animate({'left':adjustX},config.transitionTime,'swing',doneF);
					}
					break;
				case 'slidevertical' :
					var pos = $f.position(),
					height = $f.height(),
					adjustY = '-='+height;
					if (config.direction === 'forward') {
						$n.css({'top':(parseInt(pos.top) + height) + 'px','display':'block'});
					} else {
						$n.css({'top':(parseInt(pos.top) - height) + 'px','display':'block'});
						adjustY = '+='+height;
					}
					if (config.fadeInOut) {
						$n.css({'opacity':'0','display':'block'});
						$f.animate({'top':adjustY,'opacity':'0'},config.transitionTime,'swing');
						$n.animate({'top':adjustY,'opacity':'1.0'},config.transitionTime,'swing',doneF);
					}
					else {
						$n.show();
						$f.animate({'top':adjustY},config.transitionTime);
						$n.animate({'top':adjustY},config.transitionTime,doneF);
					}
					break;
				case 'fade' :
					$n.fadeIn(config.transitionTime,doneF);
					break;
			}
			if (config.slideChange !== null) {
				config.slideChange(nextIndex);
			}
			config.index = nextIndex;
		}

		function doSlideShow() {
			cancelSlideShow();
			timeOut = window.setTimeout(function() {
				doSlideShowNow();
				doSlideShow();
			},config.showTime);
		}

		$self.each(function() {
			(itemArray.length === config.index) ? $(this).show() : $(this).hide();
			if (itemArray.length === 0) {
				if (config.doHoverPause) {
					$(this).parent().hover(
						function() {
							cancelSlideShow();
						},
						function() {
							cancelSlideShow();
							doSlideShow();
						}
					);
				}
			}
			itemArray[itemArray.length] = $(this);
		});


		var publicAccessor = {
			'jump' : function (index) {
				cancelSlideShow();
				doSlideShowNow(index);
				return publicAccessor;
			},
			'start' : function () {
				$self.children().hide();
				itemArray[config.index].show();
				config.direction = 'forward';
				doSlideShow();
			},
			'stop' : function () {
				cancelSlideShow();
			},
			'next' : function () {
				config.direction = 'forward';
				cancelSlideShow();
				doSlideShowNow();
			},
			'previous' : function () {
				config.direction = 'backward';
				cancelSlideShow();
				doSlideShowNow();
			}
		};

		this.data(publicAccessorLabel,publicAccessor);
		this.data(configLabel,config);

		doSlideShow();

		return this;
	};
}));
