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

describe('jwCardSlider', function () {

    var feed = getFixture('feed'),
        element, $scope, $compile, $timeout, slides;

    beforeEach(function () {
        module('app');
        module('app.partials');
    });

    beforeEach(inject(function ($rootScope, _$compile_, _$timeout_) {
        $scope      = $rootScope.$new();
        $scope.feed = feed;
        $compile    = _$compile_;
        $timeout    = _$timeout_;
    }));

    afterEach(function () {
        document.body.removeChild(element[0]);
        element = null;
        slides  = null;
    });

    function resizeElement (width) {
        element.css('width', width + 'px');
        window.dispatchEvent(new Event('resize'));
        $timeout.flush();
    }

    function compileDirective (htmlText) {
        element = $compile(htmlText)($scope);
        document.body.appendChild(element[0]);
        element[0].style.width = '400px';
        $scope.$digest();
        $timeout.flush();
    }

    it('should render a card slider', function () {
        compileDirective('<jw-card-slider feed="feed"></jw-card-slider>');
        expect(element.hasClass('jw-card-slider')).toBeTruthy();
        expect(element.hasClass('jw-card-slider--default')).toBeTruthy();
    });

    it('should render a featured card slider', function () {
        compileDirective('<jw-card-slider feed="feed" featured="true"></jw-card-slider>');
        expect(element.hasClass('jw-card-slider')).toBeTruthy();
        expect(element.hasClass('jw-card-slider--featured')).toBeTruthy();
    });

    it('should add `is-visible` className to the first slide', function () {
        compileDirective('<jw-card-slider feed="feed" visible-items="1"></jw-card-slider>');
        slides = element[0].querySelectorAll('.jw-card-slider-slide');
        expect(slides[0].classList.contains('is-visible')).toBeTruthy();
        expect(slides[1].classList.contains('is-visible')).toBeFalsy();
    });

    it('should add `is-visible` className to the first and second slide', function () {
        compileDirective('<jw-card-slider feed="feed" visible-items="2"></jw-card-slider>');
        slides = element[0].querySelectorAll('.jw-card-slider-slide');
        expect(slides[0].classList.contains('is-visible')).toBeTruthy();
        expect(slides[1].classList.contains('is-visible')).toBeTruthy();
        expect(slides[2].classList.contains('is-visible')).toBeFalsy();
    });

    it('should slide to the right', function () {
        compileDirective('<jw-card-slider feed="feed" visible-items="1"></jw-card-slider>');
        // before click
        slides = element[0].querySelectorAll('.jw-card-slider-slide');
        expect(slides[0].classList.contains('is-visible')).toBeTruthy();
        expect(slides[1].classList.contains('is-visible')).toBeFalsy();
        // click
        element[0].querySelector('.jw-card-slider-button--right').click();
        expect(slides[0].classList.contains('is-visible')).toBeFalsy();
        expect(slides[1].classList.contains('is-visible')).toBeTruthy();
    });

    it('should slide to the left', function () {
        compileDirective('<jw-card-slider feed="feed" visible-items="1"></jw-card-slider>');
        // before click
        slides = element[0].querySelectorAll('.jw-card-slider-slide');
        element[0].querySelector('.jw-card-slider-button--right').click();
        expect(slides[0].classList.contains('is-visible')).toBeFalsy();
        expect(slides[1].classList.contains('is-visible')).toBeTruthy();
        // click
        element[0].querySelector('.jw-card-slider-button--left').click();
        expect(slides[0].classList.contains('is-visible')).toBeTruthy();
        expect(slides[1].classList.contains('is-visible')).toBeFalsy();
    });

    it('should add spacing between slides', function () {
        compileDirective('<jw-card-slider feed="feed" visible-items="2" spacing="20"></jw-card-slider>');
        slides = element[0].querySelectorAll('.jw-card-slider-slide');
        expect(slides[0].style.marginRight).toEqual('20px');
    });

    it('should be responsive when passing an array to `visible-items` attribute in 400px', function () {
        compileDirective('<jw-card-slider feed="feed" visible-items="[1,2,3,4,5]" spacing="20"></jw-card-slider>');
        resizeElement(400);
        slides = element[0].querySelectorAll('.jw-card-slider-slide');
        expect(slides[0].classList.contains('is-visible')).toBeTruthy();
        expect(slides[1].classList.contains('is-visible')).toBeFalsy();
    });

    it('should be responsive when passing an array to `visible-items` attribute in 700px', function () {
        compileDirective('<jw-card-slider feed="feed" visible-items="[1,2,3,4,5]" spacing="20"></jw-card-slider>');
        resizeElement(700);
        slides = element[0].querySelectorAll('.jw-card-slider-slide');
        expect(slides[0].classList.contains('is-visible')).toBeTruthy();
        expect(slides[1].classList.contains('is-visible')).toBeTruthy();
        expect(slides[2].classList.contains('is-visible')).toBeFalsy();
    });

    it('should be responsive when passing an array to `visible-items` attribute in 1000px', function () {
        compileDirective('<jw-card-slider feed="feed" visible-items="[1,2,3,4,5]" spacing="20"></jw-card-slider>');
        resizeElement(1000);
        slides = element[0].querySelectorAll('.jw-card-slider-slide');
        expect(slides[0].classList.contains('is-visible')).toBeTruthy();
        expect(slides[1].classList.contains('is-visible')).toBeTruthy();
        expect(slides[2].classList.contains('is-visible')).toBeTruthy();
        expect(slides[3].classList.contains('is-visible')).toBeFalsy();
    });

    it('should be responsive when passing an array to `visible-items` attribute in 1500px', function () {
        compileDirective('<jw-card-slider feed="feed" visible-items="[1,2,3,4,5]" spacing="20"></jw-card-slider>');
        resizeElement(1500);
        slides = element[0].querySelectorAll('.jw-card-slider-slide');
        expect(slides[0].classList.contains('is-visible')).toBeTruthy();
        expect(slides[1].classList.contains('is-visible')).toBeTruthy();
        expect(slides[2].classList.contains('is-visible')).toBeTruthy();
        expect(slides[3].classList.contains('is-visible')).toBeTruthy();
        expect(slides[4].classList.contains('is-visible')).toBeFalsy();
    });

    it('should be responsive when passing an array to `visible-items` attribute in 2000px', function () {
        compileDirective('<jw-card-slider feed="feed" visible-items="[1,2,3,4,5]" spacing="20"></jw-card-slider>');
        resizeElement(2000);
        slides = element[0].querySelectorAll('.jw-card-slider-slide');
        expect(slides[0].classList.contains('is-visible')).toBeTruthy();
        expect(slides[1].classList.contains('is-visible')).toBeTruthy();
        expect(slides[2].classList.contains('is-visible')).toBeTruthy();
        expect(slides[3].classList.contains('is-visible')).toBeTruthy();
        expect(slides[4].classList.contains('is-visible')).toBeTruthy();
        expect(slides[5].classList.contains('is-visible')).toBeFalsy();
    });
});
