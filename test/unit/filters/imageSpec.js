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

describe('jwImage', function () {

    var $filter;

    beforeEach(function () {

        module('app');
        module('app.partials');

        inject(function (_$filter_) {
            $filter  = _$filter_;
        });
    });

    it('should replace 720 with 1920', function () {
        var result1 = $filter('jwImage')('http://assets-jpcust.jwpsrv.com/thumbs/kYewHpcO-720.jpg'),
            result2 = $filter('jwImage')('http://assets-jpcust.jwpsrv.com/720/thumbs/kYewHpcO-720.jpg');

        expect(result1).toEqual('http://assets-jpcust.jwpsrv.com/thumbs/kYewHpcO-1920.jpg');
        expect(result2).toEqual('http://assets-jpcust.jwpsrv.com/720/thumbs/kYewHpcO-1920.jpg');
    });
});