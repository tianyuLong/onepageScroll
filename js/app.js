/* TOC

 @MAIN
 @MASTHEAD
 @TIMER
 @FEATURE (HOME)
 @CAROUSEL
 @VERTICAL CENTERING
 @AJAX REPLACE

 TOC */

/*-----------------------*/

if (typeof snapfit == 'undefined') {
    var snapfit = {};
}

$(window).resize(function() {
    if (this.resizeTO) {
        clearTimeout(this.resizeTO);
    }
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
    }, 500);
});

var scrollTripped = 0;
var $slider;

/*-----------------------
 @MAIN
 ------------------------*/
snapfit.main = (function() {

    return {
        isMobile: false,
        init: function() {

            $.Android = (navigator.userAgent.match(/Android/i));
            $.iPhone = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)));
            $.iPad = ((navigator.userAgent.match(/iPad/i)));
            $.iOs4 = (/OS [1-4]_[0-9_]+ like Mac OS X/i.test(navigator.userAgent));

            if ($.iPhone || $.iPad || $.Android) {
                this.isMobile = true;
            }
            this.registerEvents();
        },
        registerEvents: function() {
            snapfit.masthead.init();
            snapfit.navbar.init();

            if ($("body.page-home").length) {
                snapfit.feature.init();
            }
            if ($(".m_tabs").length) {
                snapfit.tabs.init();
            }
            if ($(".m_pill-tabs").length) {
                snapfit.pillTabs.init();
            }
            if ($(".m_tabs-vertical").length || $(".m_tabs-horizontal").length) {
                snapfit.basicTabs.init();
            }
            if ($(".m_teleport").length) {
                snapfit.teleport.init();
            }
            if ($(".m_modal").length) {
                snapfit.modal.init();
            }
            if ($("[data-ajax-append]").length) {
                snapfit.loadMore.init();
            }
            if ($(".homeSlides").length) {
                snapfit.home.init();
            }
            if ($('.page-case-study').length) {
                snapfit.video.init();
            }
            if ($('.alert-bar').length) {
                snapfit.alert.init();
            }

            snapfit.loading.init($('.page-case-study').length);

            $(window).load(function() {
                if ($(".m_carousel").length) {
                    snapfit.carousel.prep();
                }
                if ($(".page-case-study").length) {
                    snapfit.casestudy.init();
                }
            });
        },
        windowWide: function() {
            return $(window).width() > 767 ? true : false;
        },
        isTouchDevice: function() {
            var is_touch_device = 'ontouchstart' in document.documentElement;
            return is_touch_device;
        },
        rgbToHex: function(rgb) {
            if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        },
        setLogoColors: function(bolt, letters) {
            var boltColor = bolt ? bolt : $('.brand .bolt').attr('data-original-fill');
            var letterColor = letters ? letters : $('.brand .letter').attr('data-original-fill');

            $("body .brand .bolt").animate({
                fill: boltColor
            }, 200);
            $("body .brand .letter").animate({
                fill: letterColor
            }, 200);
        },
        scrollBindings: function() {
            if ($('.page-case-study').length) {
                if ($(window).width() >= 1200 && !snapfit.main.isMobile) {
                    snapfit.casestudy.playOrPauseHero();
                    snapfit.casestudy.fadeInObjects();
                    snapfit.parallax.doCaseStudy();
                }
            } else {
                if ($(window).width() >= 1200 && $('.page-home').length == 0) {
                    snapfit.parallax.doStandard();
                }
            }
        },
        resizeBindings: function() {
            if ($('.page-case-study').length) {
                if ($(window).width() < 1200 || snapfit.main.isMobile) {
                    snapfit.parallax.resetCaseStudy();
                }
            } else {
                if ($(window).width() < 1200 || snapfit.main.isMobile) {
                    snapfit.parallax.resetStandard();
                }
            }
        }
    };
})();

/*-----------------------
 @AJAX REPLACE

 Replace append content from ajax response
 ------------------------*/
