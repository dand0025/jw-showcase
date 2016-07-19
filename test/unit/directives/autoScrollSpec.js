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

describe('jwAutoScroll', function () {

    var element, $scope, $rootScope, $compile, $timeout, $state;

    beforeEach(function () {

        module('app');
        module('app.partials');

        module(function (autoScrollProvider, $provide) {
            autoScrollProvider
                .register('page1')
                .register('page2');

            $provide.value('$state', {current: {}});
        });

        inject(function (_$rootScope_, _$compile_, _$timeout_, _$state_) {
            $rootScope = _$rootScope_;
            $scope     = _$rootScope_.$new();
            $compile   = _$compile_;
            $timeout   = _$timeout_;
            $state     = _$state_;
        });
    });

    afterEach(function () {
        document.body.removeChild(element[0]);
        element = null;
    });

    function compileDirective (htmlText) {

        var brs = 100;
        element = angular.element(htmlText);

        while (brs--) {
            element.append('<br/>');
        }

        document.body.appendChild(element[0]);
        element = $compile(element)($scope);
        $scope.$digest();
    }

    function mockStateChange (from, to) {
        $rootScope.$broadcast('$stateChangeSuccess', {}, {}, {name: from});
        $state.current.name = to;
        $scope.$broadcast('$viewContentLoaded');
        $timeout.flush();
    }

    it('should have scrolling', function () {
        compileDirective('<div style="height: 200px; overflow: scroll;" jw-auto-scroll></div>');
        expect(element[0].scrollHeight).toBeGreaterThan(element[0].offsetHeight);
    });

    it('should scroll to top when state changes to page2', function () {
        compileDirective('<div style="height: 200px; overflow: scroll;" jw-auto-scroll></div>');
        element[0].scrollTop = 100;
        mockStateChange('page1', 'page2');
        expect(element[0].scrollTop).toEqual(0);
    });

    it('should scroll back to position when returning to previous state', function () {
        compileDirective('<div style="height: 200px; overflow: scroll;" jw-auto-scroll></div>');
        element[0].scrollTop = 100;
        mockStateChange('page1', 'page2');
        expect(element[0].scrollTop).toEqual(0);
        mockStateChange('page2', 'page1');
        expect(element[0].scrollTop).toEqual(100);
    });
});