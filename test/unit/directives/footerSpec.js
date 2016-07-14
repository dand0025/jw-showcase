
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

describe('jwFooter', function () {

    var element, $scope, $compile;

    function initWithFooterText (text) {

        module('app', function ($provide) {
            $provide.value('config', {footerText: text});
        });

        module('app.partials');

        inject(function ($rootScope, _$compile_) {
            $scope      = $rootScope.$new();
            $compile    = _$compile_;
        });
    }

    afterEach(function () {
        document.body.removeChild(element[0]);
        element = null;
    });

    function compileDirective (htmlText) {
        element = $compile(htmlText)($scope);
        document.body.appendChild(element[0]);
        $scope.$digest();
    }

    it('should render a footer element', function () {
        initWithFooterText('');
        compileDirective('<jw-footer></jw-footer>');
        expect(element.hasClass('jw-footer')).toBeTruthy();
    });

    it('should show footer text from config', function () {
        initWithFooterText('my footer text');
        compileDirective('<jw-footer></jw-footer>');
        expect(element[0].querySelector('p').textContent).toEqual('my footer text');
    });
    
});
