/*!
* jquery.lettercounterup.js 1.0
*
* Date: Feb 18, 2017
*/
(function($, window) {

    var LetterCounter = {
        init: function(options, elem) {
            this.elem = elem;
            this.$elem = $(elem);
            this.options = $.extend({}, $.fn.letterCounterUp.options, options);
            this.textArr = this.$elem.text().toUpperCase().split('');
            this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            this.run();
        },

        run: function() {
            let newArr = this.makeLetterArray(this.textArr);
            let maxLength = this.getMaxLength(newArr);
            newArr = this.makeEqualArray(newArr, maxLength);
            newArr = this.makeArrayOfStr(newArr, maxLength);
            
            this.$elem.data('letterCounterUp', newArr);

            if($.fn.waypoint) {
                this.$elem.waypoint(
                    () => setTimeout(() => this.update(), this.options.interval), 
                    { offset: '100%', triggerOnce: true }
                );
            } else {
                $(window).on('load', () => setTimeout(() => this.update(), this.options.interval));
            }
        },

        makeLetterArray: function(textArr) {
            return this.textArr.map(item  => this.letters.slice(0, this.letters.indexOf(item)+1));
        },

        getMaxLength: function(arr) {
            return arr.reduce((a, b) => a.length > b.length ? a : b).length;
        },

        makeEqualArray: function(arr, maxLength) {
            return arr.map(i => {
                let newElements = Array(maxLength - i.length + 1).join(i[i.length - 1]).split('');
                return i.concat(newElements);
            });
        },

        makeArrayOfStr: function(arr, maxLength) {
            let newArr = [];
            for(let i = 0; i < maxLength; i++) {
                let newItems = arr.reduce((a, b) => Array.isArray(a) ? a[i] + b[i] : a + b[i]);
                newArr.push(newItems);
            }
            return newArr;
        },

        update: function() {
            let $el = this.$elem;
            $el.addClass('letter-counting-up');
            $el.text($el.data('letterCounterUp').shift());
            if($el.data('letterCounterUp').length) {
                setTimeout(() => this.update(), this.options.interval);
            } else {
                $el.removeClass('letter-counting-up');
                this.options.onComplete.call(this.elem);
            }
        }

    };

    $.fn.letterCounterUp = function(options) {
        return this.each(function() {
            letterCounter = Object.create(LetterCounter);
            letterCounter.init(options, this);
        });
    };

    $.fn.letterCounterUp.options = {
        interval: 100,
        onComplete: function() {}
    }

}(jQuery, window));