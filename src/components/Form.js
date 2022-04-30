import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';

function Form() {
    const [merchant, setMerchant] = useState('');
    const [item, setItem] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState([]);

    const [data, setData] = useState([]);
    const [customInput, setCustomInput] = useState([]);

    function handleSubmit(event) {
        event.preventDefault();
        setCustomInput(customInput => [...customInput, { merchant, item, amount, currency, }]);
        clearState();
    }

    const clearState = () => {
        setMerchant('');
        setItem('');
        setAmount('');
        setCurrency([]);
    };

    useEffect(() => {
        const fetchData = async () => {
            console.log('fetching data');
            const result = await axios(
                'https://bitpay.com/api/rates/',
            );
            //reduce this so you can use a better data structure for n(1) lookup based on currency to look for rate compared to BTC
            setData(result.data.reduce((prev, curr) => {
                prev[curr.code] = {};
                prev[curr.code].name = curr.name;
                prev[curr.code].rate = curr.rate;

                return prev;
            }, {}));
        };
        fetchData();
        const interval = setInterval(fetchData, 120000)
        return () => clearInterval(interval)
    }, []);

    useEffect(() => {
        const savedCustomInputs = JSON.parse(localStorage.getItem('customInput'));
        if (savedCustomInputs) {
            setCustomInput(savedCustomInputs);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(customInput));
    }, [customInput]);

    return (
        <div className="Form">
            <form onSubmit={(e) => handleSubmit(e)}>
                <label>Merchant: </label>
                <input type="text" placeholder='Type a merchant name...' value={merchant} onChange={(e) => setMerchant(e.target.value)} />
                <label>Item: </label>
                <input type="text" placeholder='Type an item name...' value={item} onChange={(e) => setItem(e.target.value)} />
                <label>Amount (Crypto): </label>
                <input type="number" placeholder='Enter amount in crypto...' value={amount} onChange={(e) => setAmount(e.target.value)} />
                <label>Currency: </label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    {Object.keys(data).map(currency => (
                        <option value={currency}>{currency}</option>
                    ))};
                </select>
                <button type="submit">Submit</button>
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
                        <th>Edit Item</th>
                        <th>Remove Item</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {Object.keys(data).filter(crypto => crypto === currency).map(crypto => (
                        <tr>
                            <td>{data[crypto].merchant}</td>
                            <td>{data[crypto].item}</td>
                            <td>{data[crypto].amount}</td>
                            <td>{data[crypto].currency}</td>
                            <td>{data[crypto].rate.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                            <td>{(amount * data[crypto].rate).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                            <td><button>Edit Item</button></td>
                            <td>
                                <button onClick={() => {
                                    setCustomInput(prev => {
                                        let newState = [...prev];
                                        newState.splice(data[crypto], 1);
                                        return newState;
                                    })
                                }}>
                                    Remove Item
                                </button>
                            </td>
                        </tr>
                    ))} */}
                    {customInput.map(customData =>
                        <tr>
                            <td>{customData.merchant}</td>
                            <td>{customData.item}</td>
                            <td>{customData.amount}</td>
                            <td>{customData.currency}</td>
                            <td>{data[customData.currency].rate.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                            <td>{(customData.amount * data[customData.currency].rate).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                            <td><button>Edit Item</button></td>
                            <td>
                                <button onClick={() => {
                                    setCustomInput(prev => {
                                        let newState = [...prev];
                                        newState.splice(customData, 1);
                                        return newState;
                                    })
                                }}>
                                    Remove Item
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Form;