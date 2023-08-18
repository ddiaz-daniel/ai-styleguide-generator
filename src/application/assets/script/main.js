
// use namespacing - don't put everything in window
Generator = {
    datepickers: [],
    init_load: function () {
        Generator.initFormFunctions();
        Generator.StyleguideFunctions();
        Generator.categorieHandler();
        Generator.elementHandler();
        Generator.dragAndDrop();
        Generator.dashboardView();
        Generator.tabsInit();
        Generator.linkToAccountHandler();
        Generator.paymentHandler();
    },

    init_ready: function () {
        Generator.websiteFunctions();
        Generator.initMenu();
    },

    initMenu: function () {
        $('header .burger-icon').on('click', function () {
            $('header').toggleClass('menu-open');
        });
        $('.sidebar .mobile-arrow').on('click', function () {
            $('main').toggleClass('sidebar-collapsed');
        });
        $('main').toggleClass('sidebar-collapsed');

        $('.main_container').on('scroll', function () {
            if ($('.sidebar.shared').length > 0) {
                $('.anker').each(function (i, el) {
                    const $el = $(el);
                    if ($el.isInViewport_top()) {
                        if (!$el.hasClass('active')) {
                            $('.anker').removeClass('active');
                            $('.sidebar .categories .sub').removeClass('activemenu');
                            $('.sidebar .categories .main').removeClass('activemenu');

                            $el.addClass('active');
                            $($('.sidebar .categories .sub')[i - 1]).addClass('activemenu');
                            if (i == 0) {
                                $($('.sidebar .categories .main')[0]).addClass('activemenu');
                            }
                        }
                    }
                });
            }
        });
    },

    checkRegisterFields: function () {
        var error = false;

        if ($('.loginbox #registerform input[name="email"]').val() == "") {
            $('.loginbox #registerform input[name="email"]').css('border-color', 'red');
            $('.loginbox #registerform input[name="email"]')[0].style.background = 'rgb(255 0 0 / 13%)';
            error = true;
        }

        if ($('.loginbox #registerform input[type="checkbox"]').is(':checked') == false) {
            $('.loginbox #registerform input[type="checkbox"]').parent()[0].style.border = '1px solid red';
            $('.loginbox #registerform input[type="checkbox"]').parent()[0].style.padding = '10px';
            $('.loginbox #registerform input[type="checkbox"]').parent()[0].style.background = 'rgb(255 0 0 / 13%)';
            error = true;
        }

        if (error) {
            e.stopPropagation();
            e.preventDefault();
        } else {
            $('.loginbox #registerform').trigger('submit');
        }
    },

    checkStartFields: function () {
        var error = false;

        if ($('.startregister #registerform input[name="email"]').val() == "") {
            $('.startregister #registerform input[name="email"]').css('border-color', 'red');
            $('.startregister #registerform input[name="email"]')[0].style.background = 'rgb(255 0 0 / 13%)';
            error = true;
        }

        if ($('.startregister #registerform input[type="checkbox"]').is(':checked') == false) {
            $('.startregister #registerform input[type="checkbox"]').parent()[0].style.border = '1px solid red';
            $('.startregister #registerform input[type="checkbox"]').parent()[0].style.padding = '10px';
            $('.startregister #registerform input[type="checkbox"]').parent()[0].style.background = 'rgb(255 0 0 / 13%)';
            error = true;
        }

        if (error) {
            e.stopPropagation();
            e.preventDefault();
        } else {
            $('.startregister #registerform').trigger('submit');
        }
    },
    checkStartFields2: function () {
        var error = false;

        if ($('.startregister2 #registerform input[name="email"]').val() == "") {
            $('.startregister2 #registerform input[name="email"]').css('border-color', 'red');
            $('.startregister2 #registerform input[name="email"]')[0].style.background = 'rgb(255 0 0 / 13%)';
            error = true;
        }

        if ($('.startregister2 #registerform input[type="checkbox"]').is(':checked') == false) {
            $('.startregister2 #registerform input[type="checkbox"]').parent()[0].style.border = '1px solid red';
            $('.startregister2 #registerform input[type="checkbox"]').parent()[0].style.padding = '10px';
            $('.startregister2 #registerform input[type="checkbox"]').parent()[0].style.background = 'rgb(255 0 0 / 13%)';
            error = true;
        }

        if (error) {
            e.stopPropagation();
            e.preventDefault();
        } else {
            $('.startregister2 #registerform').trigger('submit');
        }
    },

    StyleguideFunctions: function () {
        $('.js-open-new-styleguide-overlay').on('click', function () {
            $('.newStyleguideOverlay').fadeIn();
        });

        $('.styleguide .bottom .btn-primary').on('click', function (e) {
            e.stopPropagation();
        });

        $('.js-delete-styleguide').on('click', function (e) {
            if (confirm($(e.currentTarget).data('delete-message'))) {
            } else {
                e.stopPropagation();
                e.preventDefault();
            }
        });

        $('.js-set-example-active').on('click', function (e) {
            $el = $(e.currentTarget);
            if ($el.hasClass('active')) {
                $el.removeClass('active');
                $el.html($el.data('inactive-text'));
            } else {
                $el.addClass('active');
                $el.html($el.data('active-text'));
            }

            var choosenCats = [];
            $('.js-set-example-active').each(function (i, el) {
                if ($(el).hasClass('active')) {
                    choosenCats.push($(el).data('id'));
                }
            });
            $('#js-set-cats-for-copy').val(choosenCats.join(','));
        });
    },

    initFormFunctions: function () {
        $('#registerform input').on('change', function (e) {
            e.currentTarget.style.border = '';
            e.currentTarget.style.background = '';
            $(e.currentTarget).parent()[0].style.border = '';
            $(e.currentTarget).parent()[0].style.background = '';
        });


        $("form input.js-init-datepicker:not(.js-datepicker)").each(function (i, el) {
            $el = $(el);

            $el.addClass("js-datepicker");
            $el.attr("data-id", "datepicker-" + i);

            Generator.datepickers["datepicker-" + i] = $el.flatpickr({
                value: $el.val(),
                locale: "de",
                enableTime: true,
                time_24hr: true,
                defaultHour: 0,
                weekNumbers: true,
                altInput: true,
                altFormat: "j. F Y H:i"
            });
        });

        $('.message i').on('click', function (e) {
            $(e.currentTarget).parent().fadeOut();
        });
        if ($('.message').length) {
            setTimeout(function () {
                $('.message').fadeOut();
            }, 3000)
        }

        if ($('#js-setActiveCountry').length) {
            $('select[name="country"] option[value="' + $('#js-setActiveCountry').data('country') + '"]').prop('selected', 'selected');
        }
    },

    categorieHandler: function () {
        var lastMenuTarget;
        $('.js-close-overlay').on('click', function () {
            $('.overlay').fadeOut();
        });
        $('.js-new-category').on('click', function () {
            $('.categoryOverlay').fadeIn();
        });
        $('.js-add-menu').on('click', function (e) {
            var $overlay = $(e.currentTarget).parent().parent();

            if ($('.menu_input', $overlay).val() != "") {
                // as soon as first menu is added form can be submitted
                $('.menu_input', $overlay).attr('required', false);
                $('.menus', $overlay).append('<div id="menu-' + $('.menus').children().length + '" class="menu" draggable="true" ><div class="drag"><i class="fas fa-grip-vertical"></i><i class="fas fa-grip-vertical"></i></div><input type="text" name="cat_menus[]" value="' + $('.menu_input', $overlay).val() + '" required><input type="hidden" name="cat_menuids[]" value="0" required><input type="hidden" class="cat_menuPos" name="cat_menuPos[]" value="' + $('.menus').children().length + '" required><div class="tools"><i class="js-delete-menu far fa-trash"></i></div></div>');
                $('.menu_input', $overlay).val("");
                $(".menu").on("dragstart", function (ev) {
                    ev.originalEvent.dataTransfer.setData("text", ev.originalEvent.target.id);
                    lastMenuTarget = ev.originalEvent.target;
                });
                $('.js-delete-menu', $overlay).bind().on('click', function (e) {
                    $(e.currentTarget).parent().parent().remove();
                });
            }
        });
        $('.js-handle-new-categorie').on('click', function (e) {
            if ($(e.currentTarget).parent().parent().find('.menu_input').val() != "") {
                $(e.currentTarget).parent().parent().find('.js-add-menu').trigger('click');
            }
        });
        $('.js-edit-category').on('click', function (e) {
            var id = $(e.currentTarget).data('category');
            //get category and Subpoints
            $.post('/api/getCategory', { id: id }, function (data) {
                var category = JSON.parse(data);
                var overlay = $('.editcategoryOverlay');

                overlay.find('input[name=cat_name]').val(category.title);
                overlay.find('input[name=cat_id]').val(category.id);
                $('.menus', overlay).html('');

                category.types.forEach(function (type) {
                    $('.menus', overlay).append('<div id="menu-' + type.id + '" class="menu" draggable="true"><div class="drag"><i class="fas fa-grip-vertical"></i><i class="fas fa-grip-vertical"></i></div><input type="text" name="cat_menus[]" value="' + type.title + '" required><input type="hidden" name="cat_menuids[]" value="' + type.id + '" required><input type="hidden" class="cat_menuPos" name="cat_menuPos[]" value="' + $('.menus').children().length + '" required><div class="tools"><i class="js-delete-menu far fa-trash"></i></div></div>');
                });

                $(".menu").on("dragstart", function (ev) {
                    ev.originalEvent.dataTransfer.setData("text", ev.originalEvent.target.id);
                    lastMenuTarget = ev.originalEvent.target;
                });
                $('.js-delete-menu').bind().on('click', function (e) {
                    $(e.currentTarget).parent().parent().remove();
                });
                overlay.fadeIn();
            });
        });
        $('.js-delete-category').on('click', function (e) {
            var text_de = "Kategorie wirklich löschen?";
            var text = "Are you sure for deleting the category?";

            if (confirm(text)) {
                var id = $('input[name=cat_id]').val();
                $.post('/api/deleteCategory', { id: id }, function (data) {
                    window.location.reload();
                });
            }
        });
        $('.js-sortdown-category').on('click', function (e) {
            var $cat = $(e.currentTarget).closest('.category');
            var $next = $cat.next();
            $cat.insertAfter($next);

            var styleguideId = $('#styleguideid_sidebar').html();
            var order = [];
            $('.categories .category').each(function (i, el) {
                order.push($(el).data('categoryid'));
            });
            $.post('/api/setCategoryPosition', { styleguideId: styleguideId, order: order }, function (data) { });
        });
        $('.js-sortup-category').on('click', function (e) {
            var $cat = $(e.currentTarget).closest('.category');
            var $prev = $cat.prev();
            $cat.insertBefore($prev);

            var styleguideId = $('#styleguideid_sidebar').html();
            var order = [];
            $('.categories .category').each(function (i, el) {
                order.push($(el).data('categoryid'));
            });
            $.post('/api/setCategoryPosition', { styleguideId: styleguideId, order: order }, function (data) { });
        });

        //print and share options
        $(".js-check-print-types input").on('change', Generator.handlePrintCheckboxen);
        $('.js-open-printdialog').on('click', function () {
            window.print();
        });
        $('.js-generate-shar-link').on('click', Generator.generateShareLink);
        $('.js-copy-shareLink').on('click', function () {
            $('.js-shareLink').select();
            document.execCommand('copy');
            $('.linkbox .copied').fadeIn();
            setTimeout(function () {
                $('.linkbox .copied').fadeOut();
            }, 1000);
        });
        $('.js-generate-full-share-link').on('click', Generator.generateFullShareLink);
    },

    elementHandler: function () {

        // $('.elements .element .image_wrapper').matchHeight();

        $('.js-new-element').on('click', function () {
            // tiny mce editor
            tinymce.init({
                selector: `textarea#newElement`,
                menubar: '',
                plugins: 'lists link',
                toolbar: 'bold italic | numlist bullist | alignleft aligncenter alignright alignjustify | link',
                forced_root_block: ""
            });

            // hide all mce editors
            $('.tox-tinymce').each(function (index, element) {
                $(element).css('display', 'none');
            });

            // display the correct one
            if ($(`.tox-tinymce #newElement_ifr`).length > 0) {
                $(`.tox-tinymce #newElement_ifr`).parents(`.tox-tinymce`).css('display', 'flex');
            }

            //backgroundcolor reset
            $('.js-show-backgroundcolor', $('.elementOverlay')).prop('checked', false);
            $('.color-select-wrapper', $('.elementOverlay')).hide();

            //outline reset
            $('input[name="has_outline"]', $('.elementOverlay')).prop('checked', false);

            $('.elementOverlay').fadeIn();
        });
        $('.js-edit-element').on('click', function (e) {
            var $el = $(e.currentTarget);
            var id = $(e.currentTarget).parent().data("elementid");
            var $overlay = $('.editelementOverlay');

            $('textarea[name=description]', $overlay).prop("id", `textarea-${id}`);

            $('input[name=element_id]', $overlay).val(id);
            $('input[name=cols][value=' + $el.data('cols') + ']', $overlay).prop('checked', true);
            $('input[name=title]', $overlay).val(convertToHTML($el.data('title')));


            if ($el.data('color') != "") {
                $('.js-show-backgroundcolor', $overlay).prop('checked', true);
                $('.color-select-wrapper', $overlay).show();
                $('input[name=color]', $overlay).val($el.data('color'));
            } else {
                $('.js-show-backgroundcolor', $overlay).prop('checked', false);
                $('.color-select-wrapper', $overlay).hide();
            }

            if ($el.data('hasoutline') != "") {
                $('input[name="has_outline"]', $overlay).prop('checked', true);
            } else {
                $('input[name="has_outline"]', $overlay).prop('checked', false);
            }

            if ($el.data('image') != "") {
                $('.edit-preview-image', $overlay).attr('src', 'https://ki.styleguide-generator.com/file?path=' + $el.data('image'));
                $('input[name=old_image]').val('.' + $el.data('image'));
            } else {
                $('.edit-preview-image', $overlay).attr('src', "/application/assets/images/preview_image.svg");
                $('input[name=old_image]').val('');
            }


            if ($el.data('uploads') != "") {
                var key = 0;
                var uploads = $el.data('uploads').split(',');
                var uploadids = null;
                if (Number.isInteger($el.data('uploadids'))) {
                    uploadids = [$el.data('uploadids')];
                } else {
                    uploadids = $el.data('uploadids').split(',');
                }
                $('.uploads', $overlay).html('');
                uploads.forEach(function (el) {
                    $('.uploads', $overlay).append('<div><input type="hidden" name="old_uploads[]" value="' + uploadids[key] + '">' + el + '<i class="js-delete-upload far fa-trash"></i></div>');
                    key++;
                });
                $('.js-delete-upload').on('click', function (e) {
                    $(e.currentTarget).parent().remove();
                    e.stopPropagation();
                    e.preventDefault();
                });
            }

            $('.color-hex-text').prop('value', function (i, old) {
                return $(this).prev('.color-selector')[0].value;
            });

            $('.color-hex-text-1').prop('value', function (i, old) {
                return $(this).prev('.color-selector-1')[0].value;
            });

            // tiny mce editor
            tinymce.init({
                selector: `textarea#textarea-${id}`,
                menubar: '',
                plugins: 'lists link',
                toolbar: 'bold italic | numlist bullist | alignleft aligncenter alignright alignjustify | link',
                forced_root_block: ""
            });

            // hide all mce editors
            $('.tox-tinymce').each(function (index, element) {
                $(element).css('display', 'none');
            });
            // display the correct one
            if ($(`.tox-tinymce #textarea-${id}_ifr`).length > 0) {
                $(`.tox-tinymce #textarea-${id}_ifr`).parents(`.tox-tinymce`).css('display', 'flex');
            }
            $overlay.fadeIn(function () {
                // display the text saved for this element
                tinymce.get(`textarea-${id}`).setContent("");
                setTimeout(function () {
                    tinymce.get(`textarea-${id}`).setContent(convertToHTML($el.data('description')));
                }, 500);
            });
        });

        $('.js-show-backgroundcolor').on('change', function (e) {
            $el = $(e.currentTarget);

            if ($el.is(':checked')) {
                $el.parent().next().find('.color-select-wrapper').show()
            } else {
                $el.parent().next().find('.color-select-wrapper').hide()
            }
        });

        $('.js-delete-element').on('click', function (e) {
            if (confirm($(e.currentTarget).data('delete-message'))) {
                var id = $(e.currentTarget).parent().data("elementid");
                $.post('/api/deleteElement', { id: id }, function (data) {
                    $(e.currentTarget).parent().parent().fadeOut();
                });
            } else {
                e.stopPropagation();
                e.preventDefault();
            }
        });
        $('.js-edit-comment').on('click', function (e) {
            var $el = $(e.currentTarget);
            var id = $(e.currentTarget).parent().data("elementid");
            var $overlay = $('.editElementComment');

            $('input[name=element_id]', $overlay).val(id);
            $('input[name=comment_headline]', $overlay).val($el.data('title'));
            $('textarea[name=comment_description]', $overlay).val($el.data('description'));
            $overlay.fadeIn();
        });
        $(".js-preview-image").change(function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.preview-image').attr('src', e.target.result);
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        $(".js-edit-preview-image").change(function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.edit-preview-image').attr('src', e.target.result);
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        $('.js-remove-previewimage').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            $('.preview-image').attr('src', '/application/assets/images/preview_image.svg');
            $('.edit-preview-image').attr('src', '/application/assets/images/preview_image.svg');
            $('input[name=image]').val('');
            $('input[name=old_image]').val('');
        });

        // update colorinputs on change of one of them
        $('.color-hex-text').prop('value', function (i, old) {
            return $(this).prev('.color-selector')[0].value;
        });
        $('.color-hex-text-1').prop('value', function (i, old) {
            return $(this).prev('.color-selector-1')[0].value;
        });

        $('.color-selector').on('input', function () {
            $('.color-hex-text').prop('value', $(this).val());
        });
        $('.color-selector-1').on('input', function () {
            $('.color-hex-text-1').prop('value', $(this).val());
        });

        $('.color-hex-text').on('input', function () {
            $('.color-selector').prop('value', $(this).val());
        });
        $('.color-hex-text-1').on('input', function () {
            $('.color-selector-1').prop('value', $(this).val());
        });

        // kommentar icon einfärben
        $('.js-edit-comment').each(function (i, obj) {

            if (obj.getAttribute('data-title') != "") {
                $(obj).css("font-weight", "700");
                $(obj).css("color", "#6B0BFD");
            }
        });

        //mehr anzeigen/weniger anzeigen bei Beschreibung
        if ($('.main_container.shortendesc').length) {
            $('.element .description .inner').each(function (i, el) {
                if (el.scrollHeight > el.clientHeight) {
                    $(el).parent().addClass('more');
                }
            });
            $('.description .js-show-more').on('click', function (e) {
                $(e.currentTarget).parent().addClass('show_more');
            });
            $('.description .js-show-less').on('click', function (e) {
                $(e.currentTarget).parent().removeClass('show_more');
            });
        }

        //logo löschen
        $('.js-delete-logo').on('click', function (e) {
            $('.deletelogodiv').remove();
            $('.deletelogoinput').val('');
            e.stopPropagation();
            e.preventDefault();
        });
    },

    handlePrintCheckboxen: function (e) {
        //status erfragen
        var $checkbox = $(e.currentTarget);
        //reset linkbox
        $('.linkbox').hide().find('input').val('');

        if ($checkbox.parent().hasClass('sub')) {
            if ($checkbox.is(':checked')) {
                $checkbox.parent().parent().find('input').first().prop('checked', true);
            } else {
                var empty = true;
                $checkbox.parent().parent().find('.sub input').each(function (i, el) {
                    var $el = $(el);
                    if ($el.is(':checked')) {
                        empty = false;
                    }
                });
                if (empty) {
                    $checkbox.parent().parent().find('input').each(function (i, el) {
                        var $el = $(el);
                        $el.prop("checked", false);
                    });
                }
            }
        } else {
            //alle an bzw. abwählen
            if ($checkbox.is(':checked')) {
                $checkbox.parent().parent().find('input').each(function (i, el) {
                    var $el = $(el);
                    $el.prop("checked", true);
                });
            } else {
                $checkbox.parent().parent().find('input').each(function (i, el) {
                    var $el = $(el);
                    $el.prop("checked", false);
                });
            }
        }


        $(".js-check-print-types input").each(function (i, el) {
            var $el = $(el);

            if ($el.data('category')) {
                if ($el.is(':checked')) {
                    $('.main_container div[data-category=' + $el.data('category') + ']').show();
                } else {
                    $('.main_container div[data-category=' + $el.data('category') + ']').hide();
                }
            } else {
                if ($el.data('type')) {
                    if ($el.is(':checked')) {
                        $('.main_container div[data-type=' + $el.data('type') + ']').show();
                    } else {
                        $('.main_container div[data-type=' + $el.data('type') + ']').hide();
                    }
                }
            }
        });


    },

    generateShareLink: function (e) {
        var days = parseInt($('.js-valid').val());
        if (days < 1 || days == "") {
            $('.js-valid').val('3');
            days = 3;
        }

        //get typeconfig
        var categories = [];
        var types = [];
        $(".js-check-print-types input").each(function (i, el) {
            var $el = $(el);
            if ($el.data('category')) {
                if ($el.is(':checked')) {
                    categories.push($el.data('category'));
                }
            } else {
                if ($el.data('type')) {
                    if ($el.is(':checked')) {
                        types.push($el.data('type'));
                    }
                }
            }
        });

        var styleguideId = $('#styleguideId').html();

        data = {
            "styleguideId": styleguideId,
            "days": days,
            "config": {
                "categories": categories,
                "types": types
            }
        }

        $.post('/api/generateShareLink', data, function (data) {
            $('.linkbox input').val('https://ki.styleguide-generator.com/share/' + data);
            $('.linkbox').fadeIn();
            $('.linkbox .newlink').fadeIn();
            setTimeout(function () {
                $('.linkbox .newlink').fadeOut();
            }, 1000);
        });
    },

    generateFullShareLink: function (e) {
        var days = parseInt($('.js-valid').val());
        if (days < 1 || days == "") {
            $('.js-valid').val('3');
            days = 3;
        }

        var styleguideId = $('.sharebox').attr('data-id');

        data = {
            "styleguideId": styleguideId,
            "days": days,
            "fulllink": true
        }

        $.post('/api/generateShareLink', data, function (data) {
            $('.linkbox input').val('https://ki.styleguide-generator.com/share/' + data);
            $('.linkbox').fadeIn();
            $('.linkbox .newlink').fadeIn();
            setTimeout(function () {
                $('.linkbox .newlink').fadeOut();
            }, 1000);
        });
    },

    dragAndDrop: function () {
        // drag and drop Elements
        lastTarget = $(".element").get(-2);
        dragElement = null;
        function getTarget(className, target) {
            let parentsClass = "." + className + "s";
            if ($(target).parents(parentsClass).length == 0 || target == undefined || target == null || $(target).children(parentsClass).length > 0 || (target.classList && target.classList.contains(parentsClass))) {
                target = lastTarget;
            } else {
                while (target.classList == undefined || !target.classList.contains(className)) {
                    target = target.parentNode;
                }
            }

            lastTarget = target;
            return target;
        }

        // element drag and drop
        $(".elements").on("dragover", function (ev) {
            ev.originalEvent.preventDefault();

            let target = getTarget("element", ev.originalEvent.target);
            let bounding = target.getBoundingClientRect()
            let offset = bounding.x + (bounding.width / 2);
            if (ev.originalEvent.clientX - offset > 0) {
                target.style['border-right'] = 'solid 1px grey';
                target.style['border-left'] = '';
            } else {
                target.style['border-left'] = 'solid 1px grey';
                target.style['border-right'] = '';
            }
        });

        $(".element").on("dragstart", function (ev) {
            dragElement = $(ev.originalEvent.target).closest('.element')[0];
        });


        document.addEventListener('dragleave', function (ev) {
            let target = getTarget("element", ev.target);
            target.style['border-right'] = '';
            target.style['border-left'] = '';
        });


        $(".elements").on("drop", function (ev) {
            ev.originalEvent.preventDefault();
            let target = getTarget("element", ev.originalEvent.target);

            if (target.style['border-right'] !== '') {
                target.style['border-right'] = '';
                target.parentNode.insertBefore(dragElement, target.nextSibling);
            } else {
                target.style['border-left'] = '';
                target.parentNode.insertBefore(dragElement, target);
            }

            let id = $('.elements').attr('id');
            let order = [];

            $('.element').each(function (index, elem) {
                order.push($(elem).attr('id'));
            })

            order = order.join(',');

            $.post(`${id}/updateElements`, { 'order': order });
        });

        // drag and drop Kategorie

        $(".menus").on("dragover", function (ev) {
            ev.originalEvent.preventDefault();

            let target = getTarget("menu", ev.originalEvent.target);
            let bounding = target.getBoundingClientRect()
            let offset = bounding.y + (bounding.height / 2);
            if (ev.originalEvent.clientY - offset > 0) {
                target.style['border-bottom'] = 'solid 1px grey';
                target.style['border-top'] = '';
            } else {
                target.style['border-top'] = 'solid 1px grey';
                target.style['border-bottom'] = '';
            }


        });

        $(".menu").on("drag", function (ev) {
            ev.originalEvent.dataTransfer.setData("text", ev.originalEvent.target.id);
            lastTarget = ev.originalEvent.target;
        });


        document.addEventListener('dragleave', function (ev) {
            let target = getTarget("menu", ev.target);
            target.style['border-top'] = '';
            target.style['border-bottom'] = '';

        });

        $(".menus").on("drop", function (ev) {
            ev.originalEvent.preventDefault();
            let data = ev.originalEvent.dataTransfer.getData("text");
            let target = getTarget("menu", ev.originalEvent.target);

            if (target.style['border-bottom'] !== '') {
                target.style['border-bottom'] = '';
                target.parentNode.insertBefore(document.getElementById(data), target.nextSibling);
            } else {
                target.style['border-top'] = '';
                target.parentNode.insertBefore(document.getElementById(data), target);
            }

            $('.menus .menu').each(function (index, elem) {
                $(elem).children('.cat_menuPos').val(index);
            })
        });

    },

    dashboardView: function () {
        $(".js-list").on("click", function () {
            $('.container-fluid').toggleClass('listed');
            setCookie('viewtype', 'listed', 365);
        });
        $(".js-tile").on("click", function () {
            $('.container-fluid').toggleClass('listed');
            setCookie('viewtype', 'tiled', 365);
        });

        $('.js-add-user').on('click', function (e) {
            var $overlay = $(e.currentTarget).parent().parent();
            if ($('.user_input', $overlay).val() != "") {
                let email = $('.user_input', $overlay).val();
                let role = $('.role_input', $overlay).val();

                if (role == "editor") {
                    roletext = "Editor";
                }
                if (role == "viewer") {
                    roletext = "Viewer";
                }

                $.post('/api/inviteUser', { email: email, role: role, styleguideId: $overlay.parent()[0].id.split("-")[1] }, function (status) {
                    if (status === '"success"') {
                        $('.users', $overlay).append('<div class="user"><div class="user-icon"><i class="far fa-user"></i></div><div class="userinfo">' + email + ' <small>(' + roletext + ')</small></div><input type="hidden" name="cat_userids[]" value="0" required><div class="tools"><i class="js-remove-user far fa-trash" data-email="' + email + '"></i></div></div>');
                        $('.user_input', $overlay).val("");
                        $('.js-remove-user').bind().on('click', function (e) {
                            $.post('/api/removeInvitedUser', { styleguideId: $overlay.parent()[0].id.split("-")[1], userEmail: $(e.currentTarget).attr('data-email') }, function () {
                                $(e.currentTarget).parent().parent().remove();
                            });
                        });
                    } else if (status === '"no_such_user"' || status === '"error"') {
                        $('.error-message_nouser', $overlay).fadeIn(200).delay(3000).fadeOut(200);
                    } else if (status === '"alreadyin"') {
                        $('.error-message_alreadyin', $overlay).fadeIn(200).delay(3000).fadeOut(200);
                    } else if (status === '"tomuchviewers"') {
                        $('.error-message_tomuchviewers', $overlay).fadeIn(200).delay(3000).fadeOut(200);
                    } else if (status === '"tomucheditors"') {
                        $('.error-message_tomucheditors', $overlay).fadeIn(200).delay(3000).fadeOut(200);
                    }
                });
            }
        });
    },

    tabsInit: function () {
        function Tabs() {
            var bindAll = function () {
                var menuElements = document.querySelectorAll('[data-tab]');
                for (var i = 0; i < menuElements.length; i++) {
                    menuElements[i].addEventListener('click', change, false);
                }
            }

            var clear = function () {
                var menuElements = document.querySelectorAll('[data-tab]');
                for (var i = 0; i < menuElements.length; i++) {
                    menuElements[i].classList.remove('active');
                    var id = menuElements[i].getAttribute('data-tab');
                    document.getElementById(id).classList.remove('active');
                }
            }

            var change = function (e) {
                e.preventDefault();
                clear();
                e.target.classList.add('active');
                var id = e.currentTarget.getAttribute('data-tab');
                document.getElementById(id).classList.add('active');
            }

            bindAll();
        }

        var connectTabs = new Tabs();
    },

    websiteFunctions: function () {
        $('.accordion .toggler').on('click', function (e) {

            $('.accordion .active').removeClass('active');
            if (false == $(e.currentTarget).next().is(':visible')) {
                $('.toggletext').slideUp(600);
                $(e.currentTarget).addClass('active');
            }
            $(e.currentTarget).next().slideToggle(600);

        });
    },

    linkToAccountHandler: function () {
        $('.js-linkToAccount').on('click', function () {
            var shareLink = $('.js-linkToAccount').attr('data-shareLink');

            $.post('/api/linkToAccount', { shareLink: shareLink }, function (data) {
                $('.js-linkToAccount').hide();
                $('.js-unLinkFromAccount').show();
            });
        });

        $('.js-unLinkFromAccount').on('click', function () {
            var shareLink = $('.js-unLinkFromAccount').attr('data-shareLink');

            $.post('/api/unLinkFromAccount', { shareLink: shareLink }, function (data) {
                $('.js-unLinkFromAccount').hide();
                $('.js-linkToAccount').show();
            });
        });
    },

    paymentHandler: function () {
        // In production, this should check CSRF, and not pass the session ID.
        // The customer ID for the portal should be pulled from the
        // authenticated user on the server.
        let searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('session_id')) {
            const session_id = searchParams.get('session_id');
            document.getElementById('session-id').setAttribute('value', session_id);
        }
    }
}

