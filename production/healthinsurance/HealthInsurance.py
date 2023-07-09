import pickle
import pandas as pd
import numpy as np

#Class Definition
class HealthInsurance:
    def __init__(self):
        self.home_path = ''
        with open(self.home_path + 'parameters/annual_premium_scaler.pkl','rb') as M1:
            self.annual_premmium_scaler   = pickle.load(M1)
        with open(self.home_path + 'parameters/age_scaler.pkl','rb') as M2:
            self.age_scaler   = pickle.load(M2)
        with open(self.home_path + 'parameters/gender_scaler.pkl','rb') as M3:
            self.gender_scaler   = pickle.load(M3)
        with open(self.home_path + 'parameters/policy_sales_channel_scaler.pkl','rb') as M4:
            self.policy_sales_channel_scaler   = pickle.load(M4)
        with open(self.home_path + 'parameters/region_code_scaler.pkl','rb') as M5:
            self.region_code_scaler   = pickle.load(M5)
        with open(self.home_path + 'parameters/vintage_scaler.pkl','rb') as M6:
            self.vintage_scaler   = pickle.load(M6)
            
    def data_cleaning(self,df1):
        cols_new = ['id', 'gender', 'age', 'driving_license', 'region_code',
               'previously_insured', 'vehicle_age', 'vehicle_damage', 'annual_premium',
               'policy_sales_channel', 'vintage', 'response']
        #Renomeando o nome das colunas
        df1.columns = cols_new
        
        return df1

    def feature_engeneering(self,df2):
        #vehicle age
        df2['vehicle_age'] = df2['vehicle_age'].apply(lambda x: 'over_2_years' if x == '> 2 Years' else 'between_1_2_years' if x == '1-2 Year' else 'below_1_year')
        #vehicle damage
        df2['vehicle_damage'] = df2['vehicle_damage'].apply(lambda x: 1 if x == 'Yes' else 0)
        
        return df2
    
    def data_preparation(self,df5):

        ## Standardization
        #annual_premium
        df5['annual_premium'] = self.annual_premmium_scaler.transform(df5[['annual_premium']].values) #Precisa estar um array para funcionar


        ## Rescaling
        #age - distribuição longe da normal
        df5['age'] = self.age_scaler.transform(df5[['age']].values)

        #vintage
        df5['vintage'] = self.vintage_scaler.transform(df5[['vintage']].values)

        ## Encoder
        #Para descobrir o melhor encoding tem que testar
        #Label Encoding - 0 ou 1
        #One Hot Encoding - Indica um estado
        #gender
        df5.loc[:,'gender'] = df5['gender'].map(self.gender_scaler)


        #region_code -  / Frequency Encoding / Target Encoding / Weighted Target Encoding
        #Tem muitas categorias, mais de 6, não usa o One Hoting Encoding, aumentaria muito a dimensionalidade do dataset
        df5.loc[:,'region_code'] = df5['region_code'].map(self.region_code_scaler) #Todas as linhas recebem os valores
        #Substitui a feature com base na variável resposta

        #vehicle_age - One Hot Encoding / Order Encoding / Frequency Encoding
        df5 = pd.get_dummies(df5, prefix='vehicle_age',columns=['vehicle_age'])

        #policy_sales_channel - distribuição muito uniforme - Target Encoding / Frequency Encoding
        df5.loc[:,'policy_sales_channel'] = df5['policy_sales_channel'].map(self.policy_sales_channel_scaler)
        #Frequência que ela aparece

        cols_selected = ['vintage','annual_premium','age','region_code','vehicle_damage','policy_sales_channel','previously_insured']

        return df5[cols_selected]
    
    
    def get_predict(self,model,original_data,test_data):
        #model prediction
        pred = model.predict_proba(test_data)
        
        #join prediction into original data
        original_data['score'] = pred[:, 1].tolist()
        
        return original_data.to_json(orient='records')
