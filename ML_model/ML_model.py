from flask import Flask, request, jsonify
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
import numpy as np

app = Flask(__name__)

# Загружаем модель
outcomes_model = load_model("lstm_outcomes_model.h5")
incomes_model = load_model("lstm_incomes_model.h5")

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

        # Преобразование 'valueOfTransaction' во float
        df_transactions['valueOfTransaction'] = df_transactions['valueOfTransaction'].astype(float)

        # Агрегация данных по месяцам
        df_transactions['month'] = df_transactions['dateOfTransaction'].dt.month
        df_transactions['year'] = df_transactions['dateOfTransaction'].dt.year

        # Разделение на доходы и расходы
        df_income = df_transactions[df_transactions['come'] == 'Income']
        df_expense = df_transactions[df_transactions['come'] == 'Outcome']
        # Агрегация данных по месяцам для доходов и расходов
        df_income_aggregated = df_income.groupby(['year', 'month'])['valueOfTransaction'].sum().reset_index()
        df_expense_aggregated = df_expense.groupby(['year', 'month'])['valueOfTransaction'].apply(
            lambda x: x.abs().sum()).reset_index()
        # Создаем последовательность данных для модели для доходов и расходов
        income_all_data = df_income_aggregated['valueOfTransaction'].values.reshape(-1, 1)
        expense_all_data = df_expense_aggregated['valueOfTransaction'].values.reshape(-1, 1)

        # Преобразование данных для модели
        income_scaler = MinMaxScaler(feature_range=(0, 1))
        expense_scaler = MinMaxScaler(feature_range=(0, 1))

        income_scaled_data = income_scaler.fit_transform(income_all_data)
        expense_scaled_data = expense_scaler.fit_transform(expense_all_data)

        # Определяем количество шагов назад для прогнозирования
        look_back = 1

        # Создаем датасет для модели для доходов и расходов
        income_dataset = []
        expense_dataset = []
        for i in range(len(income_scaled_data) - look_back):
            income_dataset.append(income_scaled_data[i:i + look_back])
            expense_dataset.append(expense_scaled_data[i:i + look_back])
        income_dataset = np.array(income_dataset)
        expense_dataset = np.array(expense_dataset)

        # Предсказываем доходы и расходы на следующий месяц
        if len(income_dataset) > 0:
            income_testPredict = incomes_model.predict(income_dataset[-1].reshape(1, look_back, 1))
            income_predicted_value = round(income_scaler.inverse_transform(income_testPredict)[0][0], 2)
        else:
            income_predicted_value = 0  # или другое значение по умолчанию, если нет данных для предсказания

        if len(expense_dataset) > 0:
            expense_testPredict = outcomes_model.predict(expense_dataset[-1].reshape(1, look_back, 1))
            expense_predicted_value = round(expense_scaler.inverse_transform(expense_testPredict)[0][0], 2)
        else:
            expense_predicted_value = 0

        print(expense_predicted_value, " ", income_predicted_value)
        # Ответ клиенту с предсказанными значениями
        income_predicted_value = str(round(income_scaler.inverse_transform(income_testPredict)[0][0], 2))
        expense_predicted_value = str(round(expense_scaler.inverse_transform(expense_testPredict)[0][0], 2))

        response = jsonify({
            "income_predicted_value": income_predicted_value,
            "expense_predicted_value": expense_predicted_value
        })

    # Установка заголовков CORS
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response

if __name__ == "__main__":
    app.run(debug=True, port=8080)