snapfit.loadMore = (function() {

    appendContent = function($clicked) {
        var ajaxUrl = $clicked.attr('href');
        var resultContainerSelector = $clicked.attr('data-ajax-append');
        var $resultContainer = $(resultContainerSelector);

        // get the old offset
        var offset = ajaxUrl.match(/offset=(.*)/)[1];

        // add 10 to the old offset
        var newOffset = parseInt(offset) + 10;

        var contents = $.get(ajaxUrl, function(data) {
            if (data) {
                // update the ajax url with the new offset
                $clicked.attr('href', ajaxUrl.replace('offset=' + offset, 'offset=' + newOffset));

                // add the content
                $resultContainer.append(data);

                $flag = $resultContainer.find('[data-no-more-posts]');
                if ($flag.length > 0) {
                    $clicked.hide();
                }

            } else {
                $clicked.text('Sorry, No More Posts');
            }
        });
    }

    return {
        init: function() {
            $('body').on('click', '[data-ajax-append]', function(e) {
                e.preventDefault();
                appendContent($(this));
            });
        }
    };
})();

/*-----------------------
 @MASTHEAD

 Adding a background and adjusting padding when scroll position is greater than .m_jumbotron height.
 ------------------------*/
snapfit.masthead = (function() {
    var settings = {
        $scroller: $(window),
        $masthead: $(".masthead"),
        $jumboHeight: $(".m_jumbotron").outerHeight() / 2,
        $mHeightFixed: $(".masthead").outerHeight(),
    }
    return {
        init: function() {
            if ($("body.page-blog").length || $("div.no-header-image").length) {
                // blog listing page uses fixed by default
                settings.$masthead.addClass("is-fixed");
            } else {
                settings.$masthead.addClass("ready-to-fix");
                this.doFixed();
            }
        },
        doFixed: function() {
            settings.$scroller.scroll(function() {
                snapfit.masthead.isItFixed();
            });
            snapfit.masthead.isItFixed();
        },
        isItFixed: function() {
            if (settings.$scroller.scrollTop() > settings.$jumboHeight - settings.$mHeightFixed && $('.page-home').length == 0) {
                settings.$masthead.addClass("is-fixed");
            } else {
                settings.$masthead.removeClass("is-fixed");
            }
        }
    };
})();

/*-----------------------
 @NAVBAR
 ------------------------*/
snapfit.navbar = (function() {
    var htmlHeight = 0,
        scrollPos = 0,
        currentTopMargin,
        currentTopOffset,
        wasNavFixed = false;

    return {
        init: function() {

            $(".menu-trigger").on("click", function(e) {
                e.preventDefault();
                if ($("#st-container").hasClass("menu-open")) {
                    setTimeout(function() {
                        $(".st-content").prependTo("body");
                        $(".masthead").prependTo("body");

                        if ($('body').hasClass('page-home')) {
                            snapfit.feature.rebindScroll();
                        }
                        snapfit.video.play();
                        $('html,.st-container').height(htmlHeight + "px");
                        $('.st-container').height('0');
                        $(window).scrollTop(scrollPos);
                        $(window).trigger('scroll');
                    }, 500);
                } else {
                    htmlHeight = $("html").height();
                    scrollPos = $(window).scrollTop();
                    $(".st-content").appendTo(".st-pusher");
                    $(".masthead").prependTo("#st-container");
                    $(".masthead").removeClass('is-fixed');

                    if ($('body').hasClass('page-home')) {
                        snapfit.feature.unbindScroll();
                    }
                    snapfit.video.pause();

                    $("body, html,.st-container").height('100%');
                    $(".st-pusher").scrollTop(scrollPos);
                    $(window).trigger('scroll');
                }

                $("#st-container").toggleClass("menu-open");
            });
        }
    };
})();

/*-----------------------
 @TIMER
 ------------------------*/
snapfit.timer = (function() {
    var timer = null;

    return {
        drawTimer: function() {
            var $circle = $(".feature-timer"),
                $bg = $(".feature-background");

            var degrees = 360, // don't change this
                i = 0;

            var radius = 120, // circle radius relative to svg viewbox (be sure to account for stroke width)
                increment = 5, // number of degrees to add per loop
                angle = -90 - increment, // start position (top minus an increment)
                numTicks = (degrees / increment) + 2, // number of times the loop will run
                ms = snapfit.feature.s.constants.pause - snapfit.feature.s.constants.speed - 400, // duration of animation (milliseconds)
                interval = ms / numTicks; // timer interval

            var radians = null,
                x = null,
                y = null,
                d = null;

            timer = setInterval(
                function() {
                    angle += increment;
                    angle %= degrees;
                    radians = (angle / (degrees / 2)) * Math.PI;
                    x = 150 + Math.cos(radians) * radius;
                    y = 150 + Math.sin(radians) * radius;
                    d = $circle.attr("d");

                    if (i == 0) {
                        d = d + " M " + x + " " + y;
                    } else {
                        d = d + " L " + x + " " + y;
                    }
                    $circle.attr("d", d);
                    i++;

                    if (i >= numTicks) {
                        snapfit.timer.stopTimer();
                        snapfit.feature.$bxapi.goToNextSlide();
                    }
                }, interval);
        },
        stopTimer: function() {

            clearInterval(timer);
        }
    }
})();

