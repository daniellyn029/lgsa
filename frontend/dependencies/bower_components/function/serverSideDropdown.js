// javascript
// Client
$(document).ready( function () {
    $(".serverside_client").select2({
        ajax: {
            url: apiUrl+'global/get_client.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                var query = {
                    q: params.term, // search term
                    page: params.page 
                }
                //console.log(params);
                // Query parameters will be ?search=[term]&page=[page]
                return query;
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                params.page = params.page || 1;
                return {
                    results: data.items,
                    pagination: {
                        more: (params.page * 10) < data.total_count
                    } 
                };
            },
            transport: function (params, success, failure) {
                var $request = $.ajax(params);
                
                $request.then(success);
                $request.fail(failure);
                //console.log($request);
                return $request;
            },
            cache: true
        },
        placeholder: 'Select Client',
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection
    });
    function formatRepo(repo){
        if(repo.loading){
            return repo.text;
        }

        var $container = $(
            "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__meta'>" +
                    "<div class='select2-result-repository__title'></div>" +
                "</div>" +
            "</div>"
        );
        $container.find(".select2-result-repository__title").text(repo.client_name);

        return $container;

    }
    function formatRepoSelection (repo) {
        return repo.client_name || repo.text;
    }
});

// Employee
$(document).ready(function(){
    $(".serverside_employee").select2({
        ajax: {
            url: apiUrl+'global/get_guard.php',
            dataType: 'json',
            delay: 250,
            data: function(params){
                var query = {
                    q: params.term, // search term
                    page: params.page 
                }
                //console.log(params);
                // Query parameters will be ?search=[term]&page=[page]
                return query;
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                params.page = params.page || 1;
                return {
                    results: data.items,
                    pagination: {
                        more: (params.page * 10) < data.total_count
                    } 
                };
            },
            transport: function (params, success, failure) {
                var $request = $.ajax(params);
                
                $request.then(success);
                $request.fail(failure);
                //console.log($request);
                return $request;
            },
            cache: true
        },
        placeholder: 'Select Employee',
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection
    });
    function formatRepo(repo){
        if(repo.loading){
            return repo.text;
        }

        var $container = $(
            "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__meta'>" +
                    "<div class='select2-result-repository__title'></div>" +
                "</div>" +
            "</div>"
        );
        $container.find(".select2-result-repository__title").text(repo.fullname);

        return $container;

    }
    function formatRepoSelection (repo) {
        return repo.fullname || repo.text;
    }
});
