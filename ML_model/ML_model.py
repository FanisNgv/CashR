from flask import Flask, request, jsonify
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
import numpy as np

app = Flask(__name__)

# Загружаем модель
model = load_model("lstm_model.h5")


# Метод для создания датасета
def create_dataset(dataset, look_back=1):
    dataX, dataY = [], []
    for i in range(len(dataset) - look_back):
        a = dataset[i:(i + look_back), 0]
        dataX.append(a)
        dataY.append(dataset[i + look_back, 0])
    return np.array(dataX), np.array(dataY)


# Маршрут API для приема данных
@app.route("/predict", methods=["POST", "OPTIONS"])
def receive_data():
    if request.method == "OPTIONS":
        # Возвращаем успешный ответ для предварительного запроса
        response = app.response_class(
            response="",
            status=200,
        )
    elif request.method == "POST":
        # Получение данных от пользователя
        data = request.json
        print("Получены данные:", data)

        # Преобразование данных в DataFrame
        df_transactions = pd.DataFrame(data['transactions'])
        df_transactions['dateOfTransaction'] = pd.to_datetime(df_transactions['dateOfTransaction'])

        # Агрегация данных по месяцам
        df_transactions['month'] = df_transactions['dateOfTransaction'].dt.month
        df_transactions['year'] = df_transactions['dateOfTransaction'].dt.year
        df_aggregated = df_transactions.groupby(['year', 'month']).sum()['valueOfTransaction'].reset_index()

        # Создаем датасет для модели
        all_data = df_aggregated['valueOfTransaction'].values.reshape(-1, 1)
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(all_data)
        look_back = 1
        testX, _ = create_dataset(scaled_data, look_back)

        # Предсказываем расходы на следующий месяц
        testPredict = model.predict(testX[-1].reshape(1, look_back, 1))
        predicted_value = scaler.inverse_transform(testPredict)[0][0]

        print(predicted_value)

        # Ответ клиенту с предсказанным значением
        response = jsonify({"predicted_value": predicted_value})

    # Установка заголовков CORS
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response


if __name__ == "__main__":
    app.run(debug=True, port=8080)