/*-----------------------
 @FEATURE (HOME)
 ------------------------*/
snapfit.feature = (function() {
    var $bxapi = {},
        inTransition = 0,
        mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
    return {
        s: {
            classes: {
                i: "carousel",
                e: "is-enabled",
                p: "pager"
            },
            constants: {
                delay: 250,
                pause: 6000,
                speed: 800
            },
            obj: {
                pager: $("<div class='pager' />")
            },
            svg: {
                // "bg" is just a copy of a generated timer saved via Developer Tools
                // if the timer dimensions change this will need to be replaced
                // also, change the stroke-width to be less than #feature-timer so it doesn't poke out from underneath
                bg: '<svg version="1.1" id="feature-timer-background" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="612px" height="792px" viewBox="0 0 612 792" enable-background="new 0 0 612 792" xml:space="preserve"><path fill="#FFFFFF" d="M306,685.8l-25.3-1.1l-25.1-3.3L231,676l-24.1-7.6l-23.4-9.7L161.1,647l-21.3-13.6L119.7,618L101.1,601 L84,582.3l-15.4-20.1L55,540.9l-11.7-22.4l-9.7-23.4L26,471l-5.5-24.7l-3.3-25.1L16.2,396l1.1-25.3l3.3-25.1L26,321l7.6-24.1 l9.7-23.4L55,251.1l13.6-21.3L84,209.7l17.1-18.6l18.6-17.1l20.1-15.4l21.3-13.6l22.4-11.7l23.4-9.7L231,116l24.7-5.5l25.1-3.3 l25.3-1.1l25.3,1.1l25.1,3.3L381,116l24.1,7.6l23.4,9.7l22.4,11.7l21.3,13.6l20.1,15.4l18.6,17.1l17.1,18.6l15.4,20.1l13.6,21.3 l11.7,22.4l9.7,23.4L586,321l5.5,24.7l3.3,25.1l1.1,25.3l-1.1,25.3l-3.3,25.1L586,471l-7.6,24.1l-9.7,23.4L557,540.9l-13.6,21.3 L528,582.3L511,601L492.3,618l-20.1,15.4L450.9,647l-22.4,11.7l-23.4,9.7L381,676l-24.7,5.5l-25.1,3.3L306,685.8z M288.6,595 l17.4,0.8l17.4-0.8l17.3-2.3l17-3.8l16.6-5.2l16.1-6.7l15.5-8l14.7-9.4l13.8-10.6l12.8-11.8l11.8-12.8l10.6-13.8l9.4-14.7l8-15.5 l6.7-16.1l5.2-16.6l3.8-17l2.3-17.3l0.8-17.4l-0.8-17.4l-2.3-17.3l-3.8-17l-5.2-16.6l-6.7-16.1l-8-15.5l-9.4-14.7L459,267.6 l-11.8-12.8L434.4,243l-13.8-10.6l-14.7-9.4l-15.5-8l-16.1-6.7l-16.6-5.2l-17-3.8l-17.3-2.3l-17.4-0.8l-17.4,0.8l-17.3,2.3l-17,3.8 l-16.6,5.2l-16.1,6.7l-15.5,8l-14.7,9.4L177.6,243l-12.8,11.8L153,267.6l-10.6,13.8l-9.4,14.7l-8,15.5l-6.7,16.1l-5.2,16.6l-3.8,17 l-2.3,17.3l-0.8,17.4l0.8,17.4l2.3,17.3l3.8,17l5.2,16.6l6.7,16.1l8,15.5l9.4,14.7l10.6,13.8l11.8,12.8l12.8,11.8l13.8,10.6 l14.7,9.4l15.5,8l16.1,6.7l16.6,5.2l17,3.8L288.6,595z"/></svg>',
                anim: "<svg id='feature-timer' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' preserveAspectRatio='xMidYMid' viewbox='0 0 300 300'><path class='feature-timer' stroke-width='60' d='M300,300' fill='none' /></svg>",
                bull: "&bull;"
            },
            colors: {
                snapfit: "#f6364d",
                mccollcenter: "#65d28a",
                dublindog: "#68c223",
                amcc: "#ea0023",
                dukeenergy: "#d1f787"
            },
            txt: {
                snapfit: "#f5f5f5",
                mccollcenter: "#2c2e33",
                dublindog: "#24334c",
                amcc: "#f5f5f5",
                dukeenergy: "#f5f5f5"
            }
        },
        init: function() {
            var t = window.setTimeout(kickoff, snapfit.feature.s.constants.delay);

            function kickoff() {
                scrollTripped = 1; // REMOVE THIS LINE if we want the slides to cycle through automatically
                $("html").css({
                    height: "100%",
                    overflow: "hidden"
                }); //set html to 100

                var s = snapfit.feature.s;
                var $c = $("." + s.classes.i),
                    $items = $c.find(".item");

                if ($items.length) {
                    snapfit.feature.resizeItems();

                    $(window).on("throttledresize", function() {
                        snapfit.feature.resizeItems();
                    });

                    snapfit.feature.enable(s, $c, $items);
                }
                if (snapfit.main.isTouchDevice()) {
                    document.body.addEventListener('touchmove', function(event) {
                        event.preventDefault();
                    });
                }
                snapfit.video.init();
            }
        },
        resizeItems: function() {
            var s = snapfit.feature.s;
            var $c = $("." + s.classes.i),
                $items = $c.find(".item");
            $items.css("height", $(window).height());
            $items.find(".screenshot").each(function(index, item) {

                var h = $(item).height();
                var w = $(item).width();
                var vh = $(window).height();
                var vw = $(window).width();
                var padding = 0.35 * vw;
                if (h - 30 > vh - padding) {
                    $(item).css({
                        bottom: vh - padding - h,
                        left: vw / 2 - w / 2
                    });
                } else {
                    $(item).css({
                        bottom: "-10px",
                        left: vw / 2 - w / 2
                    });
                }

            });
        },
        enable: function(s, $c, $items) {
            var $pager = $("." + s.classes.p);

            snapfit.feature.$bxapi = $c.bxSlider({
                minSlides: 1,
                maxSlides: 1,
                auto: false,
                useCSS: true,
                responsive: true,
                preloadImages: "all",
                controls: false,
                mode: "vertical",
                pagerCustom: $pager,
                slideMargin: 0,
                pause: s.constants.pause,
                speed: s.constants.speed,
                touchEnabled: true,
                oneToOneTouch: false,
                infiniteLoop: false,
                onSliderLoad: function(currentIndex) {
                    $c.addClass(s.classes.e);
                    snapfit.feature.setClient(s, currentIndex, $items);
                    snapfit.feature.setActive(s, currentIndex, $pager, $items);
                },
                onSlideBefore: function($slideElement, oldIndex, newIndex) {
                    snapfit.feature.hide(s, oldIndex, newIndex, $items, $pager);
                    snapfit.feature.setClient(s, newIndex, $items);
                    snapfit.timer.stopTimer();
                    if (scrollTripped) inTransition = 1;
                },
                onSlideAfter: function($slideElement, oldIndex, newIndex) {
                    snapfit.feature.setActive(s, newIndex, $pager, $items);
                    setTimeout(function() {
                        inTransition = 0;
                    }, 1000);
                }
            });
            $slider = $c;
            snapfit.feature.bindScroll(s, $c);
            $('body').on('click', '.to-case-studies', function(e) {
                e.preventDefault();
                $c.goToNextSlide();
            });
        },
        setClient: function(s, i, $items) {
            var $pager = $("." + s.classes.p);
            var newProject = $items.eq(i).attr("data-project");

            $("body").attr("data-project", newProject);

            if (newProject !== "snapfit") snapfit.video.pause();
            else snapfit.video.play();
        },
        setActive: function(s, i, $pager, $items) {
            var newProject = $items.eq(i).attr("data-project");
            var currentColor = s.colors[newProject.replace("-", "")];
            if (!scrollTripped) currentColor = s.txt[newProject.replace("-", "")];

            $pager.find(".animated").removeClass("animated");
            $pager.find("a").eq(i).html(s.svg.bg + s.svg.anim);
            $('#feature-timer-background *').css('fill', currentColor);

            if (newProject !== "snapfit") snapfit.video.pause();
            else snapfit.video.play();

            if (!scrollTripped) {
                $pager.find("a").eq(i).addClass("animated");
                snapfit.timer.drawTimer();
            }

            snapfit.main.setLogoColors(s.colors[newProject.replace("-", "")], s.txt[newProject.replace("-", "")]);
            snapfit.feature.setPagerColor($pager, s.txt[newProject.replace("-", "")]);
            $('.menu-trigger span').animate({
                backgroundColor: s.txt[newProject.replace("-", "")]
            }, s.constants.speed);
        },
        hide: function(s, oldIndex, newIndex, $items, $pager) {
            var currentProject = $items.eq(oldIndex).attr("data-project");
            var newProject = $items.eq(newIndex).attr("data-project");
            var currentColor = s.colors[currentProject.replace("-", "")];

            $pager.find("a").eq(oldIndex).html(s.svg.bull);
            $pager.find("a").eq(newIndex).html(s.svg.bg);

            $('#feature-timer-background *').css('fill', currentColor);
        },
        setPagerColor: function($pager, color) {
            var realColor = $('body').attr('data-project') == "content" ? '#61625F' : color;

            $pager.find("a").animate({
                color: realColor
            }, 200);
        },
        bindScroll: function() {
            if (!snapfit.main.isMobile) {
                var currentActive,
                    totalSlides = $slider.getSlideCount(),
                    s = snapfit.feature.s;
                $('body').bind(mousewheelevt, function(e) {
                    scrollTripped = 1;
                    currentActive = $slider.getCurrentSlide();

                    var evt = window.event || e;
                    evt = evt.originalEvent ? evt.originalEvent : evt;
                    var delta = evt.detail ? evt.detail * (-40) : evt.wheelDelta;

                    $slider.stopAuto();
                    if (delta > 0) {
                        if (currentActive > 0 && !inTransition) $slider.goToPrevSlide();
                    } else {
                        if (currentActive < (totalSlides - 1) && !inTransition) {
                            $slider.goToNextSlide();
                        }
                    }
                });
                $('.' + s.classes.p).find('a').click(function() {
                    scrollTripped = 1;
                });
            }
        },
        rebindScroll: function() {
            if (!snapfit.main.isMobile) {
                snapfit.feature.bindScroll();
            }
        },
        unbindScroll: function() {
            if (!snapfit.main.isMobile) {
                $('body').unbind(mousewheelevt);
            }
        }
    };
})();


