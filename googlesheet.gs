function OnOpen() {
  var ui = SpreadsheetApp.getUi()
  ui.createMenu('Health Insurance - PA004')
    .addItem('Get Prediction','PredictAll_3')
    .addToUi();
}

host_production = 'healthinsurance-in-production-ian.onrender.com'
host_production_2 = 'healthinsurance-to-go.onrender.com'

//Helper Function
function APICall(data,endpoint) {
  var url = 'https://' + host_production + endpoint;
  var payload = JSON.stringify(data);
  var options = {'method':'POST','contentType':'application/json','payload':payload};
  var response = UrlFetchApp.fetch(url,options);

  //get response
  var rc = response.getResponseCode();
  var responseText = response.getContentText();
  if (rc !== 200){
    Logger.log('Response (%s) %s',rc,responseText);
  }
  else{
    prediction = JSON.parse(responseText);
  }
  return prediction

};

function APICall_2(data,endpoint) {
  var url = 'https://' + host_production_2 + endpoint;
  var payload = JSON.stringify(data);
  var options = {'method':'POST','contentType':'application/json','payload':payload};
  var response = UrlFetchApp.fetch(url,options);

  //get response
  var rc = response.getResponseCode();
  var responseText = response.getContentText();
  if (rc !== 200){
    Logger.log('Response (%s) %s',rc,responseText);
  }
  else{
    prediction = JSON.parse(responseText);
  }
  return prediction

};

function PredictAll() {
  var ss = SpreadsheetApp.getActiveSheet();
  var titleColumns = ss.getRange('A1:L1').getValues()[0];
  var lastRow = ss.getLastRow()

  var data = ss.getRange('A2'+':'+'L'+lastRow).getValues();


  // run over all rows
  for (row in data){
    var json = new Object();

    // run over all columns
    for(var j=0;j < titleColumns.length;j++){
      json[titleColumns[j]] = data[row][j];
    };

    // lista de json para enviar
    var json_send = new Object();

    json_send['id'] = json['id']
    json_send['Gender'] = json['Gender']
    json_send['Age'] = json['Age']
    json_send['Driving_License'] = json['Driving_License']
    json_send['Region_Code'] = json['Region_Code']
    json_send['Previously_Insured'] = json['Previously_Insured']
    json_send['Vehicle_Age'] = json['Vehicle_Age']
    json_send['Vehicle_Damage'] = json['Vehicle_Damage']
    json_send['Annual_Premium'] = json['Annual_Premium']
    json_send['Policy_Sales_Channel'] = json['Policy_Sales_Channel']
    json_send['Vintage'] = json['Vintage']
    json_send['Response'] = json['Response']
    
    //Realiza a predição e guarda o json em pred
    pred = APICall(json_send,'/predict');
    var score = pred[0]['score'];


    //Send back to google sheets
    ss.getRange(Number(row)+2,13).setValue(pred[0]['score'])


  };
};



function PredictAll_2() {
  var ss = SpreadsheetApp.getActiveSheet();
  var titleColumns = ss.getRange('A1:L1').getValues()[0];
  var lastRow = ss.getLastRow();

  var data = ss.getRange('A2:L' + lastRow).getValues();

  // array para armazenar os scores e os índices correspondentes
  var scoresWithIndex = [];

  // percorrer todas as linhas
  for (var row = 0; row < data.length; row++) {
    var json = {};

    // percorrer todas as colunas
    for (var col = 0; col < titleColumns.length; col++) {
      json[titleColumns[col]] = data[row][col];
    }

    // lista de json para enviar
    var json_send = {};
    json_send['id'] = json['id'];
    json_send['Gender'] = json['Gender'];
    json_send['Age'] = json['Age'];
    json_send['Driving_License'] = json['Driving_License'];
    json_send['Region_Code'] = json['Region_Code'];
    json_send['Previously_Insured'] = json['Previously_Insured'];
    json_send['Vehicle_Age'] = json['Vehicle_Age'];
    json_send['Vehicle_Damage'] = json['Vehicle_Damage'];
    json_send['Annual_Premium'] = json['Annual_Premium'];
    json_send['Policy_Sales_Channel'] = json['Policy_Sales_Channel'];
    json_send['Vintage'] = json['Vintage'];
    json_send['Response'] = json['Response'];

    // Realiza a predição e guarda o score e o índice
    var pred = APICall(json_send, '/predict');
    var score = pred[0]['score'];

    // Adiciona o score, o índice e os dados à matriz de scores com índices correspondentes
    scoresWithIndex.push([score, row, data[row]]);
  }

  // Ordena a matriz de scores com base no score em ordem decrescente
  scoresWithIndex.sort(function(a, b) {
    return b[0] - a[0];
  });

  // Reorganiza a matriz de dados com base nos índices ordenados
  var sortedData = scoresWithIndex.map(function(item) {
    return item[2].concat([item[0]]);
  });

  // Atualiza a planilha com os valores ordenados e o score
  ss.getRange('A2:M' + lastRow).clearContent();
  ss.getRange('A2:M' + lastRow).setValues(sortedData);
};





function PredictAll_3() {
  var ss = SpreadsheetApp.getActiveSheet();
  var titleColumns = ss.getRange('A1:K1').getValues()[0];
  var lastRow = ss.getLastRow();

  var data = ss.getRange('A2:K' + lastRow).getValues();

  // array para armazenar os scores e os índices correspondentes
  var scoresWithIndex = [];

  // percorrer todas as linhas
  for (var row = 0; row < data.length; row++) {
    var json = {};

    // percorrer todas as colunas
    for (var col = 0; col < titleColumns.length; col++) {
      json[titleColumns[col]] = data[row][col];
    }

    // lista de json para enviar
    var json_send = {};
    json_send['id'] = json['id'];
    json_send['Gender'] = json['Gender'];
    json_send['Age'] = json['Age'];
    json_send['Driving_License'] = json['Driving_License'];
    json_send['Region_Code'] = json['Region_Code'];
    json_send['Previously_Insured'] = json['Previously_Insured'];
    json_send['Vehicle_Age'] = json['Vehicle_Age'];
    json_send['Vehicle_Damage'] = json['Vehicle_Damage'];
    json_send['Annual_Premium'] = json['Annual_Premium'];
    json_send['Policy_Sales_Channel'] = json['Policy_Sales_Channel'];
    json_send['Vintage'] = json['Vintage'];

    // Realiza a predição e guarda o score e o índice
    var pred = APICall_2(json_send, '/predict');
    var score = pred[0]['score'];

    // Adiciona o score, o índice e os dados à matriz de scores com índices correspondentes
    scoresWithIndex.push([score, row, data[row]]);
  }

  // Ordena a matriz de scores com base no score em ordem decrescente
  scoresWithIndex.sort(function(a, b) {
    return b[0] - a[0];
  });

  // Reorganiza a matriz de dados com base nos índices ordenados
  var sortedData = scoresWithIndex.map(function(item) {
    return item[2].concat([item[0]]);
  });

  // Atualiza a planilha com os valores ordenados e o score
  ss.getRange('A2:L' + lastRow).clearContent();
  ss.getRange('A2:L' + lastRow).setValues(sortedData);
};




