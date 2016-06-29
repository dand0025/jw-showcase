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
        element, $scope, $compile;

    beforeEach(function () {
        module('app');
        module('app.partials');
    });

    beforeEach(inject(function ($rootScope, _$compile_) {
        $scope      = $rootScope.$new();
        $scope.feed = feed;
        $compile    = _$compile_;
    }));

    afterEach(function () {
        document.body.removeChild(element[0]);
        element = null;
    });

    function compileDirective (htmlText) {
        element = $compile(htmlText)($scope);
        $scope.$apply();
        document.body.appendChild(element[0]);
    }

    it('should render an card slider', function () {
        compileDirective('<jw-card-slider feed="feed"></jw-card-slider>');
        expect(element.hasClass('jw-card-slider')).toBeTruthy();
        expect(element.hasClass('jw-card-slider--default')).toBeTruthy();
    });

    it('should render an featured card slider', function () {
        compileDirective('<jw-card-slider feed="feed" featured="true"></jw-card-slider>');
        expect(element.hasClass('jw-card-slider')).toBeTruthy();
        expect(element.hasClass('jw-card-slider--featured')).toBeTruthy();
    });

    it('should show add the `is-visible` className to the first slide', function (done) {
        compileDirective('<jw-card-slider feed="feed" visible-items="1"></jw-card-slider>');
        setTimeout(function () { // resize is delayed
            var slides = element[0].querySelectorAll('.jw-card-slider-slide');
            expect(slides[0].classList.contains('is-visible')).toBeTruthy();
            expect(slides[1].classList.contains('is-visible')).toBeFalsy();
            done();
        }, 150);
    });

    it('should show add the `is-visible` className to the first and second slide', function (done) {
        compileDirective('<jw-card-slider feed="feed" visible-items="2"></jw-card-slider>');
        setTimeout(function () { // resize is delayed
            var slides = element[0].querySelectorAll('.jw-card-slider-slide');
            expect(slides[0].classList.contains('is-visible')).toBeTruthy();
            expect(slides[1].classList.contains('is-visible')).toBeTruthy();
            expect(slides[2].classList.contains('is-visible')).toBeFalsy();
            done();
        }, 150);
    });

    it('should slide to the right', function (done) {
        compileDirective('<jw-card-slider feed="feed" visible-items="1"></jw-card-slider>');
        setTimeout(function () { // resize is delayed
            // before click
            var slides = element[0].querySelectorAll('.jw-card-slider-slide');
            expect(slides[0].classList.contains('is-visible')).toBeTruthy();
            expect(slides[1].classList.contains('is-visible')).toBeFalsy();

            // click
            element[0].querySelector('.jw-card-slider-button--right').click();
            expect(slides[0].classList.contains('is-visible')).toBeFalsy();
            expect(slides[1].classList.contains('is-visible')).toBeTruthy();
            done();
        }, 150);
    });

    it('should slide to the left', function (done) {
        compileDirective('<jw-card-slider feed="feed" visible-items="1"></jw-card-slider>');
        setTimeout(function () { // resize is delayed
            // before click
            var slides = element[0].querySelectorAll('.jw-card-slider-slide');
            element[0].querySelector('.jw-card-slider-button--right').click();
            expect(slides[0].classList.contains('is-visible')).toBeFalsy();
            expect(slides[1].classList.contains('is-visible')).toBeTruthy();

            // click
            element[0].querySelector('.jw-card-slider-button--left').click();
            expect(slides[0].classList.contains('is-visible')).toBeTruthy();
            expect(slides[1].classList.contains('is-visible')).toBeFalsy();
            done();
        }, 150);
    });

    it('should add spacing between slides', function (done) {
        compileDirective('<jw-card-slider feed="feed" visible-items="2" spacing="20"></jw-card-slider>');
        setTimeout(function () { // resize is delayed
            var slides = element[0].querySelectorAll('.jw-card-slider-slide');
            expect(slides[0].style.marginRight).toEqual('20px');
            done();
        }, 150);
    });
});