/*-----------------------
 @CAROUSEL
 ------------------------*/
snapfit.carousel = (function() {
    var settings = {
        $el: $(".m_carousel ul"),
        slideWidth: 960
    }

    return {
        prep: function() {
            if (snapfit.main.windowWide()) {

                // all carousel items
                var $items = settings.$el
                    .filter(".consolidate-items")
                    .children(".carousel-item");

                // consolidate in the first carousel
                settings.$el
                    .filter(".consolidate-items")
                    .first()
                    .html($items)
                    .addClass("master");

                // remove the others
                settings.$el.filter(":not('.master')")
                    .closest(".tab-item")
                    .remove();
            }

            snapfit.carousel.init();
        },
        init: function() {
            // allow multiple carousels per page
            settings.$el.each(function() {

                var $c = $(this),
                    $m = $c.closest(".m_carousel"),
                    enableCaptions = $m.hasClass("enable-captions"),
                    enableTabControls = $m.hasClass("enable-tab-controls") && snapfit.main.windowWide();

                var $bxapi = $c.bxSlider({
                    captions: false, // always handle captions manually
                    controls: false,
                    oneToOneTouch: false,
                    pager: false,
                    slideWidth: settings.slideWidth,
                    swipeThreshold: 200,
                    onSliderLoad: function(currentIndex) {
                        // first active item
                        var $active = $c.find(".carousel-item").not(".bx-clone").eq(currentIndex);
                        $active.addClass("active");

                        // insert caption container if enabled
                        if (enableCaptions) {
                            snapfit.carousel.insertCaptions($m, $c, $active);
                        }

                        // add controls
                        snapfit.carousel.insertControls($c);
                    },
                    onSlideAfter: function($slideElement, oldIndex, newIndex) {
                        $c.find(".active").removeClass("active");
                        $slideElement.addClass("active");

                        if (enableCaptions) {
                            snapfit.carousel.updateCaption($m, $c, $slideElement);
                        }
                        if (enableTabControls) {
                            snapfit.carousel.setActiveTab($c, $slideElement);
                        }
                    }
                });

                // enable controls
                snapfit.carousel.bindControls($c, $bxapi);
                enableTabControls ? snapfit.carousel.bindTabControls($c, $bxapi) : null;
            });
        },
        // insert prev / next controls
        insertControls: function($c) {
            $c.parent(".bx-viewport").append(
                "<a href='#' class='my-control my-bx-prev' />",
                "<a href='#' class='my-control my-bx-next' />"
            );
        },
        // bind prev / next controls
        bindControls: function($c, $bxapi) {
            $c.nextAll(".my-bx-prev").on("click", function(e) {
                e.type; // fixes click on ipad. don't know why.
                e.preventDefault();
                $bxapi.goToPrevSlide();
            });
            $c.nextAll(".my-bx-next").on("click", function(e) {
                e.preventDefault();
                $bxapi.goToNextSlide();
            });
        },
        // tab + carousel hybrid
        // go to a slide based on the selected tab
        // example: /about/culture
        bindTabControls: function($c, $bxapi) {
            var slideHash,
                slideIndex;
            $c.closest(".m_tabs").find(".tab-selectors .tab-item-cell").on("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                slideHash = $(this).attr("href").replace("#", "");
                slideIndex = $c.find("[data-slide-hash='" + slideHash + "']").not(".bx-clone").index();
                $bxapi.goToSlide(slideIndex - 1);
            });
        },
        // tab + carousel hybrid
        // make tab active based on current slide
        // example: /about/culture
        setActiveTab: function($c, $slideElement) {
            var $tabs = $c.closest(".m_tabs").find(".tab-selectors .tab-item-cell"),
                $activeTab = $tabs.filter(".active"),
                activeTabHash = $activeTab.attr("href").replace("#", ""),
                slideHash = $slideElement.attr("data-slide-hash");

            if (activeTabHash !== slideHash) {
                $activeTab.removeClass("active");
                $tabs.filter("[href='#" + slideHash + "']").addClass("active");
            }
        },
        // insert caption container
        insertCaptions: function($m, $c, $active) {
            $m.append("<div class='my-bx-caption' style='max-width:" + settings.slideWidth + "px'></div>");
            snapfit.carousel.updateCaption($m, $c, $active);
        },
        // update caption on slide change
        updateCaption: function($m, $c, $slideElement) {
            $m.find(".my-bx-caption").text($slideElement.find("img").attr("title"));
        },
    };
})();



