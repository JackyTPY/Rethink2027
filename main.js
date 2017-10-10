var finished = {};
var FamilyPhysicianArr = [];
var iterator = 0;
var events =['MedicalCenter','RegionalHospital','DistrictHospital','Clinic','Rank_Write','FamilyPhysician','FamilyPhysician_Write'];
var EventEmitter = require('events')
var main = new EventEmitter();

//醫療分級醫院資訊
  main.on('MedicalCenter',function(){
    Generator('MedicalCenter');
  });
  main.on('RegionalHospital',function(){
    Generator('RegionalHospital');
  });
  main.on('DistrictHospital',function(){
    Generator('DistrictHospital');
  });
  main.on('Clinic',function(){
    Generator('Clinic');
  });
  main.on('Rank_Write',function(){
    Write('Hospitals.json',finished);
  });

//24小時諮詢
  main.on('FamilyPhysician',function(){
    FamilyPhysician();
  });
  main.on('FamilyPhysician_Write', function(){
    var FamilyPhysicianObj = {};
    FamilyPhysicianObj['FamilyPhysician'] = FamilyPhysicianArr;
    Write('FamilyPhysician.json',FamilyPhysicianObj);
  });

//開始跑
main.emit(events[iterator]);

  function FamilyPhysician(){
    var csv = require('fast-csv');
    csv
    .fromPath('data/FamilyPhysicianProject.csv')
    .on('data', function(results){
      var obj = {
        GroupCode: results[3],
        Clinic: {
          Code: results[5],
          Name: results[6],
          Address: results[7],
          Phone: results[8]
        },
        Phone24hr: results[9],
        CoHospital: (function(){
          var i=10;
          var sarr = [];
          while(results[i] !== '' && results[i]!= null && i !== 24){
              var sobj = {
                Code: results[i],
                Name: results[i+1],
              }
              sarr.push(sobj);
              i = i+2;
        }
          return sarr;
        }())
      };
      FamilyPhysicianArr.push(obj);
    })
    .on('end', function() {
      console.log('FamilyPhysician successfully read!');
      if(iterator+1 !== events.length){
        main.emit(events[++iterator]);
      };
    });
  }


function Generator(target){
  var csv = require('fast-csv');
  var Arr = [];
  csv
  .fromPath('data/' + target + '.csv')
  .on('data', function(results) {
    var obj = {
      AgencyCode: results[0],
      Name: results[1],
      Type: results[2],
      Phone: results[3],
      Address: results[4],
      Rank: results[6],
      Service: results[7].split(','),
      Division: results[8].split(','),
      ConsultingHour: results[10].split('、'),
      Notice: results[11]
    };
    Arr.push(obj);
  })
  .on('end', function() {
    console.log(target + 'successfully read!');
    finished[target] = Arr;
    if(iterator+1 !== events.length){
      main.emit(events[++iterator]);
    }
  });

}


function Write(outputFilename, target){
  var fs = require('fs');
  fs.writeFile(outputFilename, JSON.stringify(target, null, 2), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log('JSON saved to ' + outputFilename);
        if(iterator+1 !== events.length){
          main.emit(events[++iterator]);
        }
      }
  });

}