// init Generator
$(window).on("load", Generator.init_load);
$(document).ready(Generator.init_ready);

$(window).on("load", function () {
    const footer = $("footer");
    if (footer && footer.length > 0) {
        const offsetBottom = footer[0].offsetTop + footer[0].clientHeight;

        if (window.innerHeight > offsetBottom) {
            $(footer).addClass('fixedBottom');
        }
    }
});


function searchStyleguide() {
    // Declare variables
    var input, filter, styleguides, title, i, txtValue;
    input = document.getElementById('searchfield');
    filter = input.value.toUpperCase();
    styleguides = document.getElementById("styleguides");
    styleguides = styleguides.getElementsByClassName('styleguide');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < styleguides.length; i++) {
        title = styleguides[i].getElementsByClassName("title")[0];
        txtValue = title.textContent || title.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            styleguides[i].style.display = "";
        } else {
            styleguides[i].style.display = "none";
        }
    }
}

function inviteUser(e) {
    e.stopPropagation();

    var styleguideId = $(e.target).parents(".styleguide")[0].id.split("-")[1];

    //get category and Subpoints
    $.post('/api/getInvitedUsersOverlay', { id: styleguideId }, function (data) {
        var users = JSON.parse(data);
        var overlay = $('.inviteUsersOverlay');

        $('.users', overlay).html('');

        users.forEach(function (user) {

            if (user.role == 'viewer') {
                user.role = "Viewer";
            }
            if (user.role == 'editor') {
                user.role = "Editor";
            }
            if (user.role == 'owner') {
                user.role = "Owner";
            }

            $('.users', overlay).append('<div class="user"><div class="user-icon"><i class="far fa-user"></i></div><div class="userinfo">' + user.email + ' <small>(' + user.role + ')</small></div><input type="hidden" name="cat_userids[]" value="0" required><div class="tools"><i class="js-remove-user far fa-trash" data-email="' + user.email + '"></i></div></div>');
        });

        $('.js-remove-user').bind().on('click', function (e) {
            $.post('/api/removeInvitedUser', { styleguideId: styleguideId, userEmail: $(e.currentTarget).attr('data-email') }, function () {
                $(e.currentTarget).parent().parent().remove();
            });
        });
        overlay.fadeIn();

        $('.inviteUsersOverlay').attr('id', "overlay-" + $(e.target).parents(".styleguide")[0].id.split("-")[1]);
        $('.inviteUsersOverlay').fadeIn();
    });


}