/*-----------------------
 @PARALLAX
 Cool effect for various hero sections
 ------------------------*/
snapfit.parallax = (function() {
    var $el,
        scrollPos,
        windowWidth,
        timer;

    return {
        doStandard: function() {
            scrollPos = $(window).scrollTop();

            if (scrollPos < 0) {
                return; // OSX overscroll perf. fix
            }

            $('.m_jumbotron').css({
                backgroundPosition: 'center ' + (scrollPos / 2) + "px"
            });

            $('.m_jumbotron .positioning').css({
                transform: 'translateY(' + (scrollPos / 3) + "px)",
                opacity: 1 - (scrollPos / 300)
            });
        },
        doCaseStudy: function() {
            scrollPos = $(window).scrollTop();

            if (scrollPos < 0) {
                return; // OSX overscroll perf. fix
            }

            $('.m_jumbotron h1').css({
                transform: 'translateY(' + (scrollPos / 3) + 'px)',
                opacity: 1 - (scrollPos / 800)
            })
        },
        resetStandard: function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                $('.m_jumbotron').css({
                    backgroundPosition: '50% 0px'
                });
                $('.m_jumbotron .positioning').removeAttr('style');
            }, 60);
        },
        resetCaseStudy: function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                $('.m_jumbotron h1').removeAttr('style');
            }, 60);
        }
    };
})();

