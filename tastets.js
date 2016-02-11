var app = angular.module('tastets', ['ui.grid', 'ui.grid.pagination']);

app.controller('DataController', DataController);

DataController.$inject=['$scope', '$http', 'uiGridConstants', 'i18nService', '$interval'];

function DataController($scope, $http, uiGridConstants, i18nService, $interval) {
    $scope.update_rate = 10;

    var timeout;

    var paginationOptions = {
      pageNumber: 1,
      pageSize: 10,
      sort: null
    };

    i18nService.setCurrentLang('es');

    $scope.gridOptions = {
      i18n:'es',
      paginationPageSizes: [5, 10, 25, 50, 100, 500, 1000],
      paginationPageSize: 10,
      useExternalPagination: true,
      useExternalSorting: true,
      columnDefs: [
        { name: 'id', enableSorting: false },
        { name: 'fecha_actualizacion', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity[col.field]*1000 | date:"medium"}}</div>'},
        { name: 'nombre', enableSorting: false },
        { name: 'velocidad', enableSorting: false }
      ],
      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
          if (sortColumns.length == 0) {
            paginationOptions.sort = null;
          } else {
            paginationOptions.sort = sortColumns[0].sort.direction;
          }
          getData();
        });
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          paginationOptions.pageNumber = newPage;
          paginationOptions.pageSize = pageSize;
          getData();
        });
      }
    };

    var getData = function() {
      var url;
      url = 'api.php'+
        '?offset=' + paginationOptions.pageNumber*paginationOptions.pageSize +
        '&limit=' + paginationOptions.pageSize;

      switch(paginationOptions.sort) {
        case uiGridConstants.ASC:
          url = url + '&sort=ASC';
          break;
        case uiGridConstants.DESC:
          url = url + '&sort=DESC';
          break;
        default:
          break;
      }

      $http.get(url)
      .success(function(data) {
        console.log(data);
        $scope.gridOptions.totalItems = data.total;
        $scope.gridOptions.data = data.datos;
      });
    };

    getData();

    $scope.start = function(){
        $scope.stop();
        timeout = $interval(function(){
            getData();
        }, $scope.update_rate*1000);
    };

    $scope.stop = function(){
        $interval.cancel( timeout );
    };
};