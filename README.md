# jQuery DumbCrossFade
jQuery DumbCrossFade is intended to be a light-weight slide transition that enables external manipulation.

## Requirements
- jQuery 1.7.2
  - DumbCrossFade is dependent on pre-1.8 behavior for smooth animation.
  - If you are using a newer version of jQuery (and you should be), please consider an alternative carousel library, e.g. Ken Wheeler's [Slick](https://kenwheeler.github.io/slick/)

## Usage
option parameters:
```
	slideType		: can be one of the following: 'slidehorizontal', 'slidevertical', 'fade', default 'slidehorizontal'  
	index			: integer, is zero-based, is what item to start from, default 0  
	showTime		: integer,  is how long to show an item in milliseconds, default 5000  
	transitionTime		: integer, is how long the fade takes in milliseconds, default 1000  
	doHoverPause		: boolean, sets if pausing on mouse over is enabled or not, default true  
	maxZIndex		: integer, is the z-index of the element being faded into view. The faded out is maxZIndex - 1, default 100  
	slideChange		: event function, is fired when the slide has changed, passes in index of current slide, default null  
	slideDirection	: can be one of the following: 'forward', 'backward', default 'forward'  
	fadeInOut		: only useful when slideType is 'slidehorizontal' or 'slidevertical' for a transition slide-wipe affect, default false  
  
	//You can use options like so:  
	var options = {  
		'doHoverPause' : false,  
		slideChange : function (currentSlideIndex) {  
			alert(currentSlideIndex);  
		}  
	};  
	$('.slide').dumbCrossFade(options);  
  
//instance methods:  
	$(jquerySelector).dumbCrossFade('stop')			: stops auto playing slides  
	$(jquerySelector).dumbCrossFade('start')			: starts auto playing slides  
	$(jquerySelector).dumbCrossFade('jump',index)	: jumps to slide index specified, zero-based index  
	$(jquerySelector).dumbCrossFade('next')			: goes to the next slide  
	$(jquerySelector).dumbCrossFade('previous')		: goes to the previous slide  
```  

Supports full jQuery chaining, instance methods and settings override.  
for example:  
```
$('.slides').dumbCrossFade();  
  
$('a.next').click(function() {  
	$('.slides').dumbCrossFade('next');  
});
```

## Contributors
This is a new repository for an old project.
See [CONTRIBUTORS](CONTRIBUTORS.md) for details.

## License

This repository is licensed under the GNU Lesser General Public License v2.1.  
See [LICENSE](LICENSE.md) for details.