/*-----------------------
 Curtain effect
 init curtain effect
 ------------------------*/
snapfit.casestudy = (function() {
    var rTimer,
        sTimer;

    return {
        init: function() {
            $(window).on('resize', function() {
                clearTimeout(rTimer);
                rTimer = setTimeout(function() {
                    snapfit.casestudy.setJumbotronSize();
                }, 60);
            });

            snapfit.casestudy.setJumbotronSize();
        },
        setJumbotronSize: function() {
            var h = $(window).height();
            if ($('.page-case-study').length && $(window).width() >= 1200 && $(window).height() >= 800 && !snapfit.main.isMobile) {
                h = $(window).height() - 150;
            }
            $(".m_jumbotron").height(h);
        },
        playOrPauseHero: function() {
            var vidPlaying = true;

            clearTimeout(sTimer);
            sTimer = setTimeout(function() {
                if ($(window).scrollTop() > $(window).height()) {
                    snapfit.video.pause();
                } else {
                    snapfit.video.play();
                }
            }, 90);
        },
        fadeInObjects: function() {
            var timeSpan = 1500; // How long each animation chunk should last

            $('.animate-objects').each(function() {
                var $this = $(this);
                var $items = $this.is('ul') ? $this.find('li') : $this.find('.fade-in');

                if ($this.is('[data-time-span]') && !isNaN($this.attr('data-time-span'))) {
                    timeSpan = parseInt($this.attr('data-time-span'));
                }

                if ($(window).scrollTop() >= ($this.offset().top - ($(window).height() * 0.85))) {
                    $items.each(function(i, el) {
                        var $item = $(el);
                        setTimeout(function() {
                            $item.addClass('show');
                        }, (i * (timeSpan / $items.length)));
                    });
                }
            });
        }
    }
})();

