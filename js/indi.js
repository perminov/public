$(document).ready(function(){
    window.Indi = function(indi) {

        // Setup default value for indi.std property
        indi.std = '';

        /**
         * Quotes string that later will be used in regular expression.
         *
         * @param str
         * @param delimiter
         * @return {String}
         */
        indi.pregQuote = function(str, delimiter) {
            return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
        }


		/**
		 * Empty object for social networks auth functions
		 */
		indi.auth = {};
		
		/**
		 * Auth using vkontakte
		 */
		indi.auth.vk = function() {
			VK.Auth.login(function (response) {
				if (response.session) {
					VK.Api.call('getUserInfo', {}, function(r) {
						if (r.response) {
							MYid=r.response['user_id'];
							VK.Api.call('getProfiles', {uids: MYid, fields: 'nickname,photo_big',format: 'JSON'}, function(z) {
								$.post('/', {authType: 'vk', params: z.response[0]}, function(data) {
									eval(data);
								});
							});
						} 
					});	
				}
			});
			return false;
		}
		
		/**
		 * Auth using facebook
		 */
		indi.auth.fb = function(){
			FB.login(function (response) {
				if (response.authResponse) {
					FB.api('/me', function(response) {
						$.post('/', {authType: 'fb', params: response}, function(data){
							eval(data);
						});
					});
				}
			});
			return false;
		}
			
		/**
		 * Logout
		 */
		indi.auth.logout = function(){
			$.post('/', {logout: true}, function(response){
			   window.location = Indi.std + '/';
			});
            return false;
		}

		// If there is no <script> element in dom, that has 'std' attribute - return
        if (!$('script[std]').length) return indi;

        // If 'std' attribute is empty - return
        if ((indi.std = $('script[std]').attr('std')).length == 0) return indi;

        // Setup additional ajax config
        $.ajaxSetup({

            // Setup 'beforeSend' function
            beforeSend: function(xhr, options) {
 
                // If ajax url's first character is '/', but the second is not '/'
                // and url does not already starting with value of indi.std property
                if(options.url.match(/^\//) && !options.url.match(/^\/{2}/)
                    && !options.url.match(new RegExp('^(' + indi.pregQuote(indi.std) +')+\\b')))

                    // Prepend ajax url with a value of indi.std property
                    options.url = indi.std + options.url;
            }
        });

        return indi;
    }(window.Indi || {});

});




