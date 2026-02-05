import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";

export function SalesPage() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5250/api/productsale/product-sales');
            const result = await response.json();
      
            if (result.message === 'Success') {
                setSales(result.data);
                console.log(result.data);
            } else {
            setError('Failed to fetch sales');
            }
        } catch (err) {
            setError('Error fetching sales: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const navigateBack = () => {
        navigate("/");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
    return (
        <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
        </div>
        </div>
    );
    }

    return (
    <>
       <div className="columns-2">
            <div className="justify-self-start font-sans text-5xl font-bold p-5">Product Sales</div>
            <div className="justify-self-end">
                <button className="btn btn-accent btn-wide m-5 w-40" onClick={fetchSales}>Refresh</button>
                <button className="btn btn-outline btn-wide m-5 w-40" onClick={navigateBack}>Go Back</button>
            </div>
        </div>
    </>
    );
}