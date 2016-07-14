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

describe('jwHeader', function () {

    var element, $scope, $compile;

    function initWithBannerImage (bannerImage) {

        module('app', function ($provide) {
            $provide.value('config', {bannerImage: bannerImage});
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

    it('should render a header element', function () {
        initWithBannerImage();
        compileDirective('<jw-header></jw-header>');
        expect(element.hasClass('jw-header')).toBeTruthy();
    });

    it('should use bannerImage from config in the header logo', function () {
        initWithBannerImage('base/app/images/logo.png');
        compileDirective('<jw-header></jw-header>');
        expect(element[0].querySelector('img.jw-header-logo').getAttribute('src')).toEqual('base/app/images/logo.png');
    });

});