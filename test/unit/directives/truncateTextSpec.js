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

describe('jwTruncateText', function () {

    var LONG_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce iaculis pellentesque tortor, sed sollicitudin velit ornare ut. Pellentesque blandit pellentesque mattis.';

    var SUFFIX_REGEX = /\.{3}$/;

    var element, $scope, $compile, $timeout;

    beforeEach(function () {
        module('app');
        module('app.partials');

        inject(function ($rootScope, _$compile_, _$timeout_) {
            $scope      = $rootScope.$new();
            $scope.text = LONG_TEXT;
            $compile    = _$compile_;
            $timeout    = _$timeout_;
        });
    });

    afterEach(function () {
        document.body.removeChild(element[0]);
        element = null;
    });

    function compileDirective (htmlText) {
        element = angular.element(htmlText);
        document.body.appendChild(element[0]);
        element = $compile(element)($scope);
        $scope.$digest();
        $timeout.flush();

    }

    it('should show full text', function () {
        compileDirective('<div jw-truncate-text="text"></div>');
        expect(element.text()).toEqual(LONG_TEXT);
        expect(element.text()).not.toMatch(SUFFIX_REGEX);
    });

    it('should truncate text when overflowing', function () {
        compileDirective('<div jw-truncate-text="text" style="width: 200px; height: 30px;"></div>');
        expect(element.text()).not.toEqual(LONG_TEXT);
        expect(element.text()).toMatch(SUFFIX_REGEX);
    });

    it('should re-truncate text after a resize', function () {
        compileDirective('<div jw-truncate-text="text" style="width: 200px; height: 30px;"></div>');
        expect(element.text()).not.toEqual(LONG_TEXT);
        expect(element.text()).toMatch(SUFFIX_REGEX);

        element.css({width: '', height: ''});
        window.dispatchEvent(new Event('resize'));
        $timeout.flush();

        expect(element.text()).toEqual(LONG_TEXT);
        expect(element.text()).not.toMatch(SUFFIX_REGEX);
    });
});