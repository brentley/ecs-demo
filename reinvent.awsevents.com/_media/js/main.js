if (tet === null || typeof tet !== 'object') { var tet = {}; }
tet.main = (function ($) {
    var _instance,
    p, n;

    function kickoff () {
        return {
            initialize: function (options) {
                var self = this;

                $(document).ready(function () {
                    self.event_handlers();
                    self.hash_load();
                    self.init_nav();
                    self.init_slider();
                    self.init_sidebar();
                    self.init_scroll_events();
					self.process_fade_ins();
					self.expanding_content();
					self.campus_map();
					self.init_agenda();
					self.init_sponsor_modals();
					self.competency_filter();
					self.magnify();

                    setTimeout( function () {
                        $('body').addClass('loaded');

                        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                        if (scrollTop > 300) {
                            if (!self.scrolled) {
                                $('body').addClass('scrolled');
                                self.scrolled = true;
                            }
                        }
                    }, 700);
                });
            },
            scrolled: false,
			nav_open: false,

            //Utilities
            //Scroll to a hash tag
            hash_scroll: function (dest, hash) {

                if ($(dest).length > 0) {
                    var loc = Math.ceil($(dest).offset().top - 100),
                    dur = Math.abs($(document).scrollTop() - loc) * 0.3;

                    $('html, body').animate({
                        scrollTop: loc
                    }, dur, function () {
                        // if (hash) {
                        //     window.location.hash = hash;
                        // }
                    });
                }
            },

            //Events
            //Init Event Handlers
            event_handlers: function () {
                var self = this;

                self.toggle_extended_nav();
                self.in_page_hash_links();
            },
			
			//Close mobile nav
            close_nav: function(){
                var self = this;

                self.nav_open = false;
                $('.toggle-menu, .site-header nav').removeClass('active');
				$('body').removeClass('no-scroll');
				self.close_submenu();
            },
			
            //Toggle extended navigation open and closed
            toggle_extended_nav: function() {
                var self = this;
                $('.toggle-menu').on('click tap touch', function(e){
                    e.stopPropagation(); //prevents lag from analytics script
                    e.preventDefault();

                    if ($(this).hasClass('active')) {
                        self.close_nav();
                    } else {
                        self.nav_open = true;
						$('body').addClass('no-scroll');
                        $(this).add('.site-header nav').addClass('active');
                    }
                });

                $('html').on('click tap touch', function(){
                    if (self.nav_open) {
						self.close_nav();
                    }
                });

                $('.site-header nav').on('click tap touch', function(e){
                    e.stopPropagation();
                });

            },

            //Handle clicks on inline links and nav bullets that link to content on current page
            in_page_hash_links: function () {
                var self = this;

                //inline hash links
                $('.hash-link, .sidebar a').on('click tap touch', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var href = $(this).attr('href'),
                    slug = href.split('#')[1],
                    hash = '#' + slug;

                    if (typeof slug !== 'undefined') {
                        e.preventDefault();
                        self.hash_scroll( hash, hash );
                    }
                });
            },


            //Loading Functions
            //Detect hashtag in url and scroll to it
            hash_load: function () {
                var self = this,
                hash = location.hash,
                dest_section = '#section-' + hash.split('#')[1],
                dest_modal = '#modal-' + hash.split('#')[1];

                if (hash && $(dest_section).length > 0) {
                    self.hash_scroll( dest_section );

                    if ($(dest_modal).length > 0) {
                        setTimeout( function () {
                            self.open_modal( location.hash.split('#')[1] );
                        }, 1000);
                    }
                }
            },
			
			
			//Init the header nav
			init_nav: function () {
				var self = this;
				$('body').append('<div class="nav-overlay"></div>');
				
				//Open a submenu on click
				$('.site-header li.parent > a').click(function() {
					
					if ($(this).parent().is('.active')) {
						//This is already the active item - set it inactive and close the menu
						self.close_submenu();
					} else {
						//Setting this item as active
						$('.site-header li.parent').removeClass('active');
						$(this).parent().siblings('li.parent').children('ul').fadeOut(250);
						$(this).parent().addClass('active');
						$(this).siblings('ul').fadeIn(250);
						$('.nav-overlay').fadeIn(250);
						$('body').addClass('submenu-open');
						//Hide submenu when clicking overlay
						$('.nav-overlay').one('click', function() {
							self.close_submenu();
						});
					}
					
					return false;
				});
				
				//Escape key to close submenu
				$(document).keyup(function(e) {
					if (e.keyCode === 27) {
						self.close_submenu();
					}
				});
            },
			
			//Close any open submenu
			close_submenu: function () {
				$('.site-header li.active ul').fadeOut(250);
				$('.nav-overlay').fadeOut(250);
				$('.site-header li.active').removeClass('active');
				$('body').removeClass('submenu-open');
			},			
			
			//Init the slick carousel slider
			init_slider: function () {
				$('.slider .slides').slick({
					prevArrow: '<div class="slick-prev"><svg viewBox="0 0 100 100" focusable="false"><use xlink:href="#slider-left-arrow"></use></svg></div>',
					nextArrow: '<div class="slick-next"><svg viewBox="0 0 100 100" focusable="false"><use xlink:href="#slider-right-arrow"></use></svg></div>',
					dots: true
				});
            },
			
			//Init the sidebar - scrollspy hash link menu
			init_sidebar: function () {
                if ( $('#page-nav').length > 0 ) {
                    //Scrollspy to make links active as you scroll
					$('body').scrollspy({
                        target: '#page-nav',
                        offset: 130
                    });

					//Affix to set the menu in place as you scroll
                    var affix_offset = $('#page-nav').offset().top;
					affix_offset = affix_offset - 86;
                    $('#page-nav-inner').affix({
                        offset: {
                            top: affix_offset
                        }
                    });
                }
			},
		
			//scroll events
			init_scroll_events: function() {
				var self = this;
				$(window).scroll(function() {
					self.process_fade_ins();
				});
			},
			
			//fading moving elements come in
			process_fade_ins: function() {
				$('.show-on-viewport').each(function() {
					if ($(this).is(':in-viewport')) {
						$(this).addClass('show');
					//} else if ($(this).is(':below-the-fold')) {
					} else {
						$(this).removeClass('show');
					}
				});
			},
			
			//faq page expanding content
			expanding_content: function() {
				$('.faq-item').each(function() {
					$(this).find('.question span').click(function() {
						$(this).closest('.faq-item').toggleClass('open');
						$(this).closest('.question').siblings('.answer').slideToggle(250);
					});
				});
			},
			
			//campus map system
			campus_map: function() {
				if ($('#section-campus-map').length === 0) return false;
				var self = this;

				var venue;

				//click on a zoom point
				$('.zoom-point').click(function() {
					if ($('.map-wrapper').is('.zooming')) return false;
					
					//set active point
					$('.zoom-point').removeClass('active');
					$(this).addClass('active');
					
					//hide zoom point and do the zoom
					var scale = $(this).data('scale');
					var x = $(this).data('x');
					var y = $(this).data('y');
					$('.zoom-point').hide();
					$('.map-wrapper').addClass('zoomed');
					$('.map').css({
						'transform': 'scale(' + scale + ') translateX(' + x + ') translateY(' + y + ')'
					});
					
					//show text for this venue
					venue = $(this).data('desc');
					self.showHideSlide(venue);

					//close on map click - exit zoomed-in mode
					$('.map-wrapper .map').unbind('click');
					setTimeout(function() {
						$('.map-wrapper .map').click(function() {
							self.close_map();
						});
					}, 800);
				});

				
				//click next/prev buttons in text
				$('.change-point').click(function() {

					if ($(this).is('.next')) {
						if ($('.zoom-point.active').next('.zoom-point').length > 0) {
							$('.zoom-point.active').next().click();
						} else {
							$('.zoom-point').first().click();
						}
					} else {
						if ($('.zoom-point.active').prev('.zoom-point').length > 0) {
							$('.zoom-point.active').prev().click();
						} else {
							$('.zoom-point').last().click();
						}
					}

					self.showHideSlide(venue);
				});
				
				
				//click on map intro text
				$('.map-wrapper .intro').click(function() {
					$('.zoom-point').first().click();
					self.showHideSlide(venue);
				});
				
				//set font size according to container width (have to do this instead of using VWs)
				self.set_map_size();
				$(window).resize(self.set_map_size);
			},

			showHideSlide: function(v) {

				var currentSlide = v,
					previousSlide,
					llist = ['venetian','aria','mirage'];

				$('#section-campus-map .text').addClass('hidden');
				$('.map-wrapper .slides .' + p).removeClass('visible');
				$('.map-wrapper .slides').addClass('visible');
				$('.map-wrapper .slides .' + currentSlide).addClass('visible');

				var s_width = $(window).width();

				if(s_width < 1025 && s_width > 768) {
					console.log(s_width);
					$('#section-campus-map .map-wrapper').addClass('grow1024');
				} else if (s_width <= 768 && s_width > 450) {
					$('#section-campus-map .map-wrapper').addClass('grow768');
				} else if (s_width < 449) {
					$('#section-campus-map .map-wrapper').addClass('grow');
				} else {
					$('#section-campus-map .map-wrapper').removeClass('grow1024');
					$('#section-campus-map .map-wrapper').removeClass('grow768');
					$('#section-campus-map .map-wrapper').removeClass('grow');
				}

				p=currentSlide;
				
			},
			
			close_map: function() {
				
				$('#section-campus-map .map-wrapper').removeClass('grow1024');
				$('#section-campus-map .map-wrapper').removeClass('grow768');
				$('#section-campus-map .map-wrapper').removeClass('grow');
				$('.map-wrapper .slides').removeClass('visible');
				$('.map-wrapper').removeClass('zoomed');
				$(".map-wrapper .text").removeClass("hidden");
				$('.map').css({
					'transform': ''
				});
				setTimeout(function() {
					$('.map-wrapper').removeClass('zooming');
					$('.zoom-point').show();
				}, 800);
			},
			
			set_map_size: function() {
				//set the font size
				var width = $('#section-campus-map .text').width();
				var font_size = width * 0.018;
				$('#section-campus-map .text').css('font-size', font_size);
				/*
				//set the map's size according to aspect ratio
				var ratio = 764 / 1367;
				var s_width = $(window).width();
				var s_height = $(window).height();
				var s_ratio = s_height / s_width;
				if (s_ratio > ratio) {
					var height = s_width * ratio;
					$('.map-wrapper').width('100%').height(height);
				} else {
					var width = s_height / ratio;
					$('.map-wrapper').width(width).height('100%');
				}
				*/
			},
			
			init_agenda: function() {
				if ($('.agenda-times').length === 0) return false;
				var self = this;
					
				//fix agenda heights on resize
				self.agenda_resize();
				$(window).resize(self.agenda_resize);
				
				//prevent any flash of unstyled content by hiding agenda tables until the heights have been set
				$('.section-agenda').addClass('visible');
				
				//click on filters
				$('.filters li').click(function() {
					$(this).toggleClass('active');
					
					//uncheck any filters of a different type
					if ($(this).closest('.filters.event').length === 0) {
						$('.filters.event li').removeClass('active');
					} else {
						$('.filters.property li').removeClass('active');
					}
					
					//apply the filter
					self.agenda_apply_filter();
				});
				
				//Agenda filters dropdown on mobile
				$('.filter-toggle').click(function() {
					$(this).next('ul.filters').toggleClass('open');
				});
				
			},
			
			agenda_resize: function() {
				$('.agenda .row').each(function() {
					$(this).css('height', '');
					var height = 0;
					$(this).find('.time').each(function() {
						if ($(this).outerHeight() > height) {
							height = $(this).outerHeight();
						}
					});
					$(this).height(height);
				});
			},
			
			agenda_apply_filter: function() {
				var self = this;
				
				if ($('.filters li.active').length === 0) {
					//no filter selected
					$('.agenda .row').removeClass('active');
					$('.agenda').removeClass('filtered');
					self.agenda_resize();
					return false;
				}

				$('.agenda .row').removeClass('active');
				$('.agenda').addClass('filtered');
				
				$('.filters li.active').each(function() {
					if ($(this).data('event')) {
						$('.agenda .row.' + $(this).data('event')).addClass('active');
					} else if ($(this).data('property')) {
						var property = $(this).data('property');
						$('.agenda .row').each(function() {
							//could do this a faster way - just using a text search
							if ($(this).text().toLowerCase().indexOf(property) !== -1) {
								$(this).addClass('active');
							}
						});
					}
				});
				
				self.agenda_resize();
			},

			competency_filter: function(){
			    var self = this;

			    $('.toggle-competencies').on('click tap touch', function(e){
			        e.stopPropagation(); //prevents lag from analytics script
			        e.preventDefault();
			        var $this = $(this);

			        if( $this.hasClass('active')){
			            $(this).removeClass('active');
			            $('.options-panel').removeClass('active');
			        }else{
			            $(this).addClass('active');
			            $('.options-panel').addClass('active');
			        }
			    });

			    $('.competencies-filter .options ul a').on('click tap touch', function(e){
			        e.stopPropagation(); //prevents lag from analytics script
			        e.preventDefault();

			        var $this = $(this),
			            comp = $this.data('competency'),
			            comp_name = $this.html();

			        $('.sections').removeClass(function (index, css) {
			            return (css.match (/(^|\s)filter-\S+/g) || []).join(' ');
			        });

			        if( $this.hasClass('active') ){
			            $('.toggle-competencies').removeClass('active');
			            $('.competencies-filter').removeClass('active');
			            $('.competencies-filter .options a').removeClass('active');
			            $('.sections').removeClass('filtered');
			            $('.current-filter').html('Select').removeClass('full');
			            $('.options-panel').removeClass('active');
			        }else{
			            $('.toggle-competencies').removeClass('active');
			            $('.competencies-filter').addClass('active');
			            $('.competencies-filter .options a').removeClass('active');
			            $(this).addClass('active');
			            $('.sections').addClass('filtered filter-' + comp);
			            $('.options-panel').removeClass('active');
			            $('.current-filter').html(comp_name).addClass('full');
			        }
			    });

			    $('.competencies-filter .clear-selection').on('click tap touch', function(e){
			        e.stopPropagation(); //prevents lag from analytics script
			        e.preventDefault();

			        $('.toggle-competencies').removeClass('active');
			        $('.sections').removeClass('filtered');
			        $('.competencies-filter').removeClass('active');
			        $('.competencies-filter .options a').removeClass('active');
			        $('.current-filter').html('Select').removeClass('full');
			        $('.options-panel').removeClass('active');
			        $('.sections').removeClass(function (index, css) {
			            return (css.match (/(^|\s)filter-\S+/g) || []).join(' ');
			        });
			    });
			},
			
			init_sponsor_modals: function() {
				var self = this;
				if ($('.section-sponsors').length === 0) return false;

				//click logo to open modal
				$('.sponsor-logo').click(function() {
					$('.sponsor-logo.active').removeClass('active');
					$(this).addClass('active');
					self.open_sponsor_modal();
				});
				
				//next and back buttons
				$('.sponsor-modal .next').click(function() {
					var active = $('.sponsor-logo.active').index('.sponsor-logo');
					var next = active + 1;
					if ($('.sponsor-logo').eq(next).length === 0) {	//loop back to first element
						next = 0;
					}
					$('.sponsor-logo.active').removeClass('active');
					$('.sponsor-logo').eq(next).addClass('active');
					self.open_sponsor_modal();
				});
				$('.sponsor-modal .back').click(function() {
					var active = $('.sponsor-logo.active').index('.sponsor-logo');
					var prev = active - 1;
					if (prev < 0) {
						prev = $('.sponsor-logo').length - 1;	//loop to final element
					}
					$('.sponsor-logo.active').removeClass('active');
					$('.sponsor-logo').eq(prev).addClass('active');
					self.open_sponsor_modal();
				});
				
				//Esc close modal
				$(document).on('keydown', function (e) {
					if (e.keyCode === 27) {
						e.preventDefault();
						self.close_sponsor_modal();
					}
				});
				
				//Click overlay or X to close modal
				$('.modal-overlay, .sponsor-modal .close').click(function() {
					self.close_sponsor_modal();
				});
			},
			
			open_sponsor_modal: function() {
				//Populate data into modal
				var $active = $('.sponsor-logo.active');
				$('.sponsor-modal .logo').html($active.find('img').clone());
				var level = $active.closest('.sponsor-list').find('h3').text() + ' Sponsor';
				$('.sponsor-modal .level').html(level);
				var url = $active.data('url');
				var url_nice = url;
				url_nice = url_nice.replace('http://', '');
				url_nice = url_nice.replace('https://', '');
				url_nice = url_nice.replace(/\/$/, '');	//trim trailing slash
				$('.sponsor-modal .url').attr('href', url);
				$('.sponsor-modal .url').html(url_nice);
				var name = $active.find('img').attr('alt');
				$('.sponsor-modal .name').html(name);
				var description = $active.data('description');
				$('.sponsor-modal .description').html(description);
				if( $active.data('pdfs') != undefined) {
					$('.sponsor-modal .pdfs').html("");
					this.add_pdfs($active.data('pdfs'))
				} else {
					$('.sponsor-modal .pdfs').html("");
				};
				
				$('.sponsor-modal').fadeIn(300);
				$('.modal-overlay').fadeIn(300);
			},

			add_pdfs: function(pdfs) {
				var pdf_name, pdf_url;
	
				$.each(pdfs, function(i) {
					pdf_name = pdfs[i].name;
					pdf_url = pdfs[i].url;
					$('.sponsor-modal .pdfs').append('<a class="pdf-url" href=' + pdf_url + ' target="_blank"><span>>> </span>' + pdf_name + '</a><br>');
				});
			},

			close_sponsor_modal: function() {
				$('.sponsor-logo.active').removeClass('active');
				$('.sponsor-modal').fadeOut(300);
				$('.modal-overlay').fadeOut(300);
			},

			magnify: function() {


				var native_width = 0;
				var native_height = 0;

				//Now the mousemove function
				$(".magnify").mousemove(function(e){
					//When the user hovers on the image, the script will first calculate
					//the native dimensions if they don't exist. Only after the native dimensions
					//are available, the script will show the zoomed version.
					if(!native_width && !native_height)
					{
						//This will create a new image object with the same image as that in .small
						//We cannot directly get the dimensions from .small because of the 
						//width specified to 200px in the html. To get the actual dimensions we have
						//created this image object.
						var image_object = new Image();
						image_object.src = $(".smallrr").attr("src");
						
						//This code is wrapped in the .load function which is important.
						//width and height of the object would return 0 if accessed before 
						//the image gets loaded.
						native_width = image_object.width;
						native_height = image_object.height;
					}
					else
					{
						//x/y coordinates of the mouse
						//This is the position of .magnify with respect to the document.
						var magnify_offset = $(this).offset();
						//We will deduct the positions of .magnify from the mouse positions with
						//respect to the document to get the mouse positions with respect to the 
						//container(.magnify)
						var mx = e.pageX - magnify_offset.left;
						var my = e.pageY - magnify_offset.top;
						
						//Finally the code to fade out the glass if the mouse is outside the container
						if(mx < $(this).width() && my < $(this).height() && mx > 0 && my > 0)
						{
							$(".largerr").fadeIn(100);
						}
						else
						{
							$(".largerr").fadeOut(100);
						}
						if($(".largerr").is(":visible"))
						{
							//The background position of .large will be changed according to the position
							//of the mouse over the .small image. So we will get the ratio of the pixel
							//under the mouse pointer with respect to the image and use that to position the 
							//large image inside the magnifying glass
							var rx = Math.round(mx/$(".smallrr").width()*native_width - $(".largerr").width()/2)*-1;
							var ry = Math.round(my/$(".smallrr").height()*native_height - $(".largerr").height()/2)*-1;
							var bgp = rx + "px " + ry + "px";
							
							//Time to move the magnifying glass with the mouse
							var px = mx - $(".largerr").width()/2;
							var py = my - $(".largerr").height()/2;
							//Now the glass moves with the mouse
							//The logic is to deduct half of the glass's width and height from the 
							//mouse coordinates to place it with its center at the mouse coordinates
							
							//If you hover on the image now, you should see the magnifying glass in action
							$(".largerr").css({left: px, top: py, backgroundPosition: bgp});
						}
					}
				})
			}

        };
    }


    return {
    /* Get an instance of this singleton
    * @return object
    */
    getInstance: function () {
        if (!_instance)
            _instance = kickoff();
        return _instance;
    }
};
})(jQuery);

// Instantiate the class
tet_main = tet.main.getInstance();
// Run initialize method
tet_main.initialize();

