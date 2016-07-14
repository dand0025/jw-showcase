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

describe('jwCard', function () {

    var element, $scope, $compile,
        feed = getFixture('feed');

    beforeEach(function () {
        module('app');
        module('app.partials');

        inject(function ($rootScope, _$compile_) {
            $scope               = $rootScope.$new();
            $scope.item          = feed.playlist[0];
            $scope.handleOnClick = angular.noop;
            $compile             = _$compile_;
        });
    });

    afterEach(function () {
        document.body.removeChild(element[0]);
        element = null;
    });

    function compileDirective (htmlText) {
        element = $compile(htmlText)($scope);
        document.body.appendChild(element[0]);
        $scope.$digest();
    }

    it('should render a card element', function () {
        compileDirective('<jw-card item="item"></jw-card>');
        expect(element.hasClass('jw-card')).toBeTruthy();
        expect(element.hasClass('jw-card--default')).toBeTruthy();
    });

    it('should render a featured card element', function () {
        compileDirective('<jw-card item="item" featured="true"></jw-card>');
        expect(element.hasClass('jw-card')).toBeTruthy();
        expect(element.hasClass('jw-card--featured')).toBeTruthy();
    });

    it('should show the card title when show-title is true', function () {
        compileDirective('<jw-card item="item" show-title="true"></jw-card>');
        expect(element[0].querySelector('.jw-card-title')).not.toEqual(null);
    });

    it('should show the card description when show-description is true', function () {
        compileDirective('<jw-card item="item" show-description="true"></jw-card>');
        expect(element[0].querySelector('.jw-card-description')).not.toEqual(null);
    });

    it('should show the video duration in minutes', function () {
        compileDirective('<jw-card item="item"></jw-card>');
        expect(element[0].querySelector('.jw-card-duration').textContent).toEqual('2 min');
    });

    it('should delegate click event to on-click handler', function () {
        spyOn($scope, 'handleOnClick');
        compileDirective('<jw-card item="item" on-click="handleOnClick"></jw-card>');
        element.triggerHandler('click');
        expect($scope.handleOnClick).toHaveBeenCalledWith($scope.item, false);
    });

    it('should delegate click event to on-click handler from play button', function () {
        spyOn($scope, 'handleOnClick');
        compileDirective('<jw-card item="item" on-click="handleOnClick"></jw-card>');
        angular.element(element[0].querySelector('.jw-card-play-button')).triggerHandler('click');
        expect($scope.handleOnClick).toHaveBeenCalledWith($scope.item, true);
    });
});