import React, { useEffect, useState, useContext } from 'react';
import './Modal.css'
import axios from "axios";
import SingleSelect from "../DropDown/DropDownSingle";
import MyDatePicker from "../DatePicker/DatePicker";
import { UserTransactionContext } from '../../Context';


const ModalCurrentTrans = ({ setCurrentTransModalIsOpened, transaction, setIsLoading, currentTransModalIsOpened, typesOfIncomes, typesOfOutcomes  }) => {

    
    const { user, setUser, transactions, setTransactions } = useContext(UserTransactionContext);
    const [typesOfComes, setTypesOfComes] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [sumOfTrans, setSumOfTrans] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [come, setCome] = useState("");


    useEffect(() => {
        setSelectedType(transaction.typeOfTransaction);
        setSumOfTrans(transaction.valueOfTransaction);
        setCome(transaction.come);

    }, [currentTransModalIsOpened])
    
    useEffect(() => {
        if (come === "Income") {
            setTypesOfComes(typesOfIncomes);
            console.log(typesOfIncomes);
        }
        else if (come === "Outcome") {
            setTypesOfComes(typesOfOutcomes);
            console.log(typesOfOutcomes);
        }
    }, [come])



    async function handleCreateTransClick() {
        if (!come) {
            alert('Выберите, это доход или расход!');
            return;
        } else if (come === 'Income' && selectedType === '') {
            alert('Выберите тип дохода!');
            return;
        } else if (come === 'Outcome' && selectedType === '') {
            alert('Выберите тип расхода!');
            return;
        } else if (!sumOfTrans) {
            alert('Введите сумму транзакции!');
            return;
        }

        const transaction = {
            userID: user.id,
            come: come,
            valueOfTransaction: come === 'Outcome' ? -parseFloat(sumOfTrans) : parseFloat(sumOfTrans),
            typeOfTransaction: selectedType.label,
            dateOfTransaction: startDate,
        };

        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }

        try {
            axios.post('http://localhost:5000/user/createTransaction', transaction, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => {
                    const newTransaction = res.data.transaction;
                    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });


            const { data: response } = await axios.get('http://localhost:5000/auth/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser({
                ...user,
                balance: response.balance,
            });

            setStartDate(new Date());
            setIsLoading(false);

        } catch (error) {
            console.error(error.message);
            setIsLoading(false);
            alert('Произошла ошибка при создании транзакции');
        }
    }


    return (
        <div className={currentTransModalIsOpened ? "modal active" : "modal"} onClick={function () { setCurrentTransModalIsOpened(false) }}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>

                <h1>Выберите тип транзакции:</h1>
                <div className="come">
                    <div className="Income">
                        <input
                            type="radio"
                            name="come"
                            id="Income"
                            value="Income"
                            checked={come === 'Income'}
                            onChange={(e) => setCome(e.target.value)}
                        />
                        <label htmlFor="Income">Доход</label>
                    </div>
                    <div className="Outcome">
                        <input
                            type="radio"
                            name="come"
                            id="Outcome"
                            value="Outcome"
                            checked={come === 'Outcome'}
                            onChange={(e) => setCome(e.target.value)}
                        />
                        <label htmlFor="Outcome">Расход</label>
                    </div>
                </div>
                <br />
                <h1>Выберите категорию:</h1>
                <SingleSelect defaultOption={selectedType} typesOfComes={typesOfComes} setSelectedType={setSelectedType} selectedType={selectedType} />
                <br />

                <h1>Введите сумму:</h1>
                <div className="amountOfTrans">
                    <input type="number" placeholder={"Введите сумму"} onChange={(e) => setSumOfTrans(e.target.value)} required />
                </div>

                <h1>Введите дату:</h1>
                <div className="dateOfTrans">
                    <MyDatePicker wrapperClassName="datePicker" startDate={startDate} setStartDate={setStartDate} />
                </div>
                <div className="addButton">
                    <button onClick={handleCreateTransClick}>Создать</button>
                </div>
            </div>
        </div>
    );
};
export default ModalCurrentTrans;