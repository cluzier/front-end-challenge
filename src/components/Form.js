import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';

function Form(props) {
    const [merchant, setMerchant] = useState('');
    const [item, setItem] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState([]);
    const [data, setData] = useState([]);

    function handleSubmit(event) {
        event.preventDefault();
        const val = {
            merchant,
            item,
            amount,
            currency
        };
        props.func(val);
        clearState();
    }

    const clearState = () => {
        setMerchant('');
        setItem('');
        setAmount('');
        setCurrency([]);
    };

    function removeItem(event) {
        event.preventDefault()
    }

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                'https://bitpay.com/api/rates/',
            );

            setData(result.data);
        };

        fetchData();
    }, []);

    return (
        <div className="Form">
            <form onSubmit={handleSubmit}>
                <label>Merchant: </label>
                <input type="text" placeholder='Type a merchant name...' value={merchant} onChange={(e) => setMerchant(e.target.value)} />
                <label>Item: </label>
                <input type="text" placeholder='Type an item name...' value={item} onChange={(e) => setItem(e.target.value)} />
                <label>Amount (Crypto): </label>
                <input type="number" placeholder='Enter amount in crypto...' value={amount} onChange={(e) => setAmount(e.target.value)} />
                <label>Currency: </label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    {data.map(item => (
                        <option value={item.code}>{item.code}</option>
                    ))};
                </select>
                <button class="btn btn-submit" type="submit">Submit</button>
            </form>

            <br />

            <table id="customers">
                <thead>
                    <tr>
                        <th>Merchant</th>
                        <th>Item</th>
                        <th>Amount (Crypto)</th>
                        <th>Currency</th>
                        <th>Price/Crypto (USD)</th>
                        <th>Amount (USD)</th>
                        <th>Remove Item</th>
                    </tr>
                </thead>
                <tbody>
                    {data.filter(crypto => crypto.code === currency).map(crypto => (
                        <tr>
                            <td>{merchant}</td>
                            <td>{item}</td>
                            <td>{amount}</td>
                            <td>{currency}</td>
                            <td>${crypto.rate}</td>
                            <td>${amount * crypto.rate}</td>
                            <td><button>Remove Item</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Form;
