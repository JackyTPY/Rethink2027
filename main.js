var finished = {};

main();

function main(){
  Generator('MedicalCenter');
  Generator('RegionalHospital');
  Generator('DistrictHospital');
  Generator('Clinic');
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
    }
    Arr.push(obj);
  })
  .on('end', function() {
    console.log(target + 'successfully read!');
    finished[target] = Arr;
    Write();
  });
}


function Write(){
  var fs = require('fs');
  var outputFilename = 'Hospitals.json';
  fs.writeFile(outputFilename, JSON.stringify(finished, null, 2), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log('JSON saved to ' + outputFilename);
      }
  });
}