/*
* jquery-match-height 0.7.2 by @liabru
* http://brm.io/jquery-match-height/
* License MIT
*/
!function (t) { "use strict"; "function" == typeof define && define.amd ? define(["jquery"], t) : "undefined" != typeof module && module.exports ? module.exports = t(require("jquery")) : t(jQuery) }(function (t) {
    var e = -1, o = -1, n = function (t) { return parseFloat(t) || 0 }, a = function (e) { var o = 1, a = t(e), i = null, r = []; return a.each(function () { var e = t(this), a = e.offset().top - n(e.css("margin-top")), s = r.length > 0 ? r[r.length - 1] : null; null === s ? r.push(e) : Math.floor(Math.abs(i - a)) <= o ? r[r.length - 1] = s.add(e) : r.push(e), i = a }), r }, i = function (e) {
        var o = {
            byRow: !0, property: "height", target: null, remove: !1
        }; return "object" == typeof e ? t.extend(o, e) : ("boolean" == typeof e ? o.byRow = e : "remove" === e && (o.remove = !0), o)
    }, r = t.fn.matchHeight = function (e) { var o = i(e); if (o.remove) { var n = this; return this.css(o.property, ""), t.each(r._groups, function (t, e) { e.elements = e.elements.not(n) }), this } return this.length <= 1 && !o.target ? this : (r._groups.push({ elements: this, options: o }), r._apply(this, o), this) }; r.version = "0.7.2", r._groups = [], r._throttle = 80, r._maintainScroll = !1, r._beforeUpdate = null,
        r._afterUpdate = null, r._rows = a, r._parse = n, r._parseOptions = i, r._apply = function (e, o) {
            var s = i(o), h = t(e), l = [h], c = t(window).scrollTop(), p = t("html").outerHeight(!0), u = h.parents().filter(":hidden"); return u.each(function () { var e = t(this); e.data("style-cache", e.attr("style")) }), u.css("display", "block"), s.byRow && !s.target && (h.each(function () {
                var e = t(this), o = e.css("display"); "inline-block" !== o && "flex" !== o && "inline-flex" !== o && (o = "block"), e.data("style-cache", e.attr("style")), e.css({
                    display: o, "padding-top": "0",
                    "padding-bottom": "0", "margin-top": "0", "margin-bottom": "0", "border-top-width": "0", "border-bottom-width": "0", height: "100px", overflow: "hidden"
                })
            }), l = a(h), h.each(function () { var e = t(this); e.attr("style", e.data("style-cache") || "") })), t.each(l, function (e, o) {
                var a = t(o), i = 0; if (s.target) i = s.target.outerHeight(!1); else {
                    if (s.byRow && a.length <= 1) return void a.css(s.property, ""); a.each(function () {
                        var e = t(this), o = e.attr("style"), n = e.css("display"); "inline-block" !== n && "flex" !== n && "inline-flex" !== n && (n = "block"); var a = {
                            display: n
                        }; a[s.property] = "", e.css(a), e.outerHeight(!1) > i && (i = e.outerHeight(!1)), o ? e.attr("style", o) : e.css("display", "")
                    })
                } a.each(function () { var e = t(this), o = 0; s.target && e.is(s.target) || ("border-box" !== e.css("box-sizing") && (o += n(e.css("border-top-width")) + n(e.css("border-bottom-width")), o += n(e.css("padding-top")) + n(e.css("padding-bottom"))), e.css(s.property, i - o + "px")) })
            }), u.each(function () { var e = t(this); e.attr("style", e.data("style-cache") || null) }), r._maintainScroll && t(window).scrollTop(c / p * t("html").outerHeight(!0)),
                this
        }, r._applyDataApi = function () { var e = {}; t("[data-match-height], [data-mh]").each(function () { var o = t(this), n = o.attr("data-mh") || o.attr("data-match-height"); n in e ? e[n] = e[n].add(o) : e[n] = o }), t.each(e, function () { this.matchHeight(!0) }) }; var s = function (e) { r._beforeUpdate && r._beforeUpdate(e, r._groups), t.each(r._groups, function () { r._apply(this.elements, this.options) }), r._afterUpdate && r._afterUpdate(e, r._groups) }; r._update = function (n, a) {
            if (a && "resize" === a.type) {
                var i = t(window).width(); if (i === e) return; e = i;
            } n ? o === -1 && (o = setTimeout(function () { s(a), o = -1 }, r._throttle)) : s(a)
        }, t(r._applyDataApi); var h = t.fn.on ? "on" : "bind"; t(window)[h]("load", function (t) { r._update(!1, t) }), t(window)[h]("resize orientationchange", function (t) { r._update(!0, t) })
});

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
$.fn.isInViewport_top = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height() * 0.35;

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

function convertToHTML(title) {
    title = title.replace(/&lt;/g, '<');
    title = title.replace(/&gt;/g, '>');
    title = title.replace(/&amp;/g, '&');
    title = title.replace(/&quote;/g, '"');
    title = title.replace(/&quot;/g, '"');

    return title;
}