import os
import pickle
import pandas as pd
from flask import Flask,request,Response
from healthinsurance.HealthInsurance import HealthInsurance

#loading model
path = ''
with open(path + 'model/xgb_model.pkl','rb') as MODEL:
            model   = pickle.load(MODEL)

#inicializar a API
app = Flask(__name__)

@app.route('/predict',methods=['POST']) #API só recebe

def health_insurance_predict():
    test_json = request.get_json()
    
    if test_json:
        if isinstance(test_json,dict): #recebi uma linha
            test_raw = pd.DataFrame(test_json,index=[0])
            
            
        else: #recebi mais de uma linha
            test_raw = pd.DataFrame(test_json,columns=test_json[0].keys())
            
            
        pipeline = HealthInsurance()
        #Aplicando as funções para deixar os dados prepatados para a predição
        df1 = pipeline.data_cleaning(test_raw)
        df2 = pipeline.feature_engeneering(df1)
        df3 = pipeline.data_preparation(df2)
        df_response = pipeline.get_predict(model,test_raw,df3)
        
        return df_response
    
    else:
        return Response('{}',status=200,mimetype='application/json')
    
if __name__ == '__main__':
    port = os.environ.get('PORT', 5000)
    app.run(host='0.0.0.0', port=port)  # Indica o local hold