snapfit.loading = (function() {
    var $loader = $('#loader');

    return {
        init: function(isAnimated) {
            $loader.addClass('play');
            $(window).load(function() {
                snapfit.loading.done(isAnimated);
            });
        },
        done: function(isAnimated) {
            $loader.removeClass('play').addClass('done');
            setTimeout(function() {
                $('html').addClass('loaded');
                $('[data-top-reveal] > li, [data-top-reveal] .fade-in').each(function(i, el) {
                    var $item = $(el);
                    setTimeout(function() {
                        $item.addClass('show');
                    }, (i * (1500 / $item.siblings().andSelf().length)));
                });
            }, (isAnimated ? 1000 : 0));
        }
    }
})();

snapfit.alert = (function() {
    return {
        init: function() {
            $('body').on('click', '[data-close]', function() {
                $('body').removeClass('has-alert');
                if ($(this).parents('.alert-bar').hasClass('reminder')) {
                    snapfit.alert.setCookie();
                }
            });
            $('body').on('click', '.alert-bar a', function() {
                if ($(this).parents('.alert-bar').hasClass('reminder')) {
                    snapfit.alert.setCookie();
                }
            });
        },
        setCookie: function() {
            $.cookie('hideAlert', 'true', {
                expires: 9999
            });
        }
    }
})();

snapfit.home = (function() {
    return {
        init: function() {

            // Initialize homepage stuff here

        }
    }
})();

snapfit.video = (function() {
    var video;

    return {
        init: function() {
            $("video").each(function() {
                var $video = $(this),
                    $parent = $video.parent(),
                    poster = $video.attr("poster");

                // Disable for touch devices
                if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
                    $video.remove();
                } else {
                    video = $video.get(0);

                    $video.find("source").each(function() {
                        var $source = $(this);
                        if (maxWidth = $source.attr("data-max-width")) {
                            if ($(window).width() <= maxWidth) {
                                $source.attr("src", $source.attr("data-src"));
                                $source.attr("data-src", null);
                            } else {
                                $source.remove();
                            }
                        } else {
                            $source.attr("src", $source.attr("data-src"));
                            $source.attr("data-src", null);
                        }
                    });

                    // Autoplay
                    if ($video.attr("autoplay")) {
                        $video.show();
                        $video.get(0).play();
                    }
                }

                // Responsive poster image
                poster && $parent.css("background-image", "url(" + poster + ")");
            });
        },
        pause: function() {
            video && video.pause();
        },
        play: function() {
            video && video.play();
        }
    }
})();

/*
 * LOAD!
 */
jQuery(function() {
    snapfit.main.init();

    $(window).scroll(function() {
        snapfit.main.scrollBindings();
    });
    $(window).resize(function() {
        snapfit.main.resizeBindings();
    })
});
