'use strict';

angular.module('clientApp')
  .directive('imgCropped', function () {
	  return {
	    restrict: 'E',
	    replace: true,
	    scope: { src:'@', selected:'&' },
	    link: function(scope,element, attr) {
	      var myImg;
	      var clear = function() {
	        if (myImg) {
	          myImg.next().remove();
	          myImg.remove();
	          myImg = undefined;
	        }
	      };
	      scope.$watch('src', function(nv) {
			scope.safeApply = function(fn) {
			  var phase = this.$root.$$phase;
			  if(phase == '$apply' || phase == '$digest') {
			    if(fn && (typeof(fn) === 'function')) {
			      fn();
			    }
			  } else {
			    this.$apply(fn);
			  }
			}           
	        clear();
	        if (nv) {
				element.after('<img />');
				myImg = element.next();        
				myImg.attr('src',nv);
				myImg.attr('id', 'belocal-img-crop');
				var imgWidth = myImg[0].naturalWidth;
	      		var imgHeight = myImg[0].naturalHeight;
				var quarterImgWidth = imgWidth / 4;
				var quarterImgHeight = imgHeight / 4;

				//figure out the display size of the image to make it responsive to screen size.
	            var width = angular.element('#profileImageModal').find('.crop-image-wrapper').width();
	            var height = (3/5) * width;
	        	angular.element('#belocal-img-crop').Jcrop({
	            trackDocument: true,
	            aspectRatio:5/3,
	            boxWidth: width,
	            boxHeight: height,
	            addClass: 'jcrop-centered',
	            //set the default crop selection area
	            setSelect: [quarterImgWidth, quarterImgHeight, imgWidth - quarterImgWidth, imgHeight - quarterImgHeight],
	            onSelect: function(x) {
	              scope.safeApply(function() {
	                scope.selected({cords: x});
	              });
	            }
	          });
	        }
	      });	      
	      scope.$on('$destroy', clear);
	    }
	  };
	})
  //need this filter to be applied to the src of imgCropped directive or else I get
  //cross domain error from angular when loading the image?!
  .filter('trusted', ['$sce', function ($sce) {
	    return function(url) {
	        return $sce.trustAsResourceUrl(url);
	    };
    }])
  
