/**
 * Copyright 2015 Longtail Ad Solutions Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 **/

(function () {

    /**
     * @const MEDIA_QUERIES
     * @type {Array.<Object>}
     */
    var MEDIA_QUERIES = [
        window.matchMedia('(max-width: 640px)'),
        window.matchMedia('(min-width: 641px) and (max-width: 960px)'),
        window.matchMedia('(min-width: 961px) and (max-width: 1280px)'),
        window.matchMedia('(min-width: 1281px) and (max-width: 1680px)'),
        window.matchMedia('(min-width: 1681px)')
    ];

    angular
        .module('app.core')
        .directive('jwCardSlider', cardSliderDirective);

    /**
     * @ngdoc directive
     * @name app.core.directive:jwCardSlider
     *
     * @description
     * # jwCardSlider
     * The `jwCardSlider` can be used to create a horizontal list of cards which can be moved horizontally. Each item
     * will be rendered in the {@link app.core.directive:jwCard `jwCard`} directive.
     *
     * @scope
     *
     * @param {app.core.feed}       feed            Feed which will be displayed in the slider.
     * @param {boolean|string=}     header          Text which will be displayed in the title or false if no title
     *                                              should be displayed.
     * @param {number=}             spacing         Spacing between cards.
     * @param {Array|number=}       visibleItems    How many items should be visible. Can either be a fixed number or an
     *                                              array with different values for multiple screen sizes.
     *
     *                                              |index|size|
     *                                              |--|--|
     *                                              |0|<=640px|
     *                                              |1|\>640px and <=960px|
     *                                              |2|\>960px and <=1280px|
     *                                              |3|\>1280px and <=1680px|
     *                                              |4|\>1680px|
     *
     *                                              For example, when the current window width is 800px and the
     *                                              visibleItems value is `[1,2,4,6,7]` the result will be 2.
     *
     *                                              of visible items.
     * @param {string=}             maxWidth        Slide maximum width relatively to slider width.
     * @param {string=}             maxHeight       Slide maximum width relatively to window height.
     * @param {boolean=}            featured        Featured slider flag
     *
     * @requires app.core.cardSliderCache
     * @requires app.core.utils
     * @example
     *
     * ```
     * <jw-card-slider feed="vm.feed" spacing="0" visible-items="1" featured="true"></jw-card-slider>
     * <jw-card-slider feed="vm.feed" spacing="12" visible-items="[2,2,3,4,5]" featured="false"
     * channel-title="'Videos'"></jw-card-slider>
     * ```
     */

    cardSliderDirective.$inject = ['$timeout', 'cardSliderCache', 'utils'];
    function cardSliderDirective ($timeout, cardSliderCache, utils) {

        return {
            scope:            {
                header:       '=?',
                feed:         '=',
                maxWidth:     '=',
                maxHeight:    '=',
                visibleItems: '=',
                featured:     '=',
                spacing:      '=',
                onCardClick:  '='
            },
            replace:          true,
            controller:       angular.noop,
            controllerAs:     'vm',
            bindToController: true,
            templateUrl:      'views/core/cardSlider.html',
            link:             link
        };

        function link (scope, element) {

            var visibleSlides   = 0,
                index           = 0,
                startCoords     = null,
                animation       = null,
                translateX      = 0,
                slideWidth      = 0,
                feedId          = scope.vm.feed.feedid,
                forEach         = angular.forEach,
                $               = element[0].querySelector.bind(element[0]),
                resizeDebounced = utils.debounce(resize, 100);

            scope.vm.slideLeft    = slideLeft;
            scope.vm.slideRight   = slideRight;
            scope.vm.slideToIndex = slideToIndex;

            activate();

            ////////////////////////

            /**
             * Initialize the directive.
             */
            function activate () {

                var classNameSuffix = scope.vm.featured ? 'featured' : 'default',
                    className       = 'jw-card-slider--' + classNameSuffix;

                window.addEventListener('resize', resizeDebounced);

                $('.jw-card-slider-container').addEventListener('touchstart', onTouchStart, false);

                element.addClass(className);

                if (scope.vm.featured) {

                    angular.element($('.jw-card-slider-indicators'))
                        .addClass('is-visible');
                }

                scope.$on('$destroy', destroy);

                // restore slider state if stored in cardSliderCache service
                cardSliderCache.get(feedId, function (state) {
                    index = state.index;
                });

                $timeout(resize, 50);
            }

            /**
             * Handle $destroy event
             */
            function destroy () {

                window.removeEventListener('resize', resizeDebounced);

                if (!feedId) {
                    return;
                }

                cardSliderCache.save(feedId, {
                    index: index
                });
            }

            /**
             * Slide amount of visible items to the left
             */
            function slideLeft () {

                if (canSlideLeft()) {
                    index = Math.max(0, index - visibleSlides);
                    update(true);
                }
            }

            /**
             * Slide amount of visible items to the right
             */
            function slideRight () {

                if (canSlideRight()) {
                    index = Math.min(getMaxIndex(), index + visibleSlides);
                    update(true);
                }
            }

            /**
             * Slide to the given index
             * @param {number} toIndex
             */
            function slideToIndex (toIndex) {

                if (toIndex !== index) {
                    index = Math.min(getMaxIndex(), Math.max(0, toIndex));
                    update(true);
                }
            }

            /**
             * Returns true if the slider can slide to the left
             * @returns {boolean}
             */
            function canSlideLeft () {

                return index > 0;
            }

            /**
             * Returns true if the slider can slide to the right
             * @returns {boolean}
             */
            function canSlideRight () {

                return index < getMaxIndex();
            }

            /**
             * Update slider and slides
             * @param {boolean} animate Animate the slider to the new position
             */
            function update (animate) {

                var listWidth = $('.jw-card-slider-list').offsetWidth,
                    offset    = 0;

                if (scope.vm.featured) {
                    offset = (listWidth - slideWidth) / 2;
                }

                translateX = (index * (slideWidth + scope.vm.spacing)) * -1;
                translateX += offset;

                updateSlides();
                updateIndicator();

                $('.jw-card-slider-button--left').classList[canSlideLeft() ? 'remove' : 'add']('is-disabled');
                $('.jw-card-slider-button--right').classList[canSlideRight() ? 'remove' : 'add']('is-disabled');

                moveSlider(translateX, animate);
            }

            /**
             * Update all slides
             */
            function updateSlides () {

                forEach($('.jw-card-slider-list').children, function (slide, slideIndex) {

                    var jwCard        = slide.querySelector('.jw-card'),
                        isVisible     = slideIndex >= index && slideIndex < index + visibleSlides,
                        isVisibleFunc = isVisible ? 'add' : 'remove',
                        isCompactFunc = slideWidth < 200 ? 'add' : 'remove';

                    slide.style.marginRight = scope.vm.spacing + 'px';
                    slide.style.width       = slideWidth + 'px';

                    slide.classList[isVisibleFunc]('is-visible');

                    if (jwCard) {
                        jwCard.classList[isVisibleFunc]('is-visible');
                        jwCard.classList[isCompactFunc]('is-compact');
                    }
                });
            }

            /**
             * Update the indicator
             */
            function updateIndicator () {

                var indicator = $('.jw-card-slider-indicators');

                if (!indicator) {
                    return;
                }

                forEach(indicator.children, function (indicator, indicatorIndex) {

                    var isActive = indicatorIndex >= index && indicatorIndex < index + visibleSlides,
                        func     = isActive ? 'add' : 'remove';

                    indicator.classList[func]('is-active');
                });
            }

            /**
             * Get item count based on matching mediaQuery
             *
             * @param {Array} visibleItems
             * @returns {number}
             */
            function getResponsiveItemCount (visibleItems) {

                var index = MEDIA_QUERIES.findIndex(function (query) {
                    return query.matches;
                });

                if (!angular.isNumber(visibleItems[index])) {
                    return 1;
                }

                return visibleItems[index];
            }

            /**
             * Get window height
             * @returns {Number}
             */
            function getWindowHeight () {

                return window.outerHeight || window.innerHeight;
            }

            /**
             * Handle resize event
             */
            function resize () {

                var listWidth    = $('.jw-card-slider-list').offsetWidth,
                    visibleItems = scope.vm.visibleItems,
                    percent, maxHeight;

                if (angular.isArray(visibleItems)) {
                    visibleItems = getResponsiveItemCount(visibleItems);
                }

                visibleSlides = visibleItems;
                slideWidth    = (listWidth / visibleSlides) - scope.vm.spacing;

                // if maxWidth is set, calculate width based on list width
                if (angular.isString(scope.vm.maxWidth)) {
                    percent    = parseInt(scope.vm.maxWidth) / 100;
                    slideWidth = Math.min(listWidth * percent, slideWidth);
                }

                // if maxHeight is set, calculate maxWidth based on window.outerHeight.
                if (angular.isString(scope.vm.maxHeight)) {
                    percent   = parseInt(scope.vm.maxHeight) / 100;
                    maxHeight = percent * getWindowHeight();

                    slideWidth = Math.min(maxHeight / (9 / 16), slideWidth);
                }

                update(false);
            }

            /**
             * Handle touchstart event
             * @param {Event} event
             */
            function onTouchStart (event) {

                var coords         = getCoords(event),
                    touchContainer = $('.jw-card-slider-container');

                touchContainer.addEventListener('touchmove', onTouchMove);
                touchContainer.addEventListener('touchend', onTouchEnd);
                touchContainer.addEventListener('touchcancel', onTouchCancel);

                startCoords = coords;
                element.addClass('is-sliding');
            }

            /**
             * Handle touchmove event
             * @param {Event} event
             */
            function onTouchMove (event) {

                var coords         = getCoords(event),
                    distance       = startCoords.x - coords.x,
                    deltaX         = Math.abs(distance),
                    containerWidth = $('.jw-card-slider-container').offsetWidth;

                // first item
                if (index === 0 && distance < 0) {
                    distance = Math.min(50, easeOutDistance(deltaX, containerWidth)) * -1;
                }
                // last item
                else if (index >= getMaxIndex() && distance > 0) {
                    distance = Math.min(50, easeOutDistance(deltaX, containerWidth));
                }

                if (deltaX > 20) {
                    event.preventDefault();
                }

                moveSlider(translateX - distance, false);
            }

            /**
             * Handle touchend event
             * @param {Event} event
             */
            function onTouchEnd (event) {

                var coords   = getCoords(event),
                    distance = startCoords.x - coords.x;

                if (distance < -50 && canSlideLeft()) {
                    slideLeft();
                }
                else if (distance > 50 && canSlideRight()) {
                    slideRight();
                }
                else {
                    update(true);
                }

                afterTouchEnd();
            }

            /**
             * Handle touchcancel event
             */
            function onTouchCancel () {

                update(true);
                afterTouchEnd();
            }

            /**
             * Remove touch event listeners and remove className 'is-hiding'
             */
            function afterTouchEnd () {

                var touchContainer = $('.jw-card-slider-container');

                startCoords = null;

                touchContainer.removeEventListener('touchmove', onTouchMove);
                touchContainer.removeEventListener('touchend', onTouchEnd);
                touchContainer.removeEventListener('touchcancel', onTouchCancel);

                element.removeClass('is-sliding');
            }

            /**
             * Move the slider to the given offset with or without animation.
             * @param {number} offset New offset in pixels
             * @param {boolean} animate Animate flag
             */
            function moveSlider (offset, animate) {

                if (animation && animation._active) {
                    animation.kill();
                }

                animation = window.TweenLite
                    .to($('.jw-card-slider-list'), animate ? 0.3 : 0, {x: offset, z: 0.01});
            }

            /**
             * Return max slide index
             * @returns {number}
             */
            function getMaxIndex () {

                return scope.vm.feed.playlist.length - visibleSlides;
            }

            /**
             * Get coords object from native touch event. Original code from ngTouch.
             *
             * @param {Event} event
             * @returns {{x: (number), y: (number)}}
             */
            function getCoords (event) {

                var originalEvent = event.originalEvent || event,
                    touches       = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches
                        : [originalEvent],
                    e             = (originalEvent.changedTouches && originalEvent.changedTouches[0]) || touches[0];

                return {
                    x: e.clientX,
                    y: e.clientY
                };
            }

            /**
             * Ease out the given distance
             *
             * @param {number} current Current distance
             * @param {number} total Total distance
             * @returns {number}
             */
            function easeOutDistance (current, total) {

                return Math.sin((0.5 / total) * current) * current;
            }
        }
    }

